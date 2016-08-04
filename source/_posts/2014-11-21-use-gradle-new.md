title: 使用gradle构建android项目（续）
comments: true
date: 2014-11-21 22:09:44
tags: ['android', 'gradle', 'android studio']
---

在几个月之前，我已经写过一篇使用gradle构建android项目的博客了[http://blog.isming.me/2014/05/20/android4gradle/](http://blog.isming.me/2014/05/20/android4gradle/),那篇文章已经介绍了如何使用gradle进行项目构建，以及为谷歌会推荐使用gradle。当时android的gradle插件是0.11.0,现在插件的版本已经是0.14.3了，对于一些老的方法和api，有一些已经被移除，无法使用。因此有必要再写一篇博客介绍这些被移除的部分和替代方案。同时由于个人学识原因，当时没有介绍的一些技巧，其他功能，也会在本文中进行介绍。

![android studio 最新闪屏](http://isming.qiniudn.com/android_studio_new_splash.png)

<!--more-->

### 和上一篇文章相比不兼容的地方

没有看过我另一篇文章的，建议去看一下。

以下这些属性改名，原先的不能用:

>runProguard  ->  minifyEnabled (是否混淆)  
>zipAlign     ->  zipALignEnabled (是否zip对齐) 
>packageName  ->  applicationId 
>jniDebugBuild->  jniDebuggable 
>renderscriptDebug->renderscriptDebuggable  
>renderscriptSupportMode->renderscriptSupportModeEnabled    
>renderscriptNdkMode->renderscriptNdkModeEnabled    
>Variant.packageApplication/zipAlign/createZipAlignTask/outputFile/processResources/processManifest使用variant.out代替，具体使用，看后面代码   

这些被移除替换的，在最新版的gradle插件中，已经不会提示过时，直接报错，请警惕啊！！！！

### 新功能

#### multiDexEnabled 多dex支持
#### shrinkResources 移除未使用的资源
#### 支持定义BuildConfig值和res的值,比如：
   
```groovy
applicationVariants.all { variant ->
    variant.buildConfigField "int", "VALUE", "1"
    variant.resValue "string", "name", "value"
}
```

还可以在`defaultConfig`,`buildType`,`productFlavors`中定义,比如：

```groovy
buildTypes {
        debug {
            applicationIdSuffix ".debug"
            signingConfig signingConfigs.myConfig

            buildConfigField "String", "FOO", "\"bar1\""
            buildConfigField "String", "FOO", "\"bar\""

            resValue "string", "foo", "foo2"

        }
    }
```

通过这样，我们可以对我们生成的最终程序，进行多样划的定制了。

#### Manifest文件内容占位符

这样可以打包的时候，对Manifest进行自定义配置,使用方法:
1. 在Manifest文件中定义一个占位符，比如以我们之前写的umeng打包的例子为例，${UMENG_CHANNEL}，这种格式.

2. 在gradle配置文件中加替换,可以在`defaultConfig`,`buildType`,`productFlavors`中配置，比如:
```groovy
defaultConfig {
    manifestPlaceholders = [ UMENG_CHANNEL:"defaultName"]
}
```

同时，还可以直接在Manifest文件中加包名的替换，直接使用`${applicationId}`即可。

###　其他技巧免费附送

如果使用过程中经常出现OOM,那么在`gradle.properties`文件中增加一下内存，让gradle可以使用更多内存:

```xml
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError
```  

如果因为中文问题，出现错误，最好在org.gradle.jvmargs后面再加上`-Dfile.encoding=UTF-8`,那么这个时候和在一起就是：
```xml
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

如果，因为一些错误，不得不终止，再进来之后，无法进行编译,去`projectpath/.gradle/<gradle-version>/taskArtifacts/`目录下看有没有`*.lock`的文件，删掉再重试。


### 关于android studio和gradle

android studio（以下简称as）今天发布了1.0RC版，意味着正式版本的即将到来，同时在社区，QQ群也可以看到越来越多的人开始在使用android studio。经常也有很多人会问到升级的时候会遇到一些问题，主要原因就是android studio的一些大版本升级后，一般有一个推荐gradle插件的版本,比如,as0.9要求0.14.+版本，as0.8要求0.12+版本。两者是互相依赖的，gradle插件的版本同时对于as也有最低版本要求。这样，我们升级as后也必须修改gradle的配置文件，提高插件版本，同时一些不能向下兼容的配置也需要修改。

在升级gradle和插件版本后，一般都会重新下载gradle，这样会消耗你一点时间。

### 最后，福利

奉上我最近的妹子图的gradle配置:

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:0.14.+'
    }
}

apply plugin: 'com.android.application'

android {
    compileSdkVersion 21
    buildToolsVersion "21.1.0"

    defaultConfig {
        minSdkVersion 9
        targetSdkVersion 21
        versionCode 3
        versionName "1.1.1"
        multiDexEnabled false
        manifestPlaceholders = [ UMENG_CHANNEL_VALUE:"default_channel" ]
        buildConfigField "boolean", "ISDEBUG", "true"
    }

    lintOptions {
        abortOnError false
    }

//签名
    signingConfigs {
        debug {
            //storeFile file("/home/sam/.android/debug.keystore")
        }

        //你自己的keystore信息
        release {
            //storeFile file("/home/sam/sangmingming.keystore")
            //storePassword ""
            //keyAlias "sam"
            //keyPassword ""
        }
    }

    buildTypes {

        debug {
            signingConfig signingConfigs.debug
            buildConfigField "boolean", "ISDEBUG", "true"
        }

        release {
            buildConfigField "boolean", "ISDEBUG", "true"
            signingConfig signingConfigs.release
            minifyEnabled true
            zipAlignEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.txt'
        }
    }

    //渠道Flavors，我这里写了一些常用的，你们自己改
    productFlavors {
        //GooglePlay{}
        //NDuo{}
        xiaomi {}
        umeng {}
    }


    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_7
        targetCompatibility JavaVersion.VERSION_1_7
    }

    productFlavors.all { flavor ->
        flavor.manifestPlaceholders = [ UMENG_CHANNEL_VALUE:name ]
    }

    applicationVariants.all { variant ->

        variant.outputs.each { output ->
            def outputFile = output.outputFile
            if (outputFile != null && outputFile.name.endsWith('.apk')) {
                def fileName = outputFile.name.replace(".apk", "-${defaultConfig.versionName}.apk")
                output.outputFile = new File(outputFile.parent, fileName)
            }
        }
    }
}



dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:21.+'
    compile 'com.android.support:support-v4:21.+'
    compile 'com.android.support:cardview-v7:21.+'
    compile 'com.android.support:recyclerview-v7:21.+'
}

```

然后，我把谷歌最新的gradle配置的示例也拿回来了，分享给大家：[点击下载](http://isming.qiniudn.com/gradle-samples-0.14.4.zip)


参考资料：[http://tools.android.com/tech-docs/new-build-system](http://tools.android.com/tech-docs/new-build-system)


>原文地址：[http://blog.isming.me/2014/11/21/use-gradle-new/](http://blog.isming.me/2014/11/21/use-gradle-new/)，转载请注明出处。