title: Path和Property Animation配合让线条动起来   
comments: true   
date: 2016-06-07 14:03:39  
tags: [android, animation]
---


之前做过一个图上标签但是动画样式不太好看，经过查找资料发现了一种全新的思路来实现动画，流畅的让标签的线显示和隐藏，示例如下，就在这里说一说。本文会涉及到Path，Property Animation, PathEffect, PathMeasure。我们开始一一道来。

![示例](http://isming.qiniudn.com/blog/tag_animation.gif)

<!--more-->

### 使用Path绘制曲线

当我们需要画曲线的时候，可能会直接使用drawLine来画，不太复杂的话还比较好实现，如果需要画曲线，或者拐弯的线的时候使用drawLine就比较复杂了。这时候，我们可以借助`Path`来drawPath。

```java
Paint paint = new Paint();
paint.setColor(Color.BLACK);
paint.setStyle(Paint.Style.STROKE); //一定要设置为画线条
Path path = new Path();
path.moveTo(100, 100);   //定位path的起点
path.lineTo(100, 200);
path.lineTo(200, 150);
path.close();
canvas.drawPath(path, paint);
```

通过以上的方法代码我们就可以画出三角形了。

### 测量Path的长度

实现动画的前提是首先得到Path的长度，然后根据长度计算出每个时间节点应该显示的长度。因为系统给我们提供了测量长度的方法，就不需要我们去进行复杂的计算了。直接使用`PathMeasure`就可以了。

```java
PathMeasure measure = new PathMeasure(path, false);
float length = measure.getLength();
```

### 只绘制Path的一部分

为了让Path能够逐步显示出来，或者逐步隐藏。我们需要做到能够显示path的一部分，并且改变显示的长度。我们知道可以通过`DashPathEffect`来显示虚线效果。同时我们可以借助DashPathEffect让我们的实线和虚线的部分的长度分别为我们的Path的长度，然后来改变偏移量，实现只显示path的一部分。

```java
PathEffect effect = new DashPathEffect(new float[]{pathLength, pathLength}, pathLength/2);
paint.setPathEffect(effect);
canvas.drawPath(path, paint)
```

### 让Path动起来

通过上面说的，我们改变PathEffect的偏移量就可以改变path显示的长度，因此我们可以给我们的View或者对象定义个属性，通过Property Animation来改变这个属性的值，即可实现动画。

PathEffect 属性值变化
   
```java
float percentage = 0.0f;
PathEffect effect = new DashPathEffect(new float[]{pathLength, pathLength}, pathLength - pathLength*percentage);
```

动画定义:

```java
Animator animatorLine = ObjectAnimator.ofFloat(view, “percentage”, 0.0f, 1.0f);
```

### 其他
就这样就实现了。思路甚至代码都是参考一篇国外的博客。思路很重要，一年前做这个动画的时候百思不得姐，花了好多时间，后面实现的效果还是比较僵硬。这次发现了其他人的思路之后，很容易就解决了。

*思路很重要，以及要了解更加全面的知识*，不然很多东西都不知道，自己的思路还是会被限制。

最后就是多google，百毒上除了广告，别的东西都挺难找到的。

没有Demo了，可以参考我参考的那个github的库吧。同时作者已经实现svg的动画显示了，原理相同，只是把svg加载为path，使用同样的动画。代码:[https://github.com/matthewrkula/AnimatedPathView](https://github.com/matthewrkula/AnimatedPathView)



>原文地址：[http://blog.isming.me/2016/06/07/path-property-animation/](http://blog.isming.me/2016/06/07/path-property-animation/)，转载请注明出处。

