title: 创建Material Design风格的Android应用--使用Drawable
comments: true
date: 2014-11-03 22:31:26
tags: ['android', 'material design']
---


以下Drawables的功能帮助你在应用中实现Material Design:

### 图片资源着色

在android 5.0(api 21)和更高版本，可以着色bitmap和.9 png 通过定义透明度遮盖。你可以着色通过使用颜色资源或者主题的属性去解析颜色资源（比如，`?android:attr/colorPrimary`）.通常我们创建一次，然后资源自适应主题。

<!--more-->

你可以给BitmapDrawable或NinePatchDrawable对象着色使用`setTint()`方法。你可以可以在布局文件中使用`android:tint`和`android:tintMode`属性设置着色颜色和着色模式。

### 从图片中抽取高亮颜色

support library r21和更高的版本中包括了`Palette`类，可以从一个图片中提取高亮颜色。这个类可以提起以下几种突出颜色：

Vibrant   充满生机

Vibrant dark  暗的充满生机

Vibrant light 亮的充满生机

Muted  柔和

Muted dark  暗的柔和

Muted light 亮的柔和

传递一个Bitmap对象给静态方法Palette.generate()，它会在后台线程帮你从后台线程提取颜色。如果你不能使用这个后台线程，使用Palette.generateAsync()方法，并且设置一个监听器listener.

你可以从图片中取得突出颜色使用Palette类中的getter方法，比如Palette.getVibrantColor.

在项目中使用Palette方法，需要在项目中包含v7包palette的jar, gradle dependecy添加的方式是：

```java
...
compile 'com.android.support:palette-v7:21.0.+'

```

下面这个是示例代码：
```java
Palette.generateAsync(bitmap, new Palette.PaletteAsyncListener() {
     public void onGenerated(Palette palette) {
         // Do something with colors...
         palette.getVibrantColor(Color.BLACK); //get a color in rgb value
     }
 });
```
![](http://isming.qiniudn.com/palette_mode.jpg)

更多信息，请查看Paltette的api文档:[http://developer.android.com/reference/android/support/v7/graphics/Palette.html](http://developer.android.com/reference/android/support/v7/graphics/Palette.html)

### 创建矢量drawables

在android 5.0和更高版本中，可以创建矢量的drawable，在缩放的时候不会失真。你只需要定义一个矢量图片文件，相反的，使用bitmap位图则需要针对不同的分辨率创建多个文件。创建一个矢量图片，你需要说明图形的详细，在xml文件的<vector>标签下。

下面是一个例子：

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- res/drawable/heart.xml -->
<vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="256dp"
    android:height="256dp"
    android:viewportHeight="32"
    android:viewportWidth="32">

    <!-- draw a path -->
    <path
        android:fillColor="#f15467"
        android:pathData="M20.5,9.5
                        c-1.955,0,-3.83,1.268,-4.5,3
                        c-0.67,-1.732,-2.547,-3,-4.5,-3
                        C8.957,9.5,7,11.432,7,14
                        c0,3.53,3.793,6.257,9,11.5
                        c5.207,-5.242,9,-7.97,9,-11.5
                        C25,11.432,23.043,9.5,20.5,9.5z"/>
</vector>
```

上面的图显示效果如下：

![](http://isming.qiniudn.com/vector_demo.png)

矢量图片在android表现为`VectorDrawable`对象。更多信息，查看Svg Path reference。

参考资料:[http://developer.android.com/training/material/drawables.html](http://developer.android.com/training/material/drawables.html)

>原文地址：[http://blog.isming.me/2014/11/03/creating-app-with-material-design-four-drawables/](http://blog.isming.me/2014/11/03/creating-app-with-material-design-four-drawables/)，转载请注明出处。