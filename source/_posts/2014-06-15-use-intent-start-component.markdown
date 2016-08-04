---
layout: post
title: "使用Intent启动组件"
date: 2014-06-15 23:19:37 +0800
comments: true
tags: ['android', 'intent'] 
---



android应用程序的三大组件——Activities、Services、Broadcast Receiver，通过消息触发，这个消息就是Intent，中文又翻译为"意图"(我感觉读着不顺畅,还是读英文)。我们可以通过Intent去启动三大组件，并且通过Intent携带数据到其他组件中。本文来看一下怎么使用Intent启动组件，以及Intent的过滤规则。

##	Intent对象

首先来看Intent对象中包含的成员。
<!--more-->

```java
private String mAction;   //动作
private Uri mData;		  //数据
private String mType;
private String mPackage;   //包名
private ComponentName mComponent;  //组件名 包含程序包名+类名，以及应用包名
private int mFlags;			//标志
private HashSet<String> mCategories;   //种类
private Bundle mExtras;    //附加信息
private Rect mSourceBounds;
private Intent mSelector;
private ClipData mClipData;
```

看Intent的源码，主要包含以上成员。

## Intent解析

Intent解析有两种方式：显式解析和隐式解析。

显式解析，我们直接传组件进入，打开这个指定的组件，比较简单，通常应用程序内使用。		
比如我们创建一个显式的Intent：

```java
Intent intent = new Intent(context, OtherActivity.class);
```

隐式解析，没有指定具体的组件，通过规则去匹配组件。通常用于多个程序之间的互相调用比较多。我们使用隐式解析式，action、data（包括URI和数据类型）、category都必须有。比如我们启动浏览器去打开一个网址，intent可以这样创建：

```java
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.setData(Uri.parse("http://blog.isming.me"));
```

上面没有填写category，创建Intent的时候会自动填写为default。


##等待补充吧。



####乱扯

好吧，本来像，会写的很长的，但是真正想写的时候，发现就这么简单，也没什么好写的。下次多看看源码，再看有没有要补充的。就酱紫了！