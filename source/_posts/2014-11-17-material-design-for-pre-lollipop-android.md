title: 在低版本android系统上实现Material设计应用
comments: true
date: 2014-11-17 22:07:33
tags: ['android', 'material design']
---



​Material Design真的很好看，动画效果真的很实用。前面也写了一些文章介绍如何编写Material风格的程序，但是很多都是一些新的api，低版本上面没有这些api，我们没办法使用。但是不用气馁，google官方，以及一些大牛，给我们提供了一些程序，让我们在低版本上面可以实现Material风格的程序，这里就给大家介绍一下。

![妹子图截屏](http://isming.qiniudn.com/screenmeizitu.png)

妹子图截屏

<!--more-->

### 使用support library

使用support library最新的版本，appcomt21，可以在较低版本上面实现部分风格，在之前的文章我已经说过了，这里在系统的说一下。

####应用主题

这部分的话之前的文章说过，链接在这里: [http://blog.isming.me/2014/10/18/creating-android-app-with-material-design-one-theme/](http://blog.isming.me/2014/10/18/creating-android-app-with-material-design-one-theme/)

使用gralde进行构建的话，在依赖中添加v7包：

```java
dependencies {
compile 'com.android.support:appcompat-v7:21.0.+'
compile 'com.android.support:cardview-v7:21.0.+'
compile 'com.android.support:recyclerview-v7:21.0.+'
}

```

使用eclipse构建的话，加入最新的appcompat包即可。

另外在style文件中加入：

```xml
<!-- extend one of the Theme.AppCompat themes -->
<style name="Theme.MyTheme" parent="Theme.AppCompat.Light">
<!-- customize the color palette -->
<item name="colorPrimary">@color/material_blue_500</item>
<item name="colorPrimaryDark">@color/material_blue_700</item>
<item name="colorAccent">@color/material_green_A200</item>
</style>
```

在appliaction中使用我们的这个Theme.MyTheme，上一次的文章中有个错误，这种情况下不需要在valus-v21中创建一个同名的继承自Material的theme,否则会报错。这样我们就可以使用Material风格了。不过低版本上面还是有很多地方不可以实现这种效果的。

#### 使用Toolbar代替ActionBar。
android 5.0增加了ToolBar,可以用其代替ActionBar,在更低版本中，推荐使用，这样，动画特效更方便实现。

在布局文件中增加Toolbar：

```xml
<android.support.v7.widget.Toolbar
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/toolbar"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="?attr/colorPrimaryDark"/>
```

在代码中，使用Toolbar代替ActionBar（Activity必须是继承自ActionBarActivity的）：
```java
@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResource());
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        if (toolbar != null) {
            setSupportActionBar(toolbar);
        }
    }
```



#### 使用CardView

不详说了，参看我之前的博客吧[http://blog.isming.me/2014/10/21/creating-app-with-material-design-two-list/](http://blog.isming.me/2014/10/21/creating-app-with-material-design-two-list/)。

#### 使用动画

对于低版本，在support v7包中，提供了一些兼容，可以使用activity过渡动画(不过效果没有5.0的好)。

首先声明主题的时候，创建一个AppTheme.Base用来声明主题，在其上增加动画属性:

以下放在values/themes.xml中，用于适配低版本：
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="AppTheme.Base"/>

    <style name="AppTheme.Base" parent="Theme.AppCompat">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimary</item>
        <item name="android:windowNoTitle">true</item>
        <item name="windowActionBar">false</item>
    </style>
</resources>
```

以下放在values-v21/themes.xml中
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
<style name="AppTheme" parent="AppTheme.Base">
    <item name="android:windowContentTransitions">true</item>
    <item name="android:windowAllowEnterTransitionOverlap">true</item>
    <item name="android:windowAllowReturnTransitionOverlap">true</item>
    <item name="android:windowSharedElementEnterTransition">@android:transition/move</item>
    <item name="android:windowSharedElementExitTransition">@android:transition/move</item>
</style>
</resources>
```
在代码中启动新Activity的时候，使用v7包中的方法,具体过渡方法跟5.0一样，可以看我之前的博客：
```java
ActivityOptionsCompat options = ActivityOptionsCompat.makeSceneTransitionAnimation(
     activity, transitionView, DetailActivity.EXTRA_IMAGE);
ActivityCompat.startActivity(activity, new Intent(activity, DetailActivity.class),
options.toBundle());
```


### 使用开源控件
对于很多的控件样式，动画，对话框等，使用兼容包无法完成，我们可以使用一些大神开发的第三方包来实现.

组件: [https://github.com/navasmdc/MaterialDesignLibrary](https://github.com/navasmdc/MaterialDesignLibrary)

[https://github.com/keithellis/MaterialWidget](https://github.com/keithellis/MaterialWidget)

上面两个主要是一些实现了Material的组件

Material Design的对话框: [https://github.com/afollestad/material-dialogs](https://github.com/afollestad/material-dialogs)

这个github仓库收集了很多的开源实现，大家可以过来看看。[https://github.com/lightSky/MaterialDesignCenter](https://github.com/lightSky/MaterialDesignCenter)


### 其他
根据提供的规范，自己来实现相应的ui界面以及动画效果等等。
这里提供一下谷歌的规范地址:
谷歌设计规范：[http://www.google.com/design/spec/material-design/introduction.html需要翻墙](http://www.google.com/design/spec/material-design/introduction.html)、[http://design.1sters.com(中文)](http://design.1sters.com/)

图标素材：[https://github.com/google/material-design-icons](https://github.com/google/material-design-icons)、[https://github.com/Templarian/MaterialDesign](https://github.com/Templarian/MaterialDesign)

谷歌IO2014，Material Design的诠释:[https://github.com/google/iosched](https://github.com/google/iosched)

其他人写的应用:[https://github.com/afollestad/cabinet](https://github.com/afollestad/cabinet)


#### 我写的一个应用，从之前的版本改过来，还没完成，大家随便看看就行了,也是Material Design：[https://github.com/sangmingming/Meizitu](https://github.com/sangmingming/Meizitu)


>原文地址：[http://blog.isming.me/2014/11/17/material-design-for-pre-lollipop-android/](http://blog.isming.me/2014/11/17/material-design-for-pre-lollipop-android/)，转载请注明出处。