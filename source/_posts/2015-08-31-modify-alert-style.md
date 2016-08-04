title: 改变support中AlertDialog的样式
comments: true
date: 2015-08-31 19:57:15
tags: ['android']
---


android最近的support库提供了AlertDialog，可以让我们在低于5.0的系统使用到跟5.0系统一样的Material Design风格的对话框，但是使用了一段时间想到一些办法去改变对话框按钮字体的颜色，都不生效。

最近在网上找到了改变的方法，首先来说一下。

<!--more-->

### 改变AlertDialog的样式

在xml中定义一个主题：
```xml
<style name="MyAlertDialogStyle" parent="Theme.AppCompat.Light.Dialog.Alert">
    <!-- Used for the buttons -->
    <item name="colorAccent">#FFC107</item>
    <!-- Used for the title and text -->
    <item name="android:textColorPrimary">#FFFFFF</item>
    <!-- Used for the background -->
    <item name="android:background">#4CAF50</item>
</style>
```
样式如下图所示：

![](http://7mj53c.com1.z0.glb.clouddn.com/2015/modify_dialog_style.jpg)


在创建的对话框的时候，这样创建就可以了。
```java
AlertDialog.Builder builder = new AlertDialog.Builder(this, R.style.MyAlertDialogStyle);
builder.setTitle("AppCompatDialog");
builder.setMessage("Lorem ipsum dolor...");
builder.setPositiveButton("OK", null);
builder.setNegativeButton("Cancel", null);
builder.show();
```

这样的方法是每个地方使用的时候，都要在构造函数传我们的这个Dialog的Theme，我们也可以全局的定义对话框的样式。

```xml
<style name="MyTheme" parent="Base.Theme.AppCompat.Light">
    <item name="alertDialogTheme">@style/MyAlertDialogStyle</item>
    <item name="colorAccent">@color/accent</item>
</style>
```

在我们的AndroidManifest.xml文件中声明application或者activity的时候设置theme为MyTheme即可，不过需要注意的一点是，我们的Activity需要继承自AppCompatActivity。


### 其他

从上面改变对话框的样式，可以想到用同样的思路来实现应用的换肤，应用主题之类的功能。


>原文地址：[http://blog.isming.me/2015/08/31/modify-alert-style/](http://blog.isming.me/2015/08/31/modify-alert-style/)，转载请注明出处。
