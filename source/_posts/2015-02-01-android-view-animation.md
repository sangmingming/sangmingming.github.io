title: android动画-View Animation
comments: true
date: 2015-02-01 11:10:50
tags: [android, animation]
---


视图动画（View Animation）,又称补间动画（Tween Animation）,即给出两个关键帧，通过一些算法将给定属性值在给定的时间内在两个关键帧间渐变。本文首先讲解各种基本动画的使用，其实介绍View动画的工作过程。

### 概述

视图动画只能作用于View对象，是对View的变换，默认支持的类型有：

+ 透明度变化(AlphaAnimation)
+ 缩放(ScaleAnimation)
+ 位移(TranslateAnimation)
+ 旋转(RotateAnimation)

可以使用AnimationSet让多个动画集合在一起运行，使用插值器(Interpolator)设置动画的速度。

<!--more-->

上面说到的几种动画，以及AnimationSet都是Animation的之类，因此Animation中有的属性，以及xml的配置属性，他们都有，因此，单独说每个动画的时候只说其特有的方法和属性。对于使用xml配置时需要放到res下面的animation文件夹下。

### AlphaAnimation 透明度动画

就是改变视图的透明度，可以实现淡入淡出等动画。这个动画比较简单只需要设置开始透明度和结束透明度即可。

```java
Animation animation = new AlphaAnimation(0.1f, 1.0f); //fromAlpha 0.1f   toAlpha 1.0f
```

或

```xml
<alpha android:fromAlpha = "0.1f" android:toAlpha="1.0f" />
```

### ScaleAnimation 缩放

缩放动画，支持设置开始x缩放（宽度缩放倍数），开始y缩放， 结束x缩放，结束y缩放，以及缩放基点x坐标，缩放基点y坐标。

x缩放和y缩放都是相对于原始的宽度和高度的，1.0表示不缩放。

坐标基点，同时有参数可以设置坐标基点类型，分别是：

+ `Animation.ABSOLUTE`(默认值) 相对于控件的0点的坐标值
+ `Animation.RELATIVE_TO_SELF` 相对于自己宽或者高的百分比（1.0表示100%）
+ `Animation.RELATIVE_TO_PARENT` 相对于父控件的宽或者高的百分比.

默认基点是视图的0点，默认坐标基点类型是ABSOLUTE。

有如下几种构造函数

```java
ScaleAnimation(Context context, AttributeSet attrs)
ScaleAnimation(float fromX, float toX, float fromY, float toY)
new ScaleAnimation(1.0f, 1.5f, 1.0f, 1.5f);
ScaleAnimation(float fromX, float toX, float fromY, float toY, float pivotX, float pivotY)
new ScaleAnimation(1.0f, 1.5f, 1.0f, 1.5f, 10, 10);
ScaleAnimation(float fromX, float toX, float fromY, float toY, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
new ScaleAnimation(1.0f, 1.5f, 1.0f, 1.5f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f); //以中心点为基点

```

XML配置：

```xml
<scale
        android:fromXScale="float"
        android:toXScale="float"
        android:fromYScale="float"
        android:toYScale="float"
        android:pivotX="float"
        android:pivotY="float" />
```

### TranslateAnimation 位移

平移支持x轴平移起点和y轴平移起点，以及设置结束点。同时每个点都可以设置type，type和上面缩放动画的基点类型一样,默认类型是ABSOLUTE.

有以下几个构造函数：

```java
TranslateAnimation(Context context, AttributeSet attrs)
TranslateAnimation(float fromXDelta, float toXDelta, float fromYDelta, float toYDelta)
TranslateAnimation(int fromXType, float fromXValue, int toXType, float toXValue, int fromYType, float fromYValue, int toYType, float toYValue)
```


XML配置：
```xml
<translate
        android:fromXDelta="float"
        android:toXDelta="float"
        android:fromYDelta="float"
        android:toYDelta="float" />
```


### RoatationAnimation 旋转

旋转支持设置旋转开始角度，和旋转结束角度，以及旋转基点，和旋转基点类型。类型同上面一样,默认旋转基点是（0，0），默认类型同上面一样，也不多说了。

```java
RotateAnimation(Context context, AttributeSet attrs)
RotateAnimation(float fromDegrees, float toDegrees)
RotateAnimation(float fromDegrees, float toDegrees, float pivotX, float pivotY)
RotateAnimation(float fromDegrees, float toDegrees, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
```

XML配置：

```xml
<rotate
        android:fromDegrees="float"
        android:toDegrees="float"
        android:pivotX="float"
        android:pivotY="float" />
```


### AnimationSet 动画集合

动画集合就是可以让多个动画一起运行，或者依次运行。

通过`addAnimation(Animation a)`向集合中添加动画，使用子动画的`setStartOffset(long offset)`设置延时，从而实现子动画之间的间隔。可以设置是否共享时间插值器。

xml配置：

```xml
<set>
<!--这里写子动画-->
<rotation ..../>
<alpha ...../>
</set>
```
属性动画(Property Animation)


### Animation 

单独把Animation拿出来说，是因为前面几个都是Animation,他们有一些属性都是从父类继承的。包括时常，插值器，是否重复，监听器等。

setFillBefore(boolean)和setFillAfter(boolean)分别是动画开始前和动画结束后是否保持动画状态，默认前者为ture，后者为false;

xml中可以配置的属性（这些在前面几个动画中省略了，也是可以使用的）：

```xml
android:detachWallpaper
android:duration
android:fillAfter
android:fillBefore
android:fillEnabled
android:interpolator
android:repeatCount
android:repeatMode   INFINTE(无限期)，RESTART（重新开始，默认值）
android:startOffset
android:zAdjustment   ZORDER_BOTTOM,ZORDER_NORMAL, ZORDER_TOP
```

#### 启动动画：

```java
view.startAnimation(animation);
//或者这样
view.setAnimation(animation);
animation.start();
```

### Interpolator 插值器

通过设置插值器可以改变动画的速度，以及最终效果。
android sdk提供了几种默认插值器，而且这些插值器在新的protery animation上仍然可以使用，这个后面再说。

+ AccelerateDecelerateInterpolator 先加速后减速
+ AccelerateInterpolator 加速
+ AnticipateInterPolator 
+ AnticipateOvershootInterpolator
+ BounceInterpolator
+ CycleInterpolator
+ LinearInterpolator
+ OvershootInterpolator
+ PathInterpolator

当然，我们也可以自定义Interpolator,一般开始值为0，结束值为1.0，然后根据算法来改变值。

### 动画原理解析
动画就是根据间隔时间，不停的去刷新界面，把时间分片，在那个时间片，通过传入插值器的值到Animation.applyTransformation（），来计算当前的值（比如旋转角度值，透明度等）.

因此，我们也可以继承Animation,从写applyTransformation()来实现我们的其他的动画。


### 其他

使用view动画时，如果需要用到类似基点类型和基点设置的，一定要注意设置对点，不然效果恨不如意。

另外，view动画，若动画前view在a点，动画过程以及动画后，view变化了位置，则点击点仍然在原位置，这是个大问题，特别需要注意。


在android apidemo中，有动画的使用，以及自定义动画，各种插值器效果，各位可以查看，我已经将其放到github上面了,地址：[https://github.com/sangmingming/Android-ApiDemos](https://github.com/sangmingming/Android-ApiDemos)



>原文地址：[http://blog.isming.me/2015/02/01/android-view-animation/](http://blog.isming.me/2015/02/01/android-view-animation/)，转载请注明出处。
