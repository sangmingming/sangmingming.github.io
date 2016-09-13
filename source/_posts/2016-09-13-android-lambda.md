---
title: 聊聊Android N开始支持的Lambda   
date: 2016-09-13 20:39:03
tags:
---




Android N 正式版已经发布了。对于开发者来说一个重大的更新是对于Java支持到了Java8，其中一点就是支持Lambda。我们就来聊聊什么是lambda，怎么在Android中使用。

### 什么是lambda

Lambda 可以理解为匿名函数,帮助我们写出更加简洁的代码。

<!--more-->

给view设置一个clicklistener，原本你需要写出这样的代码：

```java
v.setOnClickListener(new View.OnClickListener(View v) {
 @Override
 public void onClick(View v) {
 Toast.makeText(getActivity(), "clicked", Toast.LENGTH_LONG).show()
 }
});
```

使用lambda之后:

```java
.setOnClickListener(v -> Toast.makeText(getActivity(), "clicked", Toast.LENGTH_LONG).show());
```

是不是代码量爆减。这里再看下怎么写lambda。

在JavaScript，python等语言中函数是一等公民，但是Java中类才是。使用lambda时候，lambda其实应该是一个对象，依附于函数式接口（只包含一个抽象方法声明的接口，例如刚刚我们举例的`OnClickListener`就是,在Java 8 需要使用`@FunctionalInterface`这样保证在编译的时候一个接口只有一个抽象注解）。

写法的基本规则是这样:

```java
(arguments) -> {body}
```

arguments 是参数列表，0~n个， 参数为一个时候，可以不要括号        
body 为具体代码部分，如果代码只有一句的话可以不要大括号    
返回值会自动推导出类型    

一些写法实例：

```java
(int a, int b) -> {  return a + b; }

() -> System.out.println("Hello World");

(String s) -> System.out.println(s);

() -> 42

() -> { return 3.1415 };
(a, b) -> {return a+b;}
```

另外一点需要注意的是，在我们的lambda表达式中`this`关键指的是外部对象，而不是我们以为的lambda这个对象。在语法糖的实现过程中，lambda表达式最后会被变为类的私有方法，因此可以放心的使用this。



### 使用retrolambda

目前有个比较成熟的解决方案，使用`retrolambd`,接入的配置如下：


```groovy
apply plugin: 'com.android.application' 
apply plugin:'me.tatarka.retrolambda'

buildscript {
    repositories {
        mavenCentral()
    }

 dependencies {
     classpath 'me.tatarka:gradle-retrolambda:3.2.5'
 } 
}
  // Required because retrolambda is on maven central
repositories {
    mavenCentral() 
}
 android {   
     compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8   
        }
}
//指定将源码编译的级别，以下会将代码编译到1.7的自己码格式
retrolambda {
	javaVersion JavaVersion.VERSION_1_7
}
```

当前，retrolambda对于android gradle插件是有依赖的，需要使用1.5+的插件才可以。

retrolambda的原理是在编译的过程中，给class文件增加包裹，转成java 1.7支持的格式。


### 使用jack
在Android N，支持使用Java 8， google给我们提供了新的编译工具`jack`,因此可以直接支持lambda，为了支持低版本的Android也可以用lambda，我们需要将`targetSdkVersion`和`compileSdkVersion`设置为23或者更小。启用jack，修改`build.gradle`如下。

```groovy
android {
  ...
  defaultConfig {
    ...
    jackOptions {
      enabled true
    }
  }
  compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }
}
```

jack工具链会的编译步骤如下：
```
Jack (.java --> .jack --> .dex)
```
和之前相比，将中间转换为class文件的步骤省略了，不需要多个工具链。
在低版本兼容lambda，也同样是使用的语法糖来实现。



### 后记

如上两种工具都可以让我们在进行Android开发的时候来使用lambda，retrolambda出来的时间更早，经过很多次的迭代，目前也有一些app在使用，相比较来说更加成熟。jack则是google开发，减少了对javac的依赖，更多谷歌的自主性，相信后面谷歌大力推广的，但是出于刚刚开发出来因此还不够成熟，对于lint，proguard，instant run还有很多地方支持不好的地方，我们相信以后jack会是趋势。

出于尝鲜，还是可以来使用的，但是在大的项目里面还是不建议使用的，毕竟万一出了问题还是很难排查的。

另外，如果想要在android开发更爽快的使用lambda，也可以去试试`kotlin`这个语言。

参考资料:      
1. [http://viralpatel.net/blogs/Lambda-expressions-java-tutorial/](http://viralpatel.net/blogs/Lambda-expressions-java-tutorial/)       
2. [https://developer.android.com/guide/platform/j8-jack.html](https://developer.android.com/guide/platform/j8-jack.html)     
3. [https://github.com/evant/gradle-retrolambda](https://github.com/evant/gradle-retrolambda)


>原文地址：[http://blog.isming.me/2016/09/13/android-lambda/](http://blog.isming.me/2016/09/13/android-lambda/)，转载请注明出处。