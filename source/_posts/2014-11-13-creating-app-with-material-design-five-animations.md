title: 创建Material Design风格的Android应用--使用自定义动画
comments: true
date: 2014-11-13 22:59:44
tags: ['android', 'material design']
---

动画在Material Design设计中给用户反馈放用户点击时，并且在程序用户界面中提供连贯的视觉。Material主题为按钮（Button）和activity的转换提供了一些默认的动画，在android5.0（api 21）和更高的版本，你可以自定义这些动画和创建一个新动画：

+ Touch feedback（触摸反馈）
+ Circular Reveal（循环揭露效果）
+ Activity transitions（Activity转换效果）
+ Curved motion（曲线运动）
+ View state changes （视图状态改变）
<!--more-->

### 自定义触摸反馈

触摸反馈在Material Design中在触摸点提供了一个即时视觉确认当用户作用在UI元素。按钮的默认触摸反馈动画是使用了新的RippleDrawable类，它会是波纹效果在不同状态间变换。

大多数情况下，我们可以使用这个功能通过在xml文件中定义背景：

>?android:attr/selectableItemBackground  有界限的波纹     
>?android:attr/selectableItemBackgroundBorderless 可以超出视图区域的波纹       
>?android:attr/selectableItemBackgroundBorderless 是21新添加的api

另外，还以使用`ripple`元素定义`RippleDrawable`作为一个xml资源。

你可以给RippleDrawable对象分配一个颜色。使用主题的`android:colorControlHighlight`属性可以改变默认的触摸反馈颜色。

更多信息，查看RippleDrawable类的api指南。

### 使用揭露效果

揭露动画为用户提供视觉上的持续性挡显示或者隐藏一组界面元素。`ViewAnimationUtils.createCircularReveal()`方法使你可以使用动画效果来揭露或者隐藏一个视图。

这样揭露一个先前隐藏的视图：
```java
// previously invisible view
View myView = findViewById(R.id.my_view);

// get the center for the clipping circle
int cx = (myView.getLeft() + myView.getRight()) / 2;
int cy = (myView.getTop() + myView.getBottom()) / 2;

// get the final radius for the clipping circle
int finalRadius = Math.max(myView.getWidth(), myView.getHeight());

// create the animator for this view (the start radius is zero)
Animator anim =
    ViewAnimationUtils.createCircularReveal(myView, cx, cy, 0, finalRadius);

// make the view visible and start the animation
myView.setVisibility(View.VISIBLE);
anim.start();
```

这样隐藏一个先前显示的视图：
```java
// previously visible view
final View myView = findViewById(R.id.my_view);

// get the center for the clipping circle
int cx = (myView.getLeft() + myView.getRight()) / 2;
int cy = (myView.getTop() + myView.getBottom()) / 2;

// get the initial radius for the clipping circle
int initialRadius = myView.getWidth();

// create the animation (the final radius is zero)
Animator anim =
    ViewAnimationUtils.createCircularReveal(myView, cx, cy, initialRadius, 0);

// make the view invisible when the animation is done
anim.addListener(new AnimatorListenerAdapter() {
    @Override
    public void onAnimationEnd(Animator animation) {
        super.onAnimationEnd(animation);
        myView.setVisibility(View.INVISIBLE);
    }
});

// start the animation
anim.start();
```

### 自定义activity转换效果

activity间转换在Material Design程序中提供不同状态间的视觉连接通过在公用元素上动作或者转换。你可以为进入或退出的转换自定义动画，共享元素在不同的activity之间的转换效果。
进入过渡决定activity中的视图怎样进入场景。比如在爆裂进入过渡效果中，视图从屏幕外面飞向屏幕中间进入场景。

退出过渡决定activity中的视图怎样退出场景。比如，在爆裂退出过渡效果中，视图从中间向远处退出场景。
共享元素过渡决定两个activity之间共享的视图怎么在两个activity之间过渡。比如，两个activity有一个相同的图片，在不同的位置和不同的大小，changeImageTransform(图片变换变化)让共享元素平滑的平移和缩放图片在两个activity之间。

android 5.0(api 21)提供以下进入和退出效果：

+ explode(爆裂) - 从场景中间移动视图进入或者退出
+ slide(滑动) - 视图从场景的一个边缘进入或者退出
+ fade(淡入淡出) - 从场景添加或者移除一个视图通过改变他的透明

所有过渡效果都继承`Visibility`类，因此支持作为一个进入或者退出过渡效果。

更多细节，看`Transition`类的api指南。



Android5.0(api 21)也支持共享元素过渡效果：

+ changeBounds -  改变目标视图的布局边界
+ changeClipBounds - 裁剪目标视图边界
+ changeTransform - 改变目标视图的缩放比例和旋转角度
+ changeImageTransform - 改变目标图片的大小和缩放比例

当你在程序中开启activity间的过渡动画时，默认的交叉淡入淡出效果会在两个activity之间激活。

![共享元素动画](http://isming.qiniudn.com/SceneTransition.png)

一个共享元素过渡效果


##### 指定过渡效果

首先，使用在从material theme继承的样式中，使用`android:windowContentTransitions`属性开启窗口内内容过渡效果。也可以在样式定义中第一进入，退出，共享元素的效果：

```xml
<style name="BaseAppTheme" parent="android:Theme.Material">
  <!-- enable window content transitions -->
  <item name="android:windowContentTransitions">true</item>

  <!-- specify enter and exit transitions -->
  <item name="android:windowEnterTransition">@transition/explode</item>
  <item name="android:windowExitTransition">@transition/explode</item>

  <!-- specify shared element transitions -->
  <item name="android:windowSharedElementEnterTransition">
    @transition/change_image_transform</item>
  <item name="android:windowSharedElementExitTransition">
    @transition/change_image_transform</item>
</style>
```

示例中的过渡`change_image_transform`定义如下：
```xml
<!-- res/transition/change_image_transform.xml -->
<!-- (see also Shared Transitions below) -->
<transitionSet xmlns:android="http://schemas.android.com/apk/res/android">
  <changeImageTransform/>
</transitionSet>
```

`changeImageTransform`元素对应`ChangeImageTransform`类。更多信息，查看`Transition`的api指南。

在代码中启用窗口内容过渡效果，使用`Window.requestFeature()`方法：
```java
// inside your activity (if you did not enable transitions in your theme)
getWindow().requestFeature(Window.FEATURE_CONTENT_TRANSITIONS);

// set an exit transition
getWindow().setExitTransition(new Explode());
```
在代码中定义过渡效果，使用下面的方法，并传一个`Transition`对象：

+ Window.setEnterTransition()
+ Window.setExitTransition()
+ Window.setSharedElementEnterTransition()
+ Window.setSharedElementExitTransition()

`setExitTransition()`和`setSharedElementExitTransition()`方法为调用的activity定义退出过渡效果，`setEnterTransition()`和`setSharedElementEnterTransition()`方法为调用的activity定义进入过渡效果。

为了达到完整的过渡效果，必须在进入的和退出的两个activity上都启用window内容过渡。否则，正调用的activity会开始退出过渡，你就会看到窗口过渡效果（比如缩放，或者淡出）。

更快的开始一个进入过渡，使用`Window.setAllowEnterTransitionOverlap()`方法在被调用的activity。这让你有更加激动人心的进入过渡效果。


#### 打开activity使用过渡
如果你为一个activity开启过渡并且设置了一个退出过渡效果，过渡效果会在你打开其他activity的时候激活，像这样：

```java
startActivity(intent,
        ActivityOptions.makeSceneTransitionAnimation(this).toBundle());
```
如果你给第二个activity设置了进入过渡动画，过渡也会在第二个activity启动的时候激活。当你启动其他的activity时，如果需要禁用过渡效果，提供一个为`null`的bundle选项。


#### 打开一个activity包含一个共享元素
使用一个场景过渡动画在两个activity之间包括一个共享元素：

1. 在theme中开启窗口内容过渡效果 
2. 在style中指定一个共享元素过渡效果 
3. 在xml中定义过渡样式 
4. 在两个activity的样式文件中给共享元素分配一个相同的名字使用`android:transitionName`属性 
5. 使用`ActivityOptions.makeSceneTransitionAnimation()`方法。 

```java
// get the element that receives the click event
final View imgContainerView = findViewById(R.id.img_container);

// get the common element for the transition in this activity
final View androidRobotView = findViewById(R.id.image_small);

// define a click listener
imgContainerView.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        Intent intent = new Intent(this, Activity2.class);
        // create the transition animation - the images in the layouts
        // of both activities are defined with android:transitionName="robot"
        ActivityOptions options = ActivityOptions
            .makeSceneTransitionAnimation(this, androidRobotView, "robot");
        // start the new activity
        startActivity(intent, options.toBundle());
    }
});
```

对于在代码中生成的动态共享视图，使用`View.setTransitionName()方法在两个activity中给指定相同的名字。

当完成第二个activity的时候，如果需要逆转该过渡动画，使用Activity.finishAfterTransition()方法代替Activity.finish()


#### 打开一个activity包含多个共享元素

使用一个场景过渡动画在两个activity之间包括多于一个共享元素，在两个activity中定义所有的的共享元素使用`android:transitionName`属性（或使用View.setTransitionName()方法在所有的activity中）,并且创建一个像下面这样的ActivityOptions对象：
```java
ActivityOptions options = ActivityOptions.makeSceneTransitionAnimation(this,
        Pair.create(view1, "agreedName1"),
        Pair.create(view2, "agreedName2"));
```


### 使用曲线运动
Material Design中，动画依赖时间插值和空间移动模式曲线。在android5.0(api 21)和更高版本，你可以为动画自定义时间曲线和移动曲线。

`PathInterpolator`类是一个新的基于贝塞尔曲线或Path对象的插值器。这个插值器在1*1的正方形上定义了曲线运动，以（0，0）和（1，1）点作为锚点，根据够照参数控制点。你也可以使用xml文件的定义一个路径插值器，如：

```xml
<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android"
    android:controlX1="0.4"
    android:controlY1="0"
    android:controlX2="1"
    android:controlY2="1"/>
```
Material Design设计规范中，系统提供了三个基本曲线的xml资源:

+ @interpolator/fast_out_linear_in.xml
+ @interpolator/fast_out_slow_in.xml
+ @interpolator/linear_out_slow_in.xml

我们可以给`Animator.setInterpolator()`传一个`PathInterpolator`对象来设置。

`ObjectAnimator`类有新的构造方法，你可以一次使用两个或者属性使用path独立于坐标动画。比如，下面的动画使用一个Path对象去动作一个视图的x和y属性：
```java
ObjectAnimator mAnimator;
mAnimator = ObjectAnimator.ofFloat(view, View.X, View.Y, path);
...
mAnimator.start();
```


### 视图状态改变动画

`StateListAnimator`定义动画当视图的状态改变的时候运行，下面的例子是怎么在xml中定义一个StateListAnimator动画：

```xml
<!-- animate the translationZ property of a view when pressed -->
<selector xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:state_pressed="true">
    <set>
      <objectAnimator android:propertyName="translationZ"
        android:duration="@android:integer/config_shortAnimTime"
        android:valueTo="2dp"
        android:valueType="floatType"/>
        <!-- you could have other objectAnimator elements
             here for "x" and "y", or other properties -->
    </set>
  </item>
  <item android:state_enabled="true"
    android:state_pressed="false"
    android:state_focused="true">
    <set>
      <objectAnimator android:propertyName="translationZ"
        android:duration="100"
        android:valueTo="0"
        android:valueType="floatType"/>
    </set>
  </item>
</selector>
```
给视图附加自定义的视图状态动画，使用`selector`元素在xml文件中定义一个动画祥例子中这样，给视图分配动画使用`android:stateListAnimator`属性。在代码中使用，使用`AnimationInflater.loadStateListAnimator()`方法，并且使用`View.setStateListAnimator()`方法。

当你的主题是继承的Material主题，按钮默认有一个Z动画。如果需要避免这个动画，设置`android:stateListAnimator`属性为`@null`即可。

`AnimatedStateListDrawable`类让你创建可绘制图在相关联的视图状态改变。android5.0的一些系统组件默认使用这些动画。下面的例子是如何在xml文件中定义一个`AnimatedStateListDrawable`:
```xml
<!-- res/drawable/myanimstatedrawable.xml -->
<animated-selector
    xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- provide a different drawable for each state-->
    <item android:id="@+id/pressed" android:drawable="@drawable/drawableP"
        android:state_pressed="true"/>
    <item android:id="@+id/focused" android:drawable="@drawable/drawableF"
        android:state_focused="true"/>
    <item android:id="@id/default"
        android:drawable="@drawable/drawableD"/>

    <!-- specify a transition -->
    <transition android:fromId="@+id/default" android:toId="@+id/pressed">
        <animation-list>
            <item android:duration="15" android:drawable="@drawable/dt1"/>
            <item android:duration="15" android:drawable="@drawable/dt2"/>
            ...
        </animation-list>
    </transition>
    ...
</animated-selector>

```


### 可绘矢量动画
可绘制矢量图在拉伸时不会失真。`AnimatedVectorDrawable`类让你可以在可绘制矢量图上面作用动画。

通常需要在三个xml文件中定义可动的矢量图：

一个矢量图使用`<vector>`元素,放在`res/drawable/`下。
一个可动的矢量图使用`<animated-vector>`元素，放在`res/drawable/`下。
一个或更多个动画对象使用`<objectAnimator>`元素，放在`res/anim/`下。

可动矢量图可以使用`<group>`和`<path>`元素。`<group>`元素定义一系列路径或者子组，`<path>`元素定义可绘图的路径。

当你定义了一个想要作用动画的矢量可绘制图，使用`android:name`属性给每个group和path指定一个唯一的名字，这样你可以从动画的定义中找到他们。比如：
```xml
<!-- res/drawable/vectordrawable.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:height="64dp"
    android:width="64dp"
    android:viewportHeight="600"
    android:viewportWidth="600">
    <group
        android:name="rotationGroup"
        android:pivotX="300.0"
        android:pivotY="300.0"
        android:rotation="45.0" >
        <path
            android:name="v"
            android:fillColor="#000000"
            android:pathData="M300,70 l 0,-70 70,70 0,0 -70,70z" />
    </group>
</vector>
```
可动的矢量绘制通过刚刚说到定义的名字，来找到这些path和group：
```xml
<!-- res/drawable/animvectordrawable.xml -->
<animated-vector xmlns:android="http://schemas.android.com/apk/res/android"
  android:drawable="@drawable/vectordrawable" >
    <target
        android:name="rotationGroup"
        android:animation="@anim/rotation" />
    <target
        android:name="v"
        android:animation="@anim/path_morph" />
</animated-vector>
```
动画的定义表现在ObjectAnimator和AnimatorSet对象中。第一个动画在这个例子中是让目标组旋转360度：
```xml
<!-- res/anim/rotation.xml -->
<objectAnimator
    android:duration="6000"
    android:propertyName="rotation"
    android:valueFrom="0"
    android:valueTo="360" />
```

第二个动画例子是把矢量可绘图从一个形状变成另一种。所有的路径必须兼容变换：他们必须有相同数量的命令，每个命令要有相同的参数。
```xml
<!-- res/anim/path_morph.xml -->
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <objectAnimator
        android:duration="3000"
        android:propertyName="pathData"
        android:valueFrom="M300,70 l 0,-70 70,70 0,0   -70,70z"
        android:valueTo="M300,70 l 0,-70 70,0  0,140 -70,0 z"
        android:valueType="pathType" />
</set>
```

更多的信息，看`AnimatedVectorDrawable`的api指南。


#### PS后记

这个系列终于写完了，说实话基本上大部分都是翻译的谷歌的官方文档。因为时间问题，再加上自己的英语够烂，最近越来慢。不过，这样一下来，加上自己的一些代码练习，对于Material设计算是能够基本使用了。可惜，大部分的style还都不能向下兼容，只好等５了。

网上有一些大神进来已经开源了一些开源组件，大家可以借此曲线救国，下次有空在专门整理一下。


本文参考： [http://developer.android.com/training/material/animations.html](http://developer.android.com/training/material/animations.html)

>原文地址：[http://blog.isming.me/2014/11/13/creating-app-with-material-design-five-animations/](http://blog.isming.me/2014/11/13/creating-app-with-material-design-five-animations/)，转载请注明出处。