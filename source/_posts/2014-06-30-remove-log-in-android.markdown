---
layout: post
title: "发布程序时移除Android 调试Log"
date: 2014-06-30 16:21:00 +0800
comments: true
tags: ['android','gradle']
---


在Android开发中，我们使用android.util.Log来打印日志，方便我们的开发调试。但是对于正式发布的程序，我们并不希望这些Log信息显示，一方面对于用户来说影响机器性能，另一方面，其他开发者看到这些信息的时候，对我们应用程序的安全是有威胁的。所以，我们需要在正式发布时不让Log执行，或者将其移除。这里，我提供三种方法。

### 自己写一个Log的帮助类，在类中设置显示级别

示例代码如下，通过一个静态变量设置Log的显示级别。
<!--more-->

```java
public class Log {
  public static int logLevel = Log.VERBOSE;

  public static void i(String tag, String msg) {
      if (logLevel <= Log.INFO)
          android.util.Log.i(tag, msg);
  }

  public static void e(String tag, String msg) {
      if (logLevel <= Log.ERROR)
          android.util.Log.e(tag, msg);
  }

  public static void d(String tag, String msg) {
      if (logLevel <= Log.DEBUG)
          android.util.Log.d(tag, msg);
  }

  public static void v(String tag, String msg) {
      if (logLevel <= Log.VERBOSE)
          android.util.Log.v(tag, msg);
  }

  public static void w(String tag, String msg) {
      if (logLevel <= Log.WARN)
          android.util.Log.w(tag, msg);
  }
}
```

### 使用Proguard移除代码中的Log代码

修改Proguard的配置文件，添加以下配置：

```
-assumenosideeffects class android.util.Log {

public static int v(...);

public static int i(...);

public static int w(...);

public static int d(...);

public static int e(...);

}
```

可以根据需要在发布时候显示的级别来决定移除哪些级别的Log(需要移除的就放到配置中)，同时Proguard的配置中还要注意不要有`-dontoptimize`这个配置。

### 比较
以上两种方法都可以达到开发阶段不显示Log，正式发布移除Log。但是使用Proguard的方式，可能不是所有程序都会进行Proguard的。这个呢，大家根据自己的项目需求，来选择合适的方法。

