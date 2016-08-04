title: git中merge和rebase的区别
comments: true
date: 2014-09-26 22:19:45
tags: ["git"]
---


最开始实习的时候是使用svn，之后正式工作就一直在使用git，这样算起来，使用git也有两年的时间了。以前带我的同事，让我在拉代码的时候要我使用`git pull --rebase`，一直很纳闷为什么要那样做，后来遇到拉代码的时候有许多冲突要解决，然后去查找资料，才了解到其中的一些事情。今天分享一下，顺便自己也梳理一下。

### git pull
git pull 是　git fetch + git merge FETCH_HEAD 的缩写。所以，默认情况下，git pull就是先fetch，然后执行merge 操作，如果加*--rebase* 参数，就是使用git rebase 代替git merge。

<!--more-->
### merge 和 rebase

merge 是合并的意思，rebase是复位基底的意思。

现在我们有这样的两个分支,test和master，提交如下：

```java
      D---E test
     /
A---B---C---F master
```

在master执行`git merge test`,然后会得到如下结果：

```java
      D--------E
     /          \
A---B---C---F----G   test, master
```

在master执行`git rebase test`，然后得到如下结果：

```java
A---B---D---E---C'---F'   test, master  
```

可以看到，merge操作会生成一个新的节点，之前的提交分开显示。而rebase操作不会生成新的节点，是将两个分支融合成一个线性的提交。

###　其他内容放这里

通过上面可以看到，想要更好的提交树，使用rebase操作会更好一点。这样可以线性的看到每一次提交，并且没有增加提交节点。

在我们操作过程中。merge 操作遇到冲突的时候，当前merge不能继续进行下去。手动修改冲突内容后，add 修改，commit 就可以了。

而rebase 操作的话，会中断rebase,同时会提示去解决冲突。解决冲突后,将修改add后执行git rebase --continue继续操作，或者git rebase --skip忽略冲突。

>原文地址：[http://blog.isming.me/2014/09/26/git-rebase-merge/](http://blog.isming.me/2014/09/26/git-rebase-merge/)，转载请注明出处。
