---
layout: post
title: "使用Gradle构建Android项目"
date: 2014-05-20 22:00:06 +0800
comments: true
tags: ['android', 'gradle']
---

新项目中，使用了Google I/O 2013发布的新工具，使用Gradle构建android项目，并且在新版的Intellig IDEA以及google的Android Studio对其支持。本文就介绍一下怎么使用gradle构建android项目，进行多个版本编译。

### Gradle是什么？
[Gradle](http://www.gradle.org/)是以Groovy为基础，面向java应用，基于DSL语法的自动化构建工具。是google引入，替换ant和maven的新工具，其依赖兼容maven和ivy。      
使用gradle的目的: 
             
+ 更容易重用资源和代码;   
+ 可以更容易创建不同的版本的程序，多个类型的apk包；   
+ 更容易配置，扩展;    
+ 更好的IDE集成;  
   
<!--more-->
### 环境需求
Gradle1.10或者更高版本，grale插件0.9或者更高版本.      
android SDK需要有Build Tools 19.0.0以及更高版本      

### Gradle基本结构
使用ide创建的gradle构建的项目，会自动创建一个build.gradle，如下：
```
buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:0.9.0'
    }
}

apply plugin: 'android'

android {
    compileSdkVersion 19
    buildToolsVersion "19.0.0"
}
```

可以看到，构建文件主要有三个区域：

buildscript{...}       
>Configures the build script classpath for this project. 设置脚本的运行环境

apply plugin: 'android'     
>设置使用android插件构建项目

android{...}
>设置编译android项目的参数


### 任务task的执行
通常会有以下任务：

+ assemble   The task to assemble the output(s) of the project（输出一个项目文件，android就是打包apk）
+ check      The task to run all the checks.（运行检查，检查程序的错误，语法，等等）
+ build      This task does both assemble and check  （执行assemble和check）
+ clean      This task cleans the output of the project(清理项目输出文件)

>上面的任务assemble，check，build实际上什么都不做，他们其实都是其他任务的集合。

执行一个任务的方式为`gradle 任务名`， 如`gradle assemble`

在android项目中还有connectedCheck（检查连接的设备或模拟器），deviceCheck（检查设备使用的api版本）

通常我们的项目会有至少生成两个版本，debug和release，我们可以用两个任务assembleDebug和assembleRelease去分别生成两个版本，也可以使用assemble一下子生成两个版本。

gradle支持任务名缩写，在我们执行*gradle assembleRelease*的时候，可以用*gradle aR*代替。


### 基本的构建定制
我们可以在build.gradle文件中配置我们的程序版本等信息，从而可以生成多个版本的程序。     
支持的配置有：    
 
+ minSdkVersion    最小支持sdk版本 
+ targetSdkVersion  编译时的目标sdk版本
+ versionCode       程序版本号
+ versionName       程序版本名称
+ packageName       程序包名
+ Package Name for the test application 测试用的程序包名
+ Instrumentation test runner   测试用的instrumentation实例

例如：
```
android {
    compileSdkVersion 19
    buildToolsVersion "19.0.0"

    defaultConfig {
        versionCode 12
        versionName "2.0"
        minSdkVersion 16
        targetSdkVersion 16
    }
}
``` 

### 目录配置
默认情况下项目目录是这样的
有两个组件source sets，一个main，一个test，对应下面两个文件夹。
src/main/
src/androidTest/

然后对于每个组件目录都有两个目录，分别存储java代码和资源文件
java/
resources/

对于android项目中呢，对应的目录和文件是
AndroidManifest.xml  //该文件src/androidTest/目录下不需要，程序执行时会自动构建
res/
assets/
aidl/
rs/
jni/

如果需要上面这些文件，但是不是在上面所说的目录，则需要设置。
```
sourceSets {
    main {
        java {
            srcDir 'src/java'
        }
        resources {
            srcDir 'src/resources'
        }
    }
}
```

可以给main或者test设置根目录，如
```
 sourceSets {
        androidTest.setRoot('tests')
    }
```

可以指定每种文件的存储路径
```
sourceSets {
        main {
            manifest.srcFile 'AndroidManifest.xml'
            java.srcDirs = ['src']
            resources.srcDirs = ['src']
            aidl.srcDirs = ['src']
            renderscript.srcDirs = ['src']
            res.srcDirs = ['res']
            assets.srcDirs = ['assets']
        }
    }
```

特别是我们的ndk生成的.so文件，通常我们不是放到jni目录中的，我们需要设置一下
```
sourceSets {
        main {
            jniLibs.srcDirs = ['libs']
        }
    }
```

### 签名配置
可以给不同类型进行不同的配置，先看示例：  
```
android {
    signingConfigs {
        debug {
            storeFile file("debug.keystore")
        }

        myConfig {
            storeFile file("other.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }

    buildTypes {
        foo {
            debuggable true
            jniDebugBuild true
            signingConfig signingConfigs.myConfig
        }
    }
}
```

上面的配置文件配置两个类型，一个时debug类型，一个时自己的自定义类型。两个分别使用了不同的签名，同时对于生成密钥，要填写设置的密码。

### 代码混淆设置
直接看代码：  
```
android {
    buildTypes {
        release {
            runProguard true
            proguardFile getDefaultProguardFile('proguard-android.txt')
        }
    }
}
```

以上是使用默认的proguard文件去进行混淆，也可以使用自己编写的规则进行混淆，`proguardFile 'some-other-rules.txt'`

### 依赖配置

程序中会依赖别的包，或者程序，需要引入别的类库。前面也说到了，支持maven。
对于本地的类库，可以这样引入：
```
dependencies {
    compile files('libs/foo.jar')   //单个文件
    compile fileTree(dir: 'libs', include: ['*.jar'])  //多个文件
}

android {
    ...
}
```

对于maven仓库文件：
```
repositories {
    mavenCentral()
}


dependencies {
    compile 'com.google.guava:guava:11.0.2'
}

android {
    ...
}
```


### 输出不同配置的应用

看代码：            
```
android {
    ...

    defaultConfig {
        minSdkVersion 8
        versionCode 10
    }

    productFlavors {
        flavor1 {
            packageName "com.example.flavor1"
            versionCode 20
        }

        flavor2 {
            packageName "com.example.flavor2"
            minSdkVersion 14
        }
    }
}
```
通过以上设置，我们可以输出不同的保命不同的版本号，以及最小sdk的程序包。当然我们可以根据自己的需求去做其他的不同

### 生成多个渠道包（以Umeng为例）
我的完整配置文件

```
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:0.9.+'
    }
}
apply plugin: 'android'

repositories {
        mavenCentral()
}

android {
    compileSdkVersion 19
    buildToolsVersion "19.0.3"

    defaultConfig {
        minSdkVersion 8
        targetSdkVersion 19
        versionCode 1
        versionName "1.0"
    }

    sourceSets {
        main {
            jniLibs.srcDirs = ['libs']
        }
    }

    lintOptions {
        abortOnError false
    }


//签名
    signingConfigs {
        //你自己的keystore信息
        release {
            storeFile file("×.keystore")
            storePassword "×××"
            keyAlias "××××"
            keyPassword "×××"
        }
    }

    buildTypes {

        debug {
            signingConfig signingConfigs.release
        }

        release {
            signingConfig signingConfigs.release
            runProguard false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.txt'
        }
    }

    //渠道Flavors，我这里写了一些常用的，你们自己改
    productFlavors {
        //GooglePlay{}
        //Store360{}
        //QQ{}
        //Taobao{}
        //WanDouJia{}
        //AnZhuo{}
        //AnZhi{}
        //BaiDu{}
        //Store163{}
        //GFeng{}
        //AppChina{}
        //EoeMarket{}
        //Store91{}
        //NDuo{}
        xiaomi{}
        umeng{}
    }

}


//替换AndroidManifest.xml的UMENG_CHANNEL_VALUE字符串为渠道名称
android.applicationVariants.all{ variant ->
    variant.processManifest.doLast{

        //之前这里用的copy{}，我换成了文件操作，这样可以在v1.11版本正常运行，并保持文件夹整洁
        //${buildDir}是指./build文件夹
        //${variant.dirName}是flavor/buildtype，例如GooglePlay/release，运行时会自动生成
        //下面的路径是类似这样：./build/manifests/GooglePlay/release/AndroidManifest.xml
        def manifestFile = "${buildDir}/manifests/${variant.dirName}/AndroidManifest.xml"

        //将字符串UMENG_CHANNEL_VALUE替换成flavor的名字
        def updatedContent = new File(manifestFile).getText('UTF-8').replaceAll("UMENG_CHANNEL_VALUE", "${variant.productFlavors[0].name}")
        new File(manifestFile).write(updatedContent, 'UTF-8')

        //将此次flavor的AndroidManifest.xml文件指定为我们修改过的这个文件
        variant.processResources.manifestFile = file("${buildDir}/manifests/${variant.dirName}/AndroidManifest.xml")
    }
}
```

以上的功能就是替换我的Manifest中的umeng渠道标示，同时去生成不同的apk包。


## 最后说明
程序在buid的时候，会执行lint检查，有任何的错误或者警告提示，都会终止构建，我们可以将其关掉。
```
lintOptions {
        abortOnError false
    }
```


#### 最后PS一下

本人使用gradle确实方便很多，虽然电脑配置低，build的时候比较慢。       
内容呢，主要时参考谷歌官方的文档。       
关于怎么安装，没有讲到，可以参考这篇文章：[http://stormzhang.github.io/android/2014/02/28/android-gradle/](http://stormzhang.github.io/android/2014/02/28/android-gradle/)

附上我参考的文档，没看懂的可以去看看。[http://tools.android.com/tech-docs/new-build-system/user-guide](http://tools.android.com/tech-docs/new-build-system/user-guide)  


>gradle升级了，我又写了一篇，地址这里:[http://blog.isming.me/2014/11/21/use-gradle-new/](http://blog.isming.me/2014/11/21/use-gradle-new/)