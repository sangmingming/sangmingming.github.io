---
layout: post
title: "管理Activity的生命周期"
date: 2014-03-25 19:48:47 +0800
comments: true
tags: android
---

Activity是android的四大组件之一，我们编写程序时，主要通过Activity来显示我们的UI。我们需要了解他的生命周期，以及 每个周期可以做什么。
一个Activity存在三种状态：

#### Resumed：
activity显示在屏幕的最前面，并且获取用户焦点。 
#### Paused：
其他activity在当前activity之前，并获得焦点。当前activity还能够部分显示，仍然维护着所有状态，当内存低的时候才会被系统杀死。

#### Stopped：
当前activity完全不可见。但是仍然存在，其他应用需要内存的时候会被杀死（不一定是低内存的时候）。

<!--more-->
#### 具体生命周期见图：
![](http://isming.qiniudn.com/activity_lifecycle.png)

1. 启动Activity
执行onCreate（） --> onStart（） --> onResumed()    
这个过程执行完，我们的activity就显示在屏幕上了。    
我们可以重写相应的方法，在其中实现我们需要的操作。    
2. 销毁Activity
当我们执行`finish（）`或者被系统强制杀死时，我们的activity会被销毁。    
我们的activity内部会执行 onPause（）-->onStop()->onDestory()    
3. 暂停和继续    
当我们的界面被部分挡住时，会进入暂停状态。    
此时会执行onPause（）    
界面重新完全显示后又会回到继续状态（Resumed），会执行onResumed（）    
在即将pause时，我应应该在onPause中执行一些释放操作，比如停止正在进行的动画，一些用户的状态（确定用户会保存的，比如邮件草稿），释放系统支援（如广播接收者，传感器），以及其他会消耗电池并且在paused时用户不需要用到的。    
同时这些释放或者保存的，我们在onResumed时候需要恢复。    
4. 停止和重启
用户进去其他界面之后，如接听电话，或者打开其他activity，我们的界面会停止，进入stoped状态。此时会执行onPause（）-->onStop()    
重启时会执行onRestart（）-->onStart()-->onResume()    
重启时候和我们创建时相比，多一步onRestart（）。    
​在stop的时候，我们需要执行一些比在onPause中更加消耗CPU的更大的任务，比如写数据库。    
​同时建议，在onStart（）中恢复，而不是在onRestart（）中恢复。     
5. 重新创建Activity   
​ ​当我们的进程被destory（不是用户主动调用finish），可以返回。返回的时候会重新创建。执行过程和创建activity一样。    
​当activity被系统kill之前，会调用onSaveInstanceState（）去保存UI状态，如果我们有信息需要保存，也可以去重写这个方法去做。   
同时我们可以重写onRestoreInstanceState（）去恢复状态。不重写，系统会恢复系统保存的那一部分UI。或者我们可以在onCreate中恢复，onCreate的参数savedInstanceState就是我们保存的信息，可以判断该参数是否为空，来恢复界面。
