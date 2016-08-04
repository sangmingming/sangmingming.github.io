---
layout: post
title: "android中网络操作使用总结（http）"
date: 2014-05-11 22:49:26 +0800
comments: true
tags: ['android']
---


Android是作为智能手机的操作系统，我们开发的应用，大多数也都需要连接网络，通过网络发送数据、获取数据，因此作为一个应用开发者必须熟悉怎么进行网络访问与连接。通常android中进行网络连接一般是使用scoket或者http，http是最多的情况，这里，我来总结下，怎么进行http网络访问操作。

android是采用java语言进行开发的，android的包中包含java的URLConnection和apache 的httpclient，因此我们可以使用这两个工具进行网络连接和操作。同时，为了控制是否允许程序连接网络，我们开发应用时，需要在Manifest文件中配置申请网络连接的权限，代码如下。
```xml
<uses-permission android:name="android.permission.INTERNET"/> 
```

<!--more-->
### 使用URLConnection连接网络
URLConnection为java.net包中提供的网络访问，支持http，https，ftp等，进行http连接时，使用HttpURLConnection即可，示例代码如下：

```java
URL url = new URL("http://www.android.com/");
HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
try {
    InputStream in = new BufferedInputStream(urlConnection.getInputStream());
    readStream(in);   //该方法是我们自己写的，从流中取数据保存到本地，实现从网络获取数据。
finally {
    urlConnection.disconnect();
}
```

向服务器提交数据时，需要采用POST传输
```java
HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
try {
    urlConnection.setDoOutput(true);    //设置可以上传数据
    urlConnection.setChunkedStreamingMode(0);

    OutputStream out = new BufferedOutputStream(urlConnection.getOutputStream());
    writeStream(out);   //该方法时我们自己写的，向输出流中写数据，实现数据上传。

    InputStream in = new BufferedInputStream(urlConnection.getInputStream());
    readStream(in);
finally {
    urlConnection.disconnect();
}
```
更多使用方法和函数请查看:[http://developer.android.com/reference/java/net/HttpURLConnection.html](http://developer.android.com/reference/java/net/HttpURLConnection.html)

同时HttpsURLConnection的使用方法请查看:[http://developer.android.com/reference/javax/net/ssl/HttpsURLConnection.html](http://developer.android.com/reference/javax/net/ssl/HttpsURLConnection.html)

### 使用HttpClient
这个呢，我们也可以使用AndroidHttpClient页可以使用apache默认的DeafultHttpClient,两者之间仅仅常见Client不同，其他都一样

创建AndroidHttpClient
```java
AndroidHttpClient httpClient = AndroidHttpClient.newInstance("user-agent");
```java
创建DefaultHttpClient
```java
HttpClient client = new DefaultHttpClient();
```

GET请求
```java
HttpGet getRequest = new HttpGet("http://blog.isming.me");
try {  
    HttpResponse response = httpClient.execute(getMethod); //发起GET请求  
  
    Log.i(TAG, "resCode = " + response.getStatusLine().getStatusCode()); //获取响应码  
    Log.i(TAG, "result = " + EntityUtils.toString(response.getEntity(), "utf-8"));//获取服务器响应内容  
} catch (ClientProtocolException e) {  
    // TODO Auto-generated catch block  
    e.printStackTrace();  
} catch (IOException e) {  
    // TODO Auto-generated catch block  
    e.printStackTrace();  
}  
```

发起POST请求：
```java
//先将要传的数据放入List  
params = new LinkedList<BasicNameValuePair>();  
params.add(new BasicNameValuePair("param1", "Post方法"));  
params.add(new BasicNameValuePair("param2", "第二个参数"));  
              
try {  
    HttpPost postMethod = new HttpPost(baseUrl);  
    postMethod.setEntity(new UrlEncodedFormEntity(params, "utf-8")); //将参数填入POST Entity中  
                  
    HttpResponse response = httpClient.execute(postMethod); //执行POST方法  
    Log.i(TAG, "resCode = " + response.getStatusLine().getStatusCode()); //获取响应码  
    Log.i(TAG, "result = " + EntityUtils.toString(response.getEntity(), "utf-8")); //获取响应内容  
                  
} catch (UnsupportedEncodingException e) {  
    // TODO Auto-generated catch block  
    e.printStackTrace();  
} catch (ClientProtocolException e) {  
    // TODO Auto-generated catch block  
    e.printStackTrace();  
} catch (IOException e) {  
    // TODO Auto-generated catch block  
    e.printStackTrace();  
}  
```

### 说明
从上面看到，使用HttpClient更加方便，明了。不过Android官方给我们的文档说明是建议android2.2及以下版本建议使用HttpClient，android2.3及以上版本建议使用HttpURLConnection。

原因是HttpURLConnection时一个轻量级的Http客户端，提供的API比较简单，方便扩展，但是在2.2及以前版本中，这个API存在一些bug，在2.3的版本中，给修改了。

而HttpClient虽然稳定，bug少，但是其提供的API很多，进行升级和扩展不方便，android团队在提升和优化其方面的积极性不高。

因此，在Android2.2版本以前，使用HttpClient时最好的选择。      
Android2.3版本及以后，使用HttpURLConnection时最佳选择。

### 框架
网络连接是耗时的操作，通常我们不会将其放在UI线程操作，会编写异步线程，将其放在后台线程执行（[异步线程操作看这里](http://blog.isming.me/blog/2014/03/16/androidyi-bu-cao-zuo-zong-jie/)）。

而网上有一些线程的网络操作框架，可以减少我们的工作量，同时我们自己写的好，可能很多异常处理之类的，没有其向的更加全面。   
    
有轻量的[android-async-http](http://loopj.com/android-async-http/)             
谷歌官方的[volley](https://android.googlesource.com/platform/frameworks/volley/)         
Square提供的[Retrofit](http://square.github.io/retrofit/)                

这个可以根据自己项目的需要选择不同的框架，有空我来写写volley的使用（`PS：网上已经有使用方法了，自己百度去`），另外两个我的连接中已经有使用方法了。          

>ok，完成！          
>写的东西不少，但是介绍的不够详细。如果不清楚的，欢迎与我交流
