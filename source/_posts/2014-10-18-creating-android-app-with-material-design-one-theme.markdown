title: 创建Material Design风格的Android应用--应用主题
comments: true
date: 2014-10-18 22:43:18
tags: ["android", "material design"]
---

昨天正式发布了android 5,同时android developer网站也更新了，增加了创建Material Design风格的Android应用指南,也更新了Support Library，在support library增加了一些Material Design风格的控件和动画等，这里给大家简单介绍一下怎样开发material design风格的Android应用。

<!--more-->

### android 5使用Material Design风格

android提供了三种Material Design风格Theme。

分别是：

	@android:style/Theme.Material (dark version)		
	@android:style/Theme.Material.Light (light version)		
	@android:style/Theme.Material.Light.DarkActionBar   


 ![Light material theme](http://ourhfuu.qiniudn.com/theme_MaterialLight.png)

 Light material theme

 ![Dark material theme](http://ourhfuu.qiniudn.com/theme_MaterialDark.png)

 Dark material theme

 我们可以以这三个Theme来定义我们的Theme，比如：
 ```xml
 <resources>
  <!-- inherit from the material theme -->
  <style name="AppTheme" parent="android:Theme.Material">
    <!-- Main theme colors -->
    <!--   your app branding color for the app bar -->
    <item name="android:colorPrimary">@color/primary</item>
    <!--   darker variant for the status bar and contextual app bars -->
    <item name="android:colorPrimaryDark">@color/primary_dark</item>
    <!--   theme UI controls like checkboxes and text fields -->
    <item name="android:colorAccent">@color/accent</item>
  </style>
</resources>
 ```
我们可以修改每个位置的字或者背景的颜色，每个位置的名字如下图所示：

![Customizing the material theme](http://ourhfuu.qiniudn.com/material_theme_colors.png)

我就简单的介绍一下，更具体的自己探索吧。

### 较低版本使用Material Design风格

要在较低版本上面使用Material Design风格，则需要使用最新的support library（version 21），可以直接把项目引入工程，或者使用gradle构建，增加compile　dependency:

```java
dependencies {
    compile 'com.android.support:appcompat-v7:+'
    compile 'com.android.support:cardview-v7:+'
    compile 'com.android.support:recyclerview-v7:+'
}
```

将上面的AppTheme　style放到res/values-v21/style.xml，再res/values/style.xml增加一个AppTheme，如下：

```xml
<!-- extend one of the Theme.AppCompat themes -->
<style name="Theme.MyTheme" parent="Theme.AppCompat.Light">
    <!-- customize the color palette -->
    <item name="colorPrimary">@color/material_blue_500</item>
    <item name="colorPrimaryDark">@color/material_blue_700</item>
    <item name="colorAccent">@color/material_green_A200</item>
</style>
```

这样可以同样实现很多的地方是Material Design,但是由于低版本不支持沉浸式状态栏，有一些效果还是无法实现。



##### PS:就写这么多吧。下次写使用CardView 和RecyclerView。做Material Design的List 和Card布局。　（我英文不好，可能有些地方也理解的不好。）

参考：*[http://developer.android.com/training/material/theme.html](http://developer.android.com/training/material/theme.html)*


>原文地址：[http://blog.isming.me/2014/10/18/creating-android-app-with-material-design-one-theme/](http://blog.isming.me/2014/10/18/creating-android-app-with-material-design-one-theme/)，转载请注明出处。

