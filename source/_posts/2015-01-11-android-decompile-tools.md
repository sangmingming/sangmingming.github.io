title: android反编译-反编译工具和方法
comments: true
date: 2015-01-11 22:19:17
tags: [android,decompile,tools]
---

### 前言
开发过程中有些时候会遇到一些功能，自己不知道该怎么做，然而别的软件里面已经有了，这个时候可以采用反编译的方式，解开其他的程序，来了解一些它的做法，同时啊，还可以借鉴别人的软件结构，资源文件，等等，哈哈。那我就来讲解一些关于反编译相关的知识，主要分三篇，第一篇介绍反编译的工具和方法，第二篇，介绍smali的语法,第三篇介绍如何防止反编译，主要通过这几篇文章，了解如何去做反编译和代码加固。
<!--more-->
### 工具
#### apktools-目前最强大的反编译工具

轻松反编译apk，解析出资源文件，xml文件，生成smali文件，还可以把修改后的文件你想生成apk。

支持windows,linux,mac。 

下载地址:[https://code.google.com/p/android-apktool/downloads/list]([https://code.google.com/p/android-apktool/downloads/list]) 请自备梯子

#### dex2jar 

将apk中的dex文件转换成为jar文件，很多人不会看smali文件，还是看java类文件比较舒服，这个时候可以借助这个工具来转成java,也是支持windows,linux,mac。

下载地址：[http://code.google.com/p/dex2jar/downloads/list](http://code.google.com/p/dex2jar/downloads/list)
#### jd-gui
查看jar文件,基本可以看到java class文件了，也是支持mac,windows,linux。

下载地址：[http://jd.benow.ca/](http://jd.benow.ca/)

#### apktool的命令行综合工具推荐 apktool plus
其实是别人写的一个工具，集合了apktool的功能，另外还支持给apk签名。最新版本是v9update6，只支持windows系统。

下载地址：[http://dl.dbank.com/c0jndlkbu4#](http://dl.dbank.com/c0jndlkbu4#)

### 进行反编译

#### 使用apktools

在apktools目录下执行以下命令

>./apktool d pathtoapk outdir #mac linux		
>apktool.bat d pathtoapk outdir #window	


这样就可以反编译成功了，可以查看其中的资源文件，smali文件，当然有的app进行了特殊处理，不是全部可以反编译的。

同时apktool还可以对反编译后的文件逆向成apk文件,格式如下。

 >./apktool b apppath outpath

逆向后的文件要是无签名的需要先签名才可以安装。

#### 使用dex2jar 

apk文件本身其实就是一个zip压缩包，先讲apk改成一个*.zip*文件解压后得到一个classes.dex。到dex2jar的目录，执行以下命令.
	
>./d2j-dex2jar.sh pathtoclasses.dex  #mac linux
> d2j-dex2jar.bat pathtoclasses.dex #wind

之后会生成一个jar文件，用jd-gui打开就可以看到其中的java代码了。

### 其他
其实我们使用的反编译也就这些足够了，通常很多时候无法获取很多的代码，毕竟人家也有措施应对的。


>原文地址：[http://blog.isming.me/2015/01/11/android-decompile-tools/](http://blog.isming.me/2015/01/11/android-decompile-tools/)，转载请注明出处。
