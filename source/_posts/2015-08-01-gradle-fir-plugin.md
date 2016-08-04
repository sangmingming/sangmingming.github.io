title: 一个上传apk到fir的gradle插件
comments: true
date: 2015-08-01 23:19:07
tags: ['android', 'android studio', 'gradle']
---





声明，这不是广告，没有任何利益瓜葛。

App内测需要把安装把安装包放在一个地方进行托管，方便内测人员下载。国内有蒲公英，fir，等等这些网站可以用。

最近fir上了新版本了，上了新的api，新界面，本以为它们会提供gradle的上传工具，结果没有，而且它们新版本还不好用，原本的下载统计浏览统计都没有了，结果上传很慢，甚至上传不了，我便写了一个gradle的上传工具。

<!--more-->

先介绍使用方法吧

### 使用方法

插件目前只有唯一一个task

>uploadFir  --上传apk到fir

集成插件本插件，你要按照如下方法使用

#### 编辑build.gradle

```groovy
buildscript {
  repositories {
    jcenter()
  }

  dependencies {
        classpath 'com.squareup.okhttp:okhttp:2.2.0'
        classpath 'com.squareup.okhttp:okhttp-urlconnection:2.2.0'
        classpath 'org.json:json:20090211'
        classpath 'me.isming:firup:0.4.1'
  }
}

apply plugin: 'me.isming.fir'

fir {
    appId = ""   //app的appid,在fir中可以找到
    userToken = ""  //fir用户的token，也在在fir中找到

    apks {
        release {
            // 要上传的apk的路径,类似下面
            sourceFile  file("/project/main/build/outputs/apk/xxx.apk")
            name ""  //app的名称
            version "3.3.0"  //app的版本version
            build "330"   //app的版本号
            changelog ""  //更新日志
            icon file("....../res/drawable-xxhdpi/icon_logo.png")  //app的icon的路径
        }
    }
}

```


####运行

> $ ./gradlew uploadFir


你也可以在本任务的基础上，在你的build脚本中增加以下内容:

```groovy
uploadFir.dependsOn assembleRelease  //后面为你生成apk的任务
```

这样就可以在执行上传到fir之前首先会生成一个最新的安装包了


本插件基于fir.im官方提供的api文档进行编写，时间匆忙，可能还有一些地方不够完善，还有许多地方可以优化，欢迎star，fork，共同完善。

也可以给我提意见，我来优化。

还有一些代优化的点没有做，后面有空会做，version，build，icon通过程序自动做，而不用手工填写。

项目托管在github上面，生成的jar放在jcenter上面。

github地址：[https://github.com/sangmingming/gradle-fir-plugin](https://github.com/sangmingming/gradle-fir-plugin)


>原文地址：[http://blog.isming.me/2015/08/01/gradle-fir-plugin/](http://blog.isming.me/2015/08/01/gradle-fir-plugin/)，转载请注明出处。
