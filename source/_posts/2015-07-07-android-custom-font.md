title: Android应用使用自定义字体的一些探究
comments: true
date: 2015-07-07 19:04:22
tags: [android]
---

最近团队里面在做程序界面统一的工作，因此希望统一字体，接到一个研究怎么自定义字体的任务。因为我们的开发模式，所以需要研究在界面内的字体自定义，以及webview的显示中的字体自定义。

### android系统内置字体
android 系统本身内置了一些字体，可以在程序中使用，并且支持在xml配置textView的时候进行修改字体的样式。支持字段为`android:textStyle` ,`android:typeface`, `android:fontFamily`，系统内置了`normal|bold|italic`三种style, 内置了`normal`，`sans`,`serif`,`monospace`，几种字体（实测这几种字体仅英文有效），typace和fontFamily功能一样。

<!--more-->

### 使用自定义的字体
以上的方式可以改变字体的样式，还不是真正的自定义。

android系统支持TypeFace，即ttf的字体文件。

我们可以在程序中放入ttf字体文件，在程序中使用Typeface设置字
体。

第一步，在assets目录下新建fonts目录，把ttf字体文件放到这。
第二步，程序中调用：

```java
AssetManager mgr=getAssets();//得到AssetManager
Typeface tf=Typeface.createFromAsset(mgr, "fonts/ttf.ttf");//根据路径得到Typeface
tv.setTypeface(tf);//设置字体
```

注意ttf文件命名不能使用中文,否则可能无法加载。

对于需要使用比较多的地方，可以写一个TextView的子类来统一处理。


### 在webview中使用自定义地体

对于本地的网页，在asset目录放字体文件，并在css中添加以下内容，自定义一个字体face，并且在需要的地方使用这个字体face即可。

```css
@font-face {
	font-family: "MyFont";
	src: url('file:///android_asset/fonts/ttf.ttf');
}

h3 { font-family:"MyFont"}
```


对于在线的网页，则需要把字体文件放到服务器，使用同样的方式定义字体face,应用到每个地方。

为了减少网页或者说服务器端的工作，可以使用本地注入的方式注入font-face的css，并对整个网页进行样式替换。

给webview自定义webViewClient,重写`onPageFinish`,在其中添加如下内容：

```java
view.loadUrl("javascript:!function(){" +
        "s=document.createElement('style');s.innerHTML="
        + "\"@font-face{font-family:myhyqh;src:url('**injection**/hyqh.ttf');}*{font-family:myhyqh !important;}\";"
        + "document.getElementsByTagName('head')[0].appendChild(s);" +
        "document.getElementsByTagName('body')[0].style.fontFamily = \"myhyqh\";}()");
``` 

由于网页上是没有权限访问本地的asset文件夹的，因此我们需要拦截请求来加载本地的文件，我这里替换了`file:///android_assets/`为 `**injection**/`了，我们还需要重写
`shouldInterceptRequest`
在请求为我们这个字体文件的时候，加载本地文件：

```java
@Override
public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
    WebResourceResponse response =  super.shouldInterceptRequest(view, url);
    CLog.i("load intercept request:" + url);
    if (url != null && url.contains("**injection**/")) {

        //String assertPath = url.replace("**injection**/", "");
        String assertPath = url.substring(url.indexOf("**injection**/") + "**injection**/".length(), url.length());
        try {

            response = new WebResourceResponse("application/x-font-ttf",
                    "UTF8", getAssets().open(assertPath)
                    );
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    return response;
}
```




###问题

使用字体统一界面，但是也遇到了一些问题，如下：

1.	运行速度变慢（毫秒级，用户觉查不到），由于需要读取自定义的字体文件，以及需要渲染，比使用系统字体要慢。
2.	emoji在5.0以下的系统会有问题。
3.	在网页，如果采用服务器文件的方法，会消耗用户的流量
4.	在网页，采用本地注入方式，因为是在onpagefinish后才开始加载字体，因此页面会重新渲染，影响效果。这样还会造成网页可能会出现样式错误。


因为我们的程序中大量使用到emoji，以及考虑到性能的问题，决定还是使用系统自带的字体了。


如果你在这方面有更好的方案，欢迎交流！


>原文地址：[http://blog.isming.me/2015/07/07/android-custom-font/](http://blog.isming.me/2015/07/07/android-custom-font/)，转载请注明出处。

