---
layout: post
title: "ubuntu快速变装mac"
date: 2014-05-09 22:40:06 +0800
comments: true
tags: ['linux','ubuntu']
---

其实，我喜欢Mac的，想要有个MacBook，喜欢其婀娜多姿的身材，妩媚的脸庞，最终要的是有一个UNIX的心。可惜，屌丝买不起啊，只好用Ubuntu来装装Mac了，有什么办法变装呢，那就是安装主题，哈哈。

之前的时候，还是Ubuntu13.04的时候，用过一个主题，让我的桌面变得真的很像Mac，但是升级到14.04之后，发现那个主题安装不了了。今天偶然发现，原来是作者对其升级了，针对不同版本安装不同的主题包，然后我又恢复原来的那个界面了。遂分享之。

先来晒晒我的界面，(^__^) 嘻嘻……    

![](http://isming.qiniudn.com/ubuntu_mac.png)

<!--more-->

佛说，万物皆有源！首先，我们要先将该软件的源加到我们的源列表中。    
```
sudo add-apt-repository ppa:noobslab/themes
sudo apt-get update
```

然后针对不同版本，安装不同的主题

Ubuntu13.04（更低版本，可以用这个试一下，不保证可以用）    
```
sudo apt-get install mac-icons-noobslab
sudo apt-get install mac-ithemes-noobslab
```

Ubuntu13.10
```
sudo apt-get install mac-icons-v2-noobslab
sudo apt-get install mac-ithemes-v2-noobslab
```

Ubuntu14.04
```
sudo apt-get install mac-icons-v3
sudo apt-get install mac-ithemes-v3
```

执行完之后，需要安装[Ubuntu Tweak](http://ubuntu-tweak.com/) ，在theme中进行更多的设置，我的配置如下图所示。

![](http://isming.qiniudn.com/tweak_mac.png)
