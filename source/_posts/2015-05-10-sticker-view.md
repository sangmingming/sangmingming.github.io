title: 图片贴纸旋转缩放功能的实现
comments: true
date: 2015-05-10 22:55:04
tags: [android]
---

我们的项目包含图片编辑功能，特别是包含图片添加水印贴纸的功能，从最初的简单版可以添加一个图片并且移动位置，到现在添加的图片可以进行移动，以及缩放，旋转，已经是和其他的图片处理可以达到一样的很好的效果了。一直想要整理一下，分享一下实现的改进过程，一直没空，也由于我过于懒，没有动笔。今天正好有时间，分享一下。

<!--more-->

### 原始阶段：直接添加ImageView，并且设置其在父view中的位置

父视图为RelativeLayout,贴纸view就是一个ImageView,通过设置topMargin和leftMargin来设置在父视图中显示的位置，不支持缩放和旋转。功能快速实现，代码比较冗余。再有了新的需求不方便扩展。

### 新阶段：自定义View，通过matrix变换实现各种功能

主要是定义一个View，在使用的时候放到需要用到的地方，大小设置和目标图片相同大小。通过matrix对平移，旋转，缩放的操作进行映射，最终改变贴纸图片的绘制结果，因此实现目标功能。下面具体分析各个功能。

首先创建的视图在设置完贴纸图片之后，要创建一个浮点型数组，用于保存默认未进行任何变换的时候贴纸图片的关键点，以及一个原始矩形用于保存一个默认绘制区域的矩形，用代码表示就是：
```java
float imgWidth = mBitmap.getWidth();
float imgHeight = mBitmap.getHeight();
float[] originPoints = new float[]{0, 0, imgWidth,0, imgWidth, imgHeight, 0, imgHeight, imgWidth/2, imgHeight/2}; //分别为矩形的四个点，与中心点
RectF mOriginRect = new RectF(0, 0, imgWidth, imgHeight);
```

变换后的点通过Matrix.mapPoints(newPoints, originPoints)进行映射，变换后的矩形通过Matrix.mapRect(newRect, originRect)进行映射，可以通过这些新的点画一些附加元素。至于贴纸图，可以通过获取后的rect进行定位画，也可以直接使用canvas.drawBitmap(bitmap, matrix, paint)方法绘制。

至于如何进行变换操作，如何进行变换，则是在onTouch中处理各种触摸事件，或者在dispatchTouchEvent。

#### 平移

通过判断ACTION_DOWN，ACTION_UP，判断触摸是否在我们的贴纸图片上面，然后计算手指滑动的距离，可以获取到x轴和y轴的平移距离，调用mMatrix.postTranslate(x,y)，然后重新映射绘图即可。

#### 旋转

以贴纸图片的一个边缘点为旋转触摸点，以贴纸图片的中心（非贴纸view的中心），计算旋转的角度，调用mMatrix.postRotate(rotation, px, py)， px，py为贴纸图片的中心点（为上面映射后的点，而不是原始点）。

#### 缩放
 
同样通过触摸位置计算两次滑动过程中的缩放比例，来通过Matrix.postScale(scale, scale, px, py)进行缩放。

### 其他

开始的时候没有想到使用Matrix，进行了很多的尝试，没有很好的结果。最后使用了Matrix之后，则简单很多，只是在计算缩放和旋转的时候，因为数学没有学好，花了很久才把数学问题搞定。

这里分享我自己的一个完整的贴纸View，开箱即用，[https://github.com/sangmingming/StickerView](https://github.com/sangmingming/StickerView) 。如果在这方面，你又更好的实现方式，也欢迎留言，与我进行交流。


>原文地址：[http://blog.isming.me/2015/05/10/sticker-view/](http://blog.isming.me/2015/05/10/sticker-view/)，转载请注明出处。
