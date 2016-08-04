title: 在android中画圆形图片的几种办法
date: 2014-09-19 22:48:47
comments: true
tags: ['android']
---

在开发中经常会有一些需求,比如显示头像，显示一些特殊的需求,将图片显示成圆角或者圆形或者其他的一些形状。但是往往我们手上的图片或者从服务器获取到的图片都是方形的。这时候就需要我们自己进行处理，将图片处理成所需要的形状。正如茴香豆的的“茴”写法大于一种，经过我的研究，画出特殊图片的方法也不是一种，我发现了三种，且听我一一道来。

<!--more-->

### 使用Xfermode 两图相交方式

通过查找资料发现android中可以设置画笔的Xfermode即相交模式，从而设置两张图相交之后的显示方式，具体模式见下图，源码可以去android apidemo。(SRC 为我们要画到目标图上的图即原图，DST为目标图)

![](http://isming.qiniudn.com/xfermode_use.png)


由上图可以看到，如果我们需要画一个圆形的图，可以在画布上面先画一个跟目标大小一样的圆，然后xfermode选择SRC_IN，再讲我们的头像或者其他图画上去就可以了。同样也可以先画我们的图，再画圆，不过xfermode要选择DST_IN。两种都可以实现我们需要的效果。示例代码如下：

```java
Paint p = new Paint();
p.setAntiAlias(true); //去锯齿
p.setColor(Color.BLACK);
p.setStyle(Paint.Style.STROKE);
Canvas canvas = new Canvas(bitmap);  //bitmap就是我们原来的图,比如头像
p.setXfermode(new PorterDuffXfermode(Mode.DST_IN));  //因为我们先画了图所以DST_IN
int radius = bitmap.getWidth; //假设图片是正方形的
canvas.drawCircle(radius, radius, radius, p); //r=radius, 圆心(r,r)
```

以上就是简单的示例，根据以上的16种模式你其实还可以做出更多效果。另外，只要你给一张相交图，那张图形状什么样，我们的图就可以显示成什么样。


### 通过裁剪画布区域实现指定形状的图形

Android中Canvas提供了ClipPath, ClipRect, ClipRegion 等方法来裁剪，通过Path, Rect ,Region 的不同组合，Android几乎可以支持任意形状的裁剪区域。因此，我们几乎可以获取任意形状的区域，然后在这个区域上画图，就可以获得，我们要的图片了，直接看示例。

```java
int radius = src.getWidth() / 2;　//src为我们要画上去的图，跟上一个示例中的bitmap一样。
Bitmap dest = Bitmap.createBitmap(src.getWidth(), src.getHeight(), Bitmap.Config.ARGB_8888);
Canvas c = new Canvas(dest);
Paint paint = new Paint();
paint.setColor(Color.BLACK);
paint.setAntiAlias(true);
Path path = new Path();
path.addCircle(radius, radius, radius, Path.Direction.CW);
c.clipPath(path);   //裁剪区域
c.drawBitmap(src, 0, 0, paint);　　//把图画上去
```

### 使用BitmapShader

直接先看示例
```java
int radius = src.getWidth() / 2;
BitmapShader bitmapShader = new BitmapShader(src, Shader.TileMode.REPEAT,
                Shader.TileMode.REPEAT);
Bitmap dest = Bitmap.createBitmap(src.getWidth(), src.getHeight(), Bitmap.Config.ARGB_8888);
Canvas c = new Canvas(dest);
Paint paint = new Paint();
paint.setAntiAlias(true);
paint.setShader(bitmapShader);
c.drawCircle(radius,radius, radius, paint);
```

Shader就是画笔的渲染器，本质上这中方法其实是画圆，但是渲染采用了我们的图片，然后就可以获得指定的形状了。但是我觉得，这个不适合画很复杂的图形，但是在内存消耗上，应该比第一种小很多。同时呢，设置Shader.TileMode.MIRROR，还可以实现镜面效果，也是极好的。

上面就是实现的三种方法，三种方法都可以画很多的形状，当然遇到非常非常非常非常复杂的情况，我是建议使用第一种，这时候可以让美工给一张末班形状图，省自己去代码绘制了。大家根据自己的需求选择。

在github上面[CustomShapeImageView](https://github.com/MostafaGazar/CustomShapeImageView)就是用了我们所说的第一种方法绘制。[RoundedImageView](https://github.com/vinc3m1/RoundedImageView) 和[CircleImageView](https://github.com/hdodenhof/CircleImageView)则使用bitmapshader完成,当然可能还有一些其他的控件，也许还有其他的一些实现方法，如果你知道，可以回复告诉我＾＿＾。

>原文地址：[http://blog.isming.me/2014/09/19/draw-circle-image-in-android/](http://blog.isming.me/2014/09/19/draw-circle-image-in-android/)，转载请注明出处。