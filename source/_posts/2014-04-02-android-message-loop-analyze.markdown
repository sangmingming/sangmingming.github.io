---
layout: post
title: "Android消息循环分析"
date: 2014-04-02 23:53:59 +0800
comments: true
tags:  android
---


我们的常用的系统中，程序的工作通常是有事件驱动和消息驱动两种方式，在Android系统中，Java应用程序是靠消息驱动来工作的。

消息驱动的原理就是：       
		1. 有一个消息队列，可以往这个队列中投递消息;      
		2. 有一个消息循环，不断从消息队列中取出消息，然后进行处理。       
在Android中通过Looper来封装消息循环，同时在其中封装了一个消息队列MessageQueue。       
另外Android给我们提供了一个封装类，来执行消息的投递，消息的处理，即Handler。   
<!--more--> 
#### 在我们的线程中实现消息循环时，需要创建Looper，如：

```
class LooperThread extends Thread {
	public Handler mHandler;
	public void run() {
		Looper.prepare(); //1.调用prepare
		......
		Looper.loop();	//2.进入消息循环
	}
}
```
看上面的代码，其实就是先准备Looper，然后进入消息循环。     
1. 在prepare的时候，创建一个Looper，同时在Looper的构造方法中创建一个消息队列MessageQueue，同时将Looper保存到TLV中`（这个是关于ThreadLocal的，不太懂，以后研究了再说）`     
2. 调用loop进入消息循环，此处其实就是不断到MessageQueue中取消息`Message`，进行处理。     

#### 然后再看我们如何借助Handler来发消息到队列和处理消息

Handler的成员(非全部)：    
```
final MessageQueue mQueue;    
final Looper mLooper;    
final Callback mCallback;    
```

Message的成员(非全部)：    
```
Handler target;            
Runnable callback;         
```

可以看到Handler的成员包含Looper，通过查看源代码，我们可以发现这个Looper是有两种方式获得的，1是在构造函数传进来，2是使用当前线程的Looper（如果当前线程无Looper，则会报错。我们在Activity中创建Handler不需要传Handler是因为Activity本身已经有一个Looper了），MessageQueue也就是Looper中的消息队列。

然后我们看怎么向消息队列发送消息，Handler有很多方法发送队列（这个自己可以去查），比如我们看sendMessageDelayed（Message msg， long delayMillis）
```
public final boolean sendMessageDelayed(Message msg, long delayMillis) {
	if (delayMillis < 0) {    
		delayMillis = 0;    
	}
	return sendMessageAtTime(msg, SystemClock.uptimeMillis() + delayMillis);      
// SystemClock.uptimeMillis() 获取开机到现在的时间    
} 
	//最终所有的消息是通过这个发，uptimeMillis是绝对时间（从开机那一秒算起）
public boolean sendMessageAtTime(Message msg, long uptimeMillis) {    
	boolean sent = false;    
	MessageQueue queue = mQueue;    
	if (queue != null) {    
		msg.target = this;    
		sent = queue.enqueueMessage(msg, uptimeMillis);    
	}   
	return sent;   
}    
```   
看上面的的代码，可以看到Handler将自己设为Message的target，然后然后将msg放到队列中，并且指定执行时间。

#### 消息处理
处理消息，即Looper从MessageQueue中取出队列后，调用msg.target的dispatchMessage方法进行处理，此时会按照消息处理的优先级来处理：    
1. 若msg本身有callback，则交其处理;    
2. 若Handler有全局callback,则交由其处理;    
3. 以上两种都没有，则交给Handler子类实现的handleMessage处理，此时需要重载handleMessage。    

我们通常采用第三种方式进行处理。

### 注意！！！！我们一般是采用多线程，当创建Handler时，LooperThread中可能还未完成Looper的创建，此时，Handler中无Looper，操作会报错。

我们可以采用Android为我们提供的HandlerThread来解决，该类已经创建了Looper，并且通过wait/notifyAll来避免错误的发生，减少我们重复造车的事情。我们创建该对象后，调用getLooper（）即可获得Looper（Looper未创建时会等待）。

#### 补充
本文所属为Android中java层的消息循环机制，其在Native层还有消息循环，有单独的Looper。并且2.3以后MessageQueue的核心向Native层下移，native层java层均可以使用。这个我没有过多的研究了！哈哈

###### PS：本文参考《深入理解Android：卷I》




