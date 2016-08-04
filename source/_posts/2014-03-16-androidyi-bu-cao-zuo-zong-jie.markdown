---
layout: post
title: "android异步操作总结"
date: 2014-03-16 16:18:25 +0800
comments: true
tags: android
---

Android中经常会有一些操作比如网络请求，文件读写，数据库操作，比较耗时，我们需要将其放在非UI线程去处理，此时，我们需要处理任务前后UI的变化和交互。我们需要通过类似js中异步请求处理，这里总结我所了解到的，方便自己记忆，也方便别人的浏览。

1. AsyncTask

> new AysncTask().execute();

AsyncTask会按照流程执行在UI线程和一个耗时的任务线程。

<!--more-->

1.onPreExecute() 执行预处理，它运行于UI线程，可以为后台任务做一些准备工作，比如绘制一个进度条控件。

2.doInBackground(Params...) 后台进程执行的具体计算在这里实现，doInBackground(Params...)是AsyncTask的关键，此方法必须重载。在这个方法内可以使用publishProgress(Progress...)改变当前的进度值。

3.onProgressUpdate(Progress...) 运行于UI线程。如果在doInBackground(Params...) 中使用了publishProgress(Progress...)，就会触发这个方法。在这里可以对进度条控件根据进度值做出具体的响应。

4.onPostExecute(Result) 运行于UI线程，可以对后台任务的结果做出处理，结果就是doInBackground(Params...)的返回值。此方法也要经常重载，如果Result为null表明后台任务没有完成(被取消或者出现异常)。

2. Handler
创建Handler时需要传Lopper，默认是UI线程的。
通过Handler发送消息（Message）到主线程或者Handler的线程，

3. Activity.runOnUiThread(Runnable)
Runnable即可在UI线程执行

4. View.post(Runnable)
	Runnable运行在UI线程
View.post(Runnable)方法。在post(Runnable action)方法里，View获得当前线程（即UI线程）的Handler，然后将action对象post到Handler里。在Handler里，它将传递过来的action对象包装成一个Message（Message的callback为action），然后将其投入UI线程的消息循环中。在Handler再次处理该Message时，有一条分支（未解释的那条）就是为它所设，直接调用runnable的run方法。而此时，已经路由到UI线程里，因此，我们可以毫无顾虑的来更新UI。


## 所有的异步操作原理本质都是通过Handler

基本上就这几种放大，当然也可自己使用消息循环常见类似的任务处理机制。