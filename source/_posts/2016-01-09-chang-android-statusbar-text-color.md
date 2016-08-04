title: Android系统更改状态栏字体颜色
comments: true
date: 2016-01-09 00:41:39
tags: [android]
---


随着时代的发展，Android的状态栏都不是乌黑一片了，在Android4.4之后我们可以修改状态栏的颜色或者让我们自己的View延伸到状态栏下面。我们可以进行更多的定制化了，然而有的时候我们使用的是淡色的颜色比如白色，由于状态栏上面的文字为白色，这样的话状态栏上面的文字就无法看清了。因此本文提供一些解决方案，可以是MIUI6+,Flyme4+，Android6.0+支持切换状态栏的文字颜色为暗色。

<!--more-->

### 修改MIUI

```java
    public static boolean setMiuiStatusBarDarkMode(Activity activity, boolean darkmode) {
        Class<? extends Window> clazz = activity.getWindow().getClass();
        try {
            int darkModeFlag = 0;
            Class<?> layoutParams = Class.forName("android.view.MiuiWindowManager$LayoutParams");
            Field field = layoutParams.getField("EXTRA_FLAG_STATUS_BAR_DARK_MODE");
            darkModeFlag = field.getInt(layoutParams);
            Method extraFlagField = clazz.getMethod("setExtraFlags", int.class, int.class);
            extraFlagField.invoke(activity.getWindow(), darkmode ? darkModeFlag : 0, darkModeFlag);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
```

上面为小米官方提供的解决方案，主要为MIUI内置了可以修改状态栏的模式，支持Dark和Light两种模式。

### 修改Flyme

```java
    public static boolean setMeizuStatusBarDarkIcon(Activity activity, boolean dark) {
        boolean result = false;
        if (activity != null) {
            try {
                WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
                Field darkFlag = WindowManager.LayoutParams.class
                        .getDeclaredField("MEIZU_FLAG_DARK_STATUS_BAR_ICON");
                Field meizuFlags = WindowManager.LayoutParams.class
                        .getDeclaredField("meizuFlags");
                darkFlag.setAccessible(true);
                meizuFlags.setAccessible(true);
                int bit = darkFlag.getInt(null);
                int value = meizuFlags.getInt(lp);
                if (dark) {
                    value |= bit;
                } else {
                    value &= ~bit;
                }
                meizuFlags.setInt(lp, value);
                activity.getWindow().setAttributes(lp);
                result = true;
            } catch (Exception e) {
            }
        }
        return result;
    }
```

同理使用跟miui类似的方式


### 修改Android6.0+

Android 6.0开始，谷歌官方提供了支持，在style属性中配置*android:windowLightStatusBar*
即可， 设置为`true`时，当statusbar的背景颜色为淡色时，statusbar的文字颜色会变成灰色，为`false`时同理。

```xml
<style name="statusBarStyle" parent="@android:style/Theme.DeviceDefault.Light">
    <item name="android:statusBarColor">@color/status_bar_color</item>
    <item name="android:windowLightStatusBar">false</item>
</style>
```

目前为止，android6.0的市场占有率还很少，而MIUI和flyme在国内占有率还算可以，因此，我们可以尽自己所能，适配更多。如果你还有其他的奇淫技巧，也欢迎分享补充。


>原文地址：[http://blog.isming.me/2016/01/09/chang-android-statusbar-text-color/](http://blog.isming.me/2016/01/09/chang-android-statusbar-text-color/)，转载请注明出处。
