---
title: 简单聊聊Android Architecture Componets
date: 2017-05-18 20:01:38
tags: ['Android', '架构']

---

Google IO大会进行中，本次大会Android最大的新闻当属Android O以及Kotlin被官方认可。我发现了原来还有发布官方的架构库，以及推荐使用指南，分享给大家。

##  架构原则

+ 关注分离  
+ 模型驱动UI,优先持久化模型  

<!--more-->

## 新架构

![架构图](http://isming.qiniudn.com/imgac_architecture.png)

如上图所示，为新的架构模式：

### Activity/Fragment

UI层，通常是Activity/Fragment等

监听ViewModel，当VIewModel数据更新时刷新UI

监听用户事件反馈到ViewModel。

### ViewModel

持有保存，或者想Repository来获取UI层需要的数据

响应UI层的事件，执行响应的操作

响应变化，并且通知到UI层

### Repository

App的完全的数据模型，ViewModel交互的对象

提供简单的数据修改和获取的接口

配合好网络层数据的更新与本地持久化数据的更新，同步等

### Data Source

包含本地的数据库等，网络api等

这些基本上和现有的一些MVVM，以及Clean架构的组合比较相似，不过谷歌提供了一些新的类库来帮助我们实现这个架构。

## 谷歌的新玩具

本地IO大会谷歌提供了新的类库来实现这个功能，小标题我写新玩具是因为这个库目前还在alpha1版本，官方只建议在个人小项目中使用。

这个类库包含如下一些东西：

+ Lifecycle

Android声明周期的回调，帮助我们将原先需要在onStart()等生命周期回调的代码可以分离到Activity或者Fragment之外。

+ LiveData

一个数据持有类，持有数据并且这个数据可以被观察被监听，和其他Observer不同的是，它和Lifecycle是绑定的。

+ ViewModel

用于实现架构中的ViewModel，同时是与Lifecycle绑定的，使用者无需担心生命周期。方便在多个Fragment之前分享数据，比如旋转屏幕后Activity会重新create，这时候使用ViewModel可以方便使用之前的数据，不需要再次请求网络数据。

+ Room

谷歌推出的一个Sqlite ORM库，不过使用起来还不错，使用注解，极大简化数据库的操作。

## 框架补充

​    工具库帮助我们进行开发，如果不满足官方的库其实可以自己实现。比如LiveData在某些情况下可使用RxJava代替。

​    数据层官方推荐使用Room或者Realm或者其他Sqlite ORM等都可以，同时从某些方面看Room风格很像Retrofit。网络请求也被推荐使用Retrofit。

​    各层之间的耦合推荐使用服务发现(Service Locator)或者依赖注入(DI)，会上推荐了Dagger。

## 测试

​    各层之间的合理分层，为测试提供极大的方便。

+ UI层测试   

​    使用Android Instrumentation Test，借助Espresso库进行，借助Mock的ViewModel，可以专注于测试UI

+ ViewModel 测试    

​    使用Mock的Repository来提供数据，使用JUnit测试，因为不涉及UI，运行速度会快很多。

+ Repository测试

​    数据层Mock一些数据返回给Repository，使用JUnit测试即可

+ 数据层测试   

​    使用JUnit测试

​    数据库，使用Room的话官方提供了测试支持，在测试时候创建内存数据库即可。

​    网络请求，使用MockWebServer来提供假的服务端即可。

![示例](http://isming.qiniudn.com/imgac_profilefragment.png)

再补一个会议时的项目结构图，以一个用户信息页面为例。

## 最后的话

​    目前这个库还不完善，api可能随时会变，公司项目不建议使用，个人项目可以尝鲜。另外对于已经有的项目，也不建议更换到现在的架构。不过这个项目的好的思想可以借鉴到我们自己的项目中来，同时这个库的方式我们其实可以借助其他的开源库来实现。

#### 本文不再贴相关代码，具体各个库的使用请查看官方文档[https://developer.android.com/topic/libraries/architecture/guide.html](https://developer.android.com/topic/libraries/architecture/guide.html)。
#### 附上官方的DEMO项目:[https://github.com/googlesamples/android-architecture-components](https://github.com/googlesamples/android-architecture-components)
#### 这次的视频:[https://www.youtube.com/watch?v=FrteWKKVyzI](https://www.youtube.com/watch?v=FrteWKKVyzI)

文中如果错误，欢迎指正.

>原文地址：[http://blog.isming.me/2017/05/18/android-architecture-components-guide/](http://blog.isming.me//2017/05/18/android-architecture-components-guide/)，转载请注明出处。

​    