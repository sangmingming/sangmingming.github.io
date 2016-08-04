title: android动画-Frame Animation
comments: true
date: 2015-01-28 20:13:47
tags: [android, animation]
---



动画可以在视觉上增加程序的流畅度，我之前对于动画这一块，是会用，但是不全面，这里写下博客，全面梳理一下Android动画方面的知识。当然，关于动画这块，也有很多前人写了很多内容，大家可以去参考。

3.0以前，android支持两种动画模式，*Tween Animation*,*Frame Animation*，在android3.0中又引入了一个新的动画系统：*Property Animation*，这三种动画模式在SDK中被称为*Property Animation*,*View Animation*,*Drawable Animation*。 可通过[NineOldAndroids](http://nineoldandroids.com/)项目在3.0之前的系统中使用Property Animation。另外呢，还有activity之间的过渡动画，android5.0增加的矢量动画，过渡效果等。

本文首先来说Frame Animation.

<!--more-->

帧动画,在android中又称Drawable Animation，就是通过一系列的Drawable依次显示来达到模拟动画的效果。
android中提供了`AnimationDrawable`类来实现帧动画，我们可以使用AnimationDrawable作为View的背景。我们通常可以使用xml来配置动画。

#### 在项目的res/drawable/目录下面创建一个xml文件。

#### 文件中以`<animation-list>`作为根节点， 每一张图片作为一个`<item>`。

如：

```xml		
<animation-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="true">
    <item android:drawable="@drawable/rocket_thrust1" android:duration="200" />
    <item android:drawable="@drawable/rocket_thrust2" android:duration="200" />
    <item android:drawable="@drawable/rocket_thrust3" android:duration="200" />
</animation-list>
```

上面代码中，`onshot`若为`true`，则动画只播放一次，否则动画会循环播放。item中的duration用于设置当前帧的停留时间。

#### 在代码中获取并，启动动画。

如上面的xml文件为rocket_thrust.xml，则在代码中使用如下：

```java		
AnimationDrawable rocketAnimation;

public void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  setContentView(R.layout.main);

  ImageView rocketImage = (ImageView) findViewById(R.id.rocket_image);
  rocketImage.setBackgroundResource(R.drawable.rocket_thrust);
  rocketAnimation = (AnimationDrawable) rocketImage.getBackground();
}

public boolean onTouchEvent(MotionEvent event) {
  if (event.getAction() == MotionEvent.ACTION_DOWN) {
    rocketAnimation.start();
    return true;
  }
  return super.onTouchEvent(event);
}
```

上面代码具体就是首先从资源中获取到我们的动画，然后设置为view的背景，之后启动动画。

*需要注意的是，动画的启动需要在view和window建立连接后才可以绘制，比如上面代码是在用户触摸后启动。如果我们需要打开界面就启动动画的话，则可以在Activity的`onWindowFocusChanged()`方法中启动。*


上面介绍的是在xml中定义动画，当然也可以在java代码中定义动画。如：

```java
AnimationDrawable rocketAnimation;

public void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  setContentView(R.layout.main);

  ImageView rocketImage = (ImageView) findViewById(R.id.rocket_image);
 
  rocketAnimation = new AnimationDrawable();
  rocketAnimation.addFrame(getResources().getDrawable(R.drawable.rocket_thrust1, 200);
  rocketAnimation.addFrame(getResources().getDrawable(R.drawable.rocket_thrust2, 200);
  rocketAnimation.addFrame(getResources().getDrawable(R.drawable.rocket_thrust3, 200);
rocketImage.setBackground(rocketAnimation);  
}

public boolean onTouchEvent(MotionEvent event) {
  if (event.getAction() == MotionEvent.ACTION_DOWN) {
    rocketAnimation.start();
    return true;
  }
  return super.onTouchEvent(event);
}
```

更多使用方法，可以去查看AnimationDrawable的api手册.


另外，看了一下相关代码，AnimationDrawable代码不长，其父类是`DrawableContainer`，用于保存Drawable list，另外有一个数组保存每一帧的停顿时间。每隔一定时间，替换Drawable,重新刷新，实现动画。



>原文地址：[http://blog.isming.me/2015/01/28/android-frame-animation/](http://blog.isming.me/2015/01/28/android-frame-animation/)，转载请注明出处。
