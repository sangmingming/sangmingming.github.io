---
layout: post
title: "Android图像开源视图：SmartImageView"
date: 2013-09-11 23:19:11 +0800
comments: true
tags: android
---

项目需要，开发中需要加载图片，自己要写图片从网上下载的方法，还要写缓存，等等。  

在网上找到一个开源项目，smartImageVIew，支持从URL和通讯录中获取图像，可以替代Android标准的ImageView。

特征：

    根据URL地址装载图像；
    支持装载通讯录中的图像；
    支持异步装载；
    支持缓存；
    
这个是作者的项目主页，有使用方法。

http://loopj.com/android-smart-image-view/

下载作者的jar包导入项目后，在xml中加入控件

    <com.loopj.android.image.SmartImageView android:id="@+id/my_image" />    
    
代码里找到该控件

    SmartImageView myImage = (SmartImageView) this.findViewById(R.id.my_image); 
       
使用控件

通过url加载图片

    myImage.setImageUrl("http://www.awesomeimages.com/myawesomeimage.jpg");   
    
加载通讯录的图片

    myImage.setImageContact(contactAddressBookId);  
     
github上面有源码，需要的可以看看：

    https://github.com/loopj/android-smart-image-view    
