---
layout: post
title: "使用proguard混淆android代码"
date: 2014-05-31 10:24:38 +0800
comments: true
tags: ['android']
---

当前是有些工具比如apktool，dextojar等是可以对我们android安装包进行反编译，获得源码的。为了减少被别人破解，导致源码泄露，程序被别人盗取代码，等等。我们需要对代码进行混淆，android的sdk中为我们提供了ProGrard这个工具，可以对代码进行混淆（一般是用无意义的名字来重命名），以及去除没有使用到的代码，对程序进行优化和压缩，这样可以增加你想的难度。最近我做的项目，是我去配置的混淆配置，因此研究了一下，这里分享一下。

## 如何启用ProGuard

#### ant项目和eclipse项目启用方法
在项目的*project.properties*文件中添加一下代码       
>proguard.config=proguard.cfg  //proguard.cfg为proguard的配置文件    
>proguard.config=/path/to/proguard.cfg //路径不在项目根目录时，填写实际路径    

填写这句配置后，在*release*打包时就会按照我们的配置进行混淆，注意，在我们平时的debug时是不会进行混淆的。
<!--more-->
#### Gradle项目（以及Android Studio）
在build.gradle中进行配置 
```     
android {
    buildTypes {
        release {
            runProguard true
            proguardFiles getDefaultProguardFile('proguard-android.txt')，'some-other-rules.txt'
            //proguardFile 'some-other-rules.txt'  配置单个文件这样
        }
    }
}
```

如上面代码所示，我们可以使用runProguard true开启，并且对其配置混淆配置，可以配置多个文件或单个文件。

android的sdk中已经为我们提供了两个默认的配置文件，我们可以拿过来进行使用，proguard-android.txt和proguard-android-optimize.txt。


## ProGuard配置

上面说到android为我们提供了两个默认的配置文件，在其中，我们可以看到他的一些语法。本节进行描述。


保留选项（配置不进行处理的内容）

-keep {Modifier} {class_specification}    保护指定的类文件和类的成员             
-keepclassmembers {modifier} {class_specification}    保护指定类的成员，如果此类受到保护他们会保护的更好                 
-keepclasseswithmembers {class_specification}    保护指定的类和类的成员，但条件是所有指定的类和类成员是要存在。             
-keepnames {class_specification}    保护指定的类和类的成员的名称（如果他们不会压缩步骤中删除）                        
-keepclassmembernames {class_specification}    保护指定的类的成员的名称（如果他们不会压缩步骤中删除）                  
-keepclasseswithmembernames {class_specification}    保护指定的类和类的成员的名称，如果所有指定的类成员出席（在压缩步骤之后）                   
-printseeds {filename}    列出类和类的成员-keep选项的清单，标准输出到给定的文件             
 
压缩 

-dontshrink    不压缩输入的类文件            
-printusage {filename}              
-whyareyoukeeping {class_specification}                
 
优化 

-dontoptimize    不优化输入的类文件          
-assumenosideeffects {class_specification}    优化时假设指定的方法，没有任何副作用             
-allowaccessmodification    优化时允许访问并修改有修饰符的类和类的成员           
 
混淆 

-dontobfuscate    不混淆输入的类文件                      
-obfuscationdictionary {filename}    使用给定文件中的关键字作为要混淆方法的名称      
-overloadaggressively    混淆时应用侵入式重载             
-useuniqueclassmembernames    确定统一的混淆类的成员名称来增加混淆            
-flattenpackagehierarchy {package_name}    重新包装所有重命名的包并放在给定的单一包中            
-repackageclass {package_name}    重新包装所有重命名的类文件中放在给定的单一包中           
-dontusemixedcaseclassnames    混淆时不会产生形形色色的类名           
-keepattributes {attribute_name,...}    保护给定的可选属性，例如LineNumberTable, LocalVariableTable, SourceFile, Deprecated, Synthetic, Signature, and InnerClasses.         
-renamesourcefileattribute {string}    设置源文件中给定的字符串常量  

后面的文件名，类名，或者包名等可以使用占位符代替    
？表示一个字符
* 可以匹配多个字符，但是如果是一个类，不会匹配其前面的包名
** 可以匹配多个字符，会匹配前面的包名。

在android中在android Manifest文件中的activity，service，provider， receviter，等都不能进行混淆。一些在xml中配置的view也不能进行混淆，android提供的默认配置中都有。       

## ProGuard的输出文件及用处

混淆之后，会给我们输出一些文件，在gradle方式下是在*<project_dir>/build/proguard/*目录下，ant是在*<project_dir>/bin/proguard*目录，eclipse构建在*<project_dir>/proguard*目录像。           
分别有以下文件：        
+ dump.txt 描述apk文件中所有类文件间的内部结构。     
+ mapping.txt 列出了原始的类，方法，和字段名与混淆后代码之间的映射。
+ seeds.txt 列出了未被混淆的类和成员
+ usage.txt 列出了从apk中删除的代码

当我们发布的release版本的程序出现bug时，可以通过以上文件（特别时mapping.txt）文件找到错误原始的位置，进行bug修改。同时，可能一开始的proguard配置有错误，也可以通过错误日志，根据这些文件，找到哪些文件不应该混淆，从而修改proguard的配置。

>注意：重新release编译后，这些文件会被覆盖，所以每次发布程序，最好都保存一份配置文件。

## 调试Proguard混淆后的程序

上面说了输出的几个文件，我们在改bug时可以使用，通过mapping.txt,通过映射关系找到对应的类，方法，字段等。         

另外Proguard文件中包含retrace脚本，可以将一个被混淆过的堆栈跟踪信息还原成一个可读的信息，window下时retrace.bat，linux和mac是retrace.sh，在*<sdk_root>/tools/proguard/*文件夹下。语法为：     

>retrace.bat|retrace.sh [-verbose] mapping.txt [<stacktrace_file>]

例如：

```
retrace.bat -verbose mapping.txt obfuscated_trace.txt
```

如果你没有指定*<stacktrace_file>*，retrace工具会从标准输入读取。


## 一些常用包的Proguard配置

下面再写一些我在项目中使用到的一些第三方包需要单独配置的混淆配置

####  sharesdk混淆注意

```
-keep class android.net.http.SslError
-keep class android.webkit.**{*;}
-keep class cn.sharesdk.**{*;}
-keep class com.sina.**{*;}
-keep class m.framework.**{*;}
```

#### Gson混淆配置
```
-keepattributes *Annotation*
-keep class sun.misc.Unsafe { *; }
-keep class com.idea.fifaalarmclock.entity.***
-keep class com.google.gson.stream.** { *; } 
```

#### Umeng sdk混淆配置

```
-keepclassmembers class * {
   public <init>(org.json.JSONObject);
}

-keep class com.umeng.**

-keep public class com.idea.fifaalarmclock.app.R$*{
    public static final int *;
}

-keep public class com.umeng.fb.ui.ThreadView {
}

-dontwarn com.umeng.**

-dontwarn org.apache.commons.**

-keep public class * extends com.umeng.**

-keep class com.umeng.** {*; }
```


>关于配置方面，我写的不够详细，可以去看参考资料第二条，proguard官方文档。也欢迎大家交流使用遇到的问题和心得。

资料参考：           
*1.[http://proguard.sourceforge.net/](http://proguard.sourceforge.net/)*            
*2.[http://developer.android.com/tools/help/proguard.html](http://developer.android.com/tools/help/proguard.html)*
