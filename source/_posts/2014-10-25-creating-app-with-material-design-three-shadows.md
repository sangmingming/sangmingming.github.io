title: 创建Material Design风格的Android应用--定义阴影和裁剪视图
comments: true
date: 2014-10-26 22:24:07
tags: ["android", "material design"]
---

之前已经写过通过应用主题和使用ListView, CardView,应用Material Design样式，同时都都可以通过support library向下兼容。今天要写的阴影和视图裁剪，无法向下兼容，请注意。

​Material Design 为用户界面元素引入了深度这个元素。深度帮助用户理解各个元素之间的重要关联和帮助用户关注他们手上的任务。

视图的高度（elevation），通过Z属性表现，通过他的阴影确定：ｚ值更高的视图投影出更大的阴影。视图只在Z=0的平面上投影处阴影；他们不会投影阴影在其他放在下面的视图上面和高于z=0的平面。

<!--more-->

有更高Z值的视图挡住Ｚ值较低的视图。无论如何，Ｚ值不会影响到View的大小。

高度也是有用的，当在执行一些动作的时候创建动画让组件升起。

### 为视图分配高度

一个View的Z值有两个组成部分，*elevation(高度)*和*translation(平移)*.elevation是一个静态部分，translation 用于动画：

>Z = elevation + translationZ

![](http://isming.qiniudn.com/shadows-depth.png)

不同高度的视图的阴影

在布局文件中设置evelation 使用`android:elevation`，在代码中使用`View.setElevation()`方法。
设置一个视图的平移，使用View.setTranslationZ()方法。

新的方法`ViewPropertyAnimator.z()`和`ViewPropertyAnimator.translationZ()`可以让你更容易的变动视图的高度。更多的信息，看ViewPropertyAnimator的Api文档[http://developer.android.com/reference/android/view/ViewPropertyAnimator.html](http://developer.android.com/reference/android/view/ViewPropertyAnimator.html)。和属性动画的开发指南：[http://developer.android.com/guide/topics/graphics/prop-animation.html](http://developer.android.com/guide/topics/graphics/prop-animation.html)。

你也可以使用StateListAnimator方式定义这些文件在xml文件中。特别适用于，状态改变时执行的动画，比如用户点击按钮。更多信息，请看动画视图状态改变,下次在动画一节讲。
Z值在测量上使用和X,Y值一样的单位。


## 自定义视图阴影和轮廓
视图的背景边界决定了阴影的默认形状。轮廓（Outlines）代表了图形对象的外形状，并确定了对触摸反馈区的波纹。

看这个视图，定义一个背景Drawable：

```xml
<TextView
    android:id="@+id/myview"
    ...
    android:elevation="2dp"
    android:background="@drawable/myrect" />
```

背景是一个圆角矩形

```xml
<!-- res/drawable/myrect.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android"
       android:shape="rectangle">
    <solid android:color="#42000000" />
    <corners android:radius="5dp" />
</shape>
```

当这个背景drawable作为视图的轮廓，视图投射出圆角阴影。提供一个自定义的轮廓，可以覆盖默认视图阴影的形状。

在自己的代码中自定义一个轮廓：

1.继承ViewOutlineProvider类
2.重写getOutline()方法
3.在视图中设置轮廓，使用View.setOutlineProvider()方法

你可以创建椭圆和圆角矩形轮廓使用OutLine类中的方法。视图默认的outline provider会根据视图的背景来生成轮廓。可以设置视图的outline provider为null，来阻止投射阴影。



###　裁剪视图

裁剪视图功能，可以让你更容易的改变视图的形状。你可以裁剪视图为了和其他的设计元素保持一致，或者改变成形状响应用户的输入。你可以裁剪一个视图的轮廓使用`View.setClipToOutLine()`方法，或者`android:clipToOutline`属性。只有矩形，圆角矩形，圆圈的轮廓支持被裁剪，可以使用`Outline.canClip()`方法检测是否支持被裁剪。

裁剪视图到一个drawable的形状，设置drawable作为视图的背景（让视图显示在其上），并且调用`View.setClipToOutline()`方法。

裁剪视图是一个耗费的操作，裁剪视图时不要使用形状动画。达到这种效果，请使用Reveal Effect 动画(下节讲)。


###　总结

上面可以看到，设置阴影很简单：

1. 设置eleavation值。
2. 添加背景或者设置一个outline.


参考资料：[http://developer.android.com/training/material/shadows-clipping.html](http://developer.android.com/training/material/shadows-clipping.html)


>原文地址：[http://blog.isming.me/2014/10/26/creating-app-with-material-design-three-shadows/](http://blog.isming.me/2014/10/26/creating-app-with-material-design-three-shadows/)，转载请注明出处。

