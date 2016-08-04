title: 打破Android应用65K方法数魔咒
comments: true
date: 2015-05-01 00:33:08
tags: [android]
---

近日，我们的应用，在编译的时候不幸的遇到这个错误

>Conversion to Dalvik format failed: Unable to execute dex: method ID not in [0, 0xffff]: 65536

这才让我意识到原来我们的程序中，方法数已经超过了65536。在之前，已经知道了android系统的java虚拟机dalvik在执行java程序时，使用原生类型short来索引dex文件中的方法，因此方法数就呗限制在65536了。之前我一直以为，这个数量已经很大了，不会达到上限，结果今天就达到了。

不过这个东西呢，我们也是很容易的进行解决的，因为，就在去年不久前，google官方提供了多dex的支持库，因此，我们可以很简单的解决这个问题。

<!--more-->

### 开发工具升级
将android sdks build tools 和android support library要升级到最新的，这个使用android sdks manager很容易就完成了。

### 配置build.gradle
```groovy
android { 
compileSdkVersion 21 
buildToolsVersion "21.1.0" 
defaultConfig {     
...     
minSdkVersion 14     
targetSdkVersion 21     
...     
// Enabling multidex support.     
multiDexEnabled true 
} 
... 
} 
dependencies{ 
compile 'com.android.support:multidex:1.0.0’ //dependencies
}
```

### 让应用支持多dex
androidManifest.xml中application中声明android.support.multidex.MultiDexApplication;

或自己定义一个Application类，继承自MultiDexApplication；

或者自己定义的Application类，在attachBaseContext()方法中，添加MultiDex.install(this);


### 其他
通过上面的方法即可轻松完成多dex，不过在低版本的android系统（低于android4.0）可能会有bug出现，还要多进行测试。

究其原因，其实我们的app，自己写的代码现在其实不是很多，代码中使用了大量的第三方sdk，以及其他的一些功能集成。

下面，就要想办法，减少第三方的功能库了。这里跟大家分享一下解决方案。

参考资料： [http://developer.android.com/tools/building/multidex.html](http://developer.android.com/tools/building/multidex.html)


>原文地址：[http://blog.isming.me/2015/05/01/android-multi-dex/](http://blog.isming.me/2015/05/01/android-multi-dex/)，转载请注明出处。
