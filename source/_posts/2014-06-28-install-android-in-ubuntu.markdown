---
layout: post
title: "在Ubuntu下配置Android开发环境"
date: 2014-06-28 17:56:05 +0800
comments: true
tags: ['android','ubuntu']
---


主要包括：`jdk`  `idea` `android sdk`

### 安装JDK

```
sudo add-apt-repository ppa:webupd8team/java   #添加源
sudo apt-get update  						  #更新仓库
sudo apt-get install oracle-java7-installer     #安装java7
```

执行
```
java -version
```
检查java版本，确保已经正确安装jdk
<!--more-->
最后执行
```
sudo apt-get install oracle-java7-set-default
```
将设置java7到系统的环境变量中（这样就不需要自己配置了）

### 安装JetBrains IntelliJIDEA
打开这个页面[http://www.jetbrains.com/idea/download/](http://www.jetbrains.com/idea/download/) 下载Community Edition。
下载回来后，解压即可。

### 安装Android SDK
到这个页面[https://developer.android.com/sdk/index.html](https://developer.android.com/sdk/index.html)，下载SDK Tools，选择最后一个Download For Other Platforms，下面的SDK Tools Only，选择对应平台，linux的是[http://dl.google.com/android/android-sdk_r22.6.2-linux.tgz](http://dl.google.com/android/android-sdk_r22.6.2-linux.tgz)。     
下载回来后，解压即可。

### 第一次启动
启动IDEA，创建一个Android 项目，会提示你设置JDK和Android SDK。这就OK了。


>原文地址：[http://blog.isming.me/2014/06/28/install-android-in-ubuntu](http://blog.isming.me/2014/06/28/install-android-in-ubuntu)，转载请注明出处。