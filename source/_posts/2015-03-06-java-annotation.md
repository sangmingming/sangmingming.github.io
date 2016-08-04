title: java注解
comments: true
date: 2015-03-06 00:19:19
tags: [android, java]
---


从java 5.0开始，为我们提供注解功能，通过注解可以限制代码的重载，过时，以及实现一些其他功能，这里，就来分析一下java的注解。

###  java 元注解
首先来看java元注解，分别是：


<!--more-->

>@Target

>@Retention

>@Documented

>@Inherited



这些注解和他们所修饰的类在java.lang.annotation包中，代码都很简单，可以去查看一下。



@Target 描述注解的使用范围，取值：

>ElementType.CONSTRUCTOR:描述构造器		
>ElementType.FIELD:描述成员变量		
>ElementType.VARIABLE: 描述局部变量		
>ElementType.METHOD: 描述方法		
>ElementType.PACKAGE: 描述包		
>ElementType.PARAMETER：描述方法的参数		
>ElementType.Type: 描述类，接口（包括注解类型）或enum声明.

@Retention 注解的声明周期，即在什么级别保留，取值：
>RetentionPoicy.SOURCE :在源文件中有效（在.java文件中有效）       
>RetentionPoicy.CLASS: 在class文件中有效
>RetentionPoicy.RUNTIME:在运行时有效

@Documented 用于描述其他类型的annotation应该被作为被标注的程序成员的公共API，可以被javdoc的工具文档化，无成员。

@Inherited 用于标注某个标注是被继承的，即父类中使用了一个Annotation，则子类继承父类的这个annotation，annotation需要标记为RUNTIME的才可以。

### java内置注解
以上是元标记，再看java内置的标准注解，@Override，@Deprecated， @SuppressWarnings

@Override

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}

```

从前面的元注解介绍可以看到，Override用于标注方法，有效期是在源码期间。用于标注方法重写。

@Deprecated

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface Deprecated {
}

```
标注 过时，或者不建议使用，也是会保留到运行时，添加了Documented元标签，这样在生成文档时候，就可以生成过时的标记。

@SuppressWarnings

```java
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    String[] value();
}

```

忽略错误报告，有效时是源码级。

### 自定义注解

我们再来看看如何自定义注解。自定义的注解就和java内置的注解类似，也需要用到元注解，通过远注解设置那些地方可以使用，设置作用域。比如：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyAnnotation {
     int value() default;
}


@Retention(RetentionPolicy.SOURCE)
@Target(ElementType.METHOD)
public @interface MyNewAnnotation{
     String author();
     int version() default 1;
}

public class MyClass {
     @MyAnnotation(12)
     public boolean isOK() {
         return true;
     }

     @MyNewAnnotation(author=“sam”, version=2)
     public int getAge() {
         return 19;
     }
}
```

上面前面的代码是定义注解，后面是使用。可以看到使用@interface来定义注解。

注解配置参数名为注解类的方法名，并且方法没有方法体，没有参数没有修饰符，不可以抛异常。返回值只能是基本类型,String,Class,annotation,enumeration，或者他们的一维数组。只有一个默认属性，可以直接用value()函数，没有属性，则这个注解是标记注解。可以加default表示默认值。


### Android内置注解

作为android程序员，我们还是了解一下android中自带的注解，以及用法含义。

`@SuppressLint`： 指示lint检查时忽略注解元素的警告信息。          
`@TargetApi`:指示lint把当前这个注解元素的target api为指定值，而不是项目设置的target api。          
`@NonNull`:表示一个成员变量，或者参数，或者方法返回值永远不能为NULL。          
`@Nullable`:标识一个成员变量，或者参数，方法返回值，可以为NULL。               

android.support.annotation包中还有更多的注解可以使用。


另外，[http://codekk.com/open-source-project-analysis/detail/Android/Trinea/%E5%85%AC%E5%85%B1%E6%8A%80%E6%9C%AF%E7%82%B9%E4%B9%8BJava%20%E6%B3%A8%E8%A7%A3%20Annotation](http://codekk.com/open-source-project-analysis/detail/Android/Trinea/%E5%85%AC%E5%85%B1%E6%8A%80%E6%9C%AF%E7%82%B9%E4%B9%8BJava%20%E6%B3%A8%E8%A7%A3%20Annotation)对于注解的分析很好，推荐一下。



>原文地址：[http://blog.isming.me/2015/03/06/java-annotation/](http://blog.isming.me/2015/03/06/java-annotation/)，转载请注明出处。