---
layout: post
title: "使用Intellij IDEA阅读android源码"
date: 2014-05-11 23:46:09 +0800
comments: true
tags: ['android']
---

一直使用Ubuntu+Intellig IDEA进行android开发，并且android源码已经花了两三个星期下载回来了，但是linux平台，没有好用的source insight，所以一直阅读都是需要看哪个了才去搜索那一个。原来发现，原来android提供了eclipse，idea等工具进行阅读的方法。

在android源码目录有一个目录`development/tools/idegen`，这个就是用来生成idea的project文件的。

那么就开始生成吧！

<!--more-->
首先在源码根目录执行这个文件
``` bash
sh ./development/tools/idegen/idegen.sh
```

发现需要idegen.jar文件，我这里贡献给大家，把这个文件复制到out/host/linux-x86/framework/目录下，然后重新执行刚才的命令即可。[文件下载地址](/images/idegen.jar)

给我的提示是：
>Read excludes: 25ms
>Traversed tree: 592981ms

即，总共花费这么多时间，当然电脑快的话，可能也会更快一点。

在我的源码目录生成了*android.iml*和*android.ipr*两个文件。


然后在idea中点击file>open，选择刚刚生成的android.ipr文件即可。