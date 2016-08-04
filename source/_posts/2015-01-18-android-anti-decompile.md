title: android反编译-如何防止反编译
comments: true
date: 2015-01-18 01:35:53
tags: [android,decompile]
---


### 前言

前面介绍了怎样去反编译别人的代码。哈哈，这里居然又写进行防止反编译。但是，还是先来写写吧。

### 使用ProGuard

proguard android的sdk中就有提供，使用它可以对代码进行混淆和精简，处理后的代码，虽然仍然可以反编译，但是阅读起来相当困难，降低代码的可读性。操作简单，推荐使用。

<!--more-->

proguard使用方法和配置，可以看我之前的博客： [http://blog.isming.me/2014/05/31/use-proguard/](http://blog.isming.me/2014/05/31/use-proguard/)

另外网上有别人共享的proguard配置模板，也可以参考： [https://github.com/krschultz/android-proguard-snippets](https://github.com/krschultz/android-proguard-snippets)


如果大家有去proguard的官网，ProGuard的公司提供的DexGuard可以给android程序提供更多的优化和保护，不过这个软件收费的，有需要的也可以去了解以下（我不是广告，(^_^））。

### 代码转移到native

代码放在native层的话，使用我前面的方法就没办法去反编译了，这时就需要借助反编译c的方法了，这个我没有研究过了。

因此写在native层也是很安全的，但是因为native更难写，只建议偏重于专利，或者机密数据，等一些功能和逻辑写在native层。更加安全，也更快速。

### 使用第三方加密工具

国内现在也出现了很多apk加固工具，比如爱加密，梆梆加密等等。这些没有去使用过，但是看过网上的介绍，以及他们的自己的介绍，大致了解到，是在我们的apk之外加壳，对我们的dex文件进行加密来做的。

使用这些工具可以来帮助提高软件的安全性，但是使用之前也要确保服务的可靠性，服务商的信誉。


### 个人之见

以上只是本人想到的几种，比较可行的方案。同时肯定还有其他的方式，比如采用签名验证，插件开发等等机制。

在我看来，软件的一定程度的混淆是有必要的，毕竟这个一个公司的财产（很多公司靠一个app营收），不过一些不是很特有的东西也是可以开源的。毕竟，现在网上的开源项目很多，我们也从中使用，借鉴了很多，也要回馈开源社区才行

文章系本人拙见，如果这方面你有什么好的方法，或者有什么好的建议，也可以评论交流。

>原文地址：[http://blog.isming.me/2015/01/18/android-anti-decompile/](http://blog.isming.me/2015/01/18/android-anti-decompile/)，转载请注明出处。