---
layout: post
title: "git使用技巧"
date: 2013-11-18 23:23:33 +0800
comments: true
tags: ['git','linux']
---


这几天开始工作了，工作中使用了git进行项目管理，这才发现原来我以前所知道的git使用那只是一点皮毛。					
写一些这几天用到的一些git技巧喽，以后有的话继续更新啦。				
> git status 查看当前的状态，那些文件修改了，那些文件创建还没有add的。		

<!--more-->

> git add . 添加所有的修改				
或者			
> git  add 文件名或者文件路径，添加指定的	
> git stash 将没有commit的部分文件放到暂存栈去，这样从服务器pull文件的时候不会有问题。			
> git stash pop 是将暂存栈的东西拿回来	
> 	git stash clear 将暂存栈中的东西清空，要慎用，这样你放在暂存中的修改都将丢失    
> 	git reset 将所有git add 的撤销   
   
### 将其他的分支中的某个修改合并到当前分支    
1. git cherry-pick sha1（用gitk 在那个分支上面可以看到）    
2. git reset –soft 合并当前分支和cherry过来的分支。两个分支的代码都保留       如果参数用 *hard* 那么本地的将会被抹掉      
3. git commit –ammend     
这样就完成了
 
### 修改两次前的提交
1. git rebase -i HEAD~2       
2. 修改那个提交的状态，即把pick改为edit      
3. 回去修改文件     
4. git commit –amend    
5. git rebase –continue    
这样也就ok了   
 
git里面很多东西很有用，好吧，以后好好学习。