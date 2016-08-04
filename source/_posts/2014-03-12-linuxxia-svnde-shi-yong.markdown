---
layout: post
title: "Linux下SVN的使用"
date: 2013-07-12 21:30:52 +0800
comments: true
tags: linux
---

今天在新浪sae上搭建了个人博客，新浪sae采用svn的方式进行代码管理，之前在windows下面做svn操作都是采用TortoiseSVN，今天正好开机到了linux下面，那么好吧，就用svn传我的wordpress到sae中去。

首先，安装svn。

> sudo apt-get install subversion

ubuntu下面安装svn，就是这么简单。
<!-- more -->
可以通过man svn查看使用手册。

下面介绍一些常用命令：
1.检出文件（checkout）。
使用命令：
> svn co http://{svn repository url} /destination 

然后系统会用当前的用户名登录，提示输入密码，如果第一次密码输入错误，会提示你输入用户名；输入正确后，就可以检出文件了。

2、Ubuntu SVN提交文件（commit）。
进入需要更新的目录，输入命令：

> svn commit -m path-to-commit

，其中path-to-commit可以为空，成功后会提示更新后的版本号。

3、更新文件（update）。

> svn update

，在要更新的目录运行这个命令就可以了。

4、查看日志（log）。

> svn log path

5.删除文件

> svn delete svn://xxx.com/test.php -m “delete test file”

或者直接svn delete test.php 然后再svn ci -m ‘delete test file‘，推荐使用这种简写：svn (del, remove, rm)

更多使用方法，自己查看手册吧。
