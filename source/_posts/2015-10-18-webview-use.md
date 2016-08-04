title: Android WebView使用的技巧与一些坑
comments: true
date: 2015-10-18 17:10:09
tags: [android]
---


随着手机性能的提高，以及iOS和Android两个平台的普及，更多的App都会选择两个平台的App都进行开发，在有些时候，为了更加快速的开发，我们会采用hybird方式开发，这个时候我们需要使用webview并且自己进行一些配置。Android的webview在低版本和高版本采用了不同的webkit版本内核，4.4后直接使用了chrome，因此问题很多，这里分享一些我使用过程的一些技巧和遇到的坑。

<!--more-->

###webview配置###

```java
mWebview.getSettings().setJavaScriptEnabled(true); //设置允许运行javascript
// HTML5 API flags
mWebview.getSettings().setAppCacheEnabled(true);  //设置允许缓存
mWebview.getSettings().setDatabaseEnabled(true); //设置允许使用localstore
```

上面webview.getSettings()会获得WebSettings对象，在这个对象中会保存Webview的一些设置，比如上面所设置的这些，更多的设置请查看WebSettings的api文档。

通常我们还会使用WebViewClient和WebChromeClient这两个组件来辅助WebView。WebViewClient主要帮助处理各种通知请求事件等，比如页面开始加载，加载完成等。WebChromeClient主要辅助WebView处理javascript对话框，网站图标，网站标题，加载进度等等。
实际应该根据实际情况使用这两个组件，重写响应的方法，在其中执行自己的一些操作。

###Javascript的使用###

开启javascript的方法上面已经提到了。

客户端调用网页中的js代码，或者执行相应的代码。

```java
private void evaluateJavascript(String js) {  
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        mWebview.evaluateJavascript(js, null);
    } else {
        mWebview.loadUrl(js);
    }
}
```

在android4.4开始系统提供了evaluateJavascript方法来执行js方法，并且可以进行回调。但是在低于4.4的版本并没有这个方法，我们需要只要直接通过loadUrl的方式来执行js，此时需要在js代码前加”javascript:”。

另外可以在客户端定义一些javascript给网页中调用。
比如这样:

首先定义一个给js执行的类：

```java
public class WebAppInterface {
    Context mContext;

    /** Instantiate the interface and set the context */
    WebAppInterface(Context c) {
        mContext = c;
    }

    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }
}

webView.addJavascriptInterface(new WebAppInterface(this), "Android");
```

之后用*addJavascriptInterface&设置到webview上，在js中就可以用```Android.showToast(“fdf")```调用了。

需要注意的是，在我们给js的接口方法需要是public的，使用到了JavascriptInterface的注解，这个注解在Android4.2的时候添加,更新的android如果不加这个注解是不可以使用的。


###硬件加速###
硬件加速是个大坑，请勿打开。
在android4.4后使用的chrome，系统会自行开启。

###其他###

以及使用WebView，给忘了给应用申请网络访问的权限。

还有一些知识点没整理到，请参考webview的文档，更多的坑以后踩到再更新。

另外JeremyHe总结的知识也不错，可以参考:[http://zlv.me/posts/2015/01/14/08_Android-Webview%E4%BD%BF%E7%94%A8%E5%B0%8F%E7%BB%93/](http://zlv.me/posts/2015/01/14/08_Android-Webview%E4%BD%BF%E7%94%A8%E5%B0%8F%E7%BB%93/)


>原文地址：[http://blog.isming.me/2015/10/18/webview-use/](http://blog.isming.me/2015/10/18/webview-use/)，转载请注明出处。
