title: "intent和intent过滤以及匹配规则"
date: 2014-09-16 22:41:27
comments: true
tags: ['android']
---

在Android系统中打开Activity，Service, BroadCast 都需要使用到Intent(意图),那么作为一个开发者就需要知道怎么使用Intent，知道怎么通过Intent的匹配规则打开其他的组件,或者给其他组件提供访问接口。因此在这里总结一下Intent和Intent的匹配规则。

### Intent使用示例

显式使用Intent

```java
Intent intent = new Intent(context, XXXActivity.class);
intent.putExtra(Intent.EXTRA_TEXT, "string text");
```

隐式使用

```java
Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parser("http://blog.isming.me"));
```

<!--more-->

AndroidManifest定义IntentFilter规则
```xml
<intent-filter>
     <action android:name="android.intent.action.MAIN" />
     <category android:name="android.intent.category.LAUNCHER" />
 </intent-filter>
```

以上是简单的Intent示例，下面看Intent里面有那些东西，以及Intent的解析规则.

### Intent的成员

action 动作,比如上面的隐式Intent，就是传递了一个View的动作.

data 数据,通过Intent发送的数据, 上面的隐式意图就是通过Uri解析出来数据

category 标签

type 类型 上面的隐式意图就是通过Uri来解析出来类型，即MIME type.

component 组件，即要打开的组件的信息，包名+类名.上面的显式意图就是设置要打开的组件。其他隐式意图也是通过各种参数来最终获取组件。

extras　附加数据,在Intent中附加传递的数据.

### IntentFilter

IntentFilter，刚刚的一个xml配置的intentFilter，同时也可以在代码中配置。通过IntentFilter可以过滤掉不需要的一些隐式意图,必须有action 和category,还可以附加data规则，包含（data type 和data scheme+authority+path）,通常一个Url包含<scheme>://<host>:<port>/<path>,可以通过设置data规则只有在指定的格式才能打开页面。

比如:

```xml
<intent-filter>
    <data android:mimeType="image/*" />
    ...
</intent-filter>
```

上面这个就只有数据是图片的时候才可以打开。


```xml
<intent-filter>
    <data android:scheme="http" />
    ...
</intent-filter>
```

上面这个规则则只允许数据是http的网址可以。


##### 参考资料:

[http://developer.android.com/guide/components/intents-filters.html](http://developer.android.com/guide/components/intents-filters.html)

[http://developer.android.com/reference/android/content/IntentFilter.html](http://developer.android.com/reference/android/content/IntentFilter.html)