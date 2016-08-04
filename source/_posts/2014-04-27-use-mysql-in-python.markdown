---
layout: post
title: "在python中使用mysql"
date: 2014-04-27 22:36:29 +0800
comments: true
tags: ['mysql', 'python']
---


### 缘由
最近在折腾一个小东西需要抓取网上的页面，然后进行解析，将结果放到数据库中。了解到Python在这方面有优势，便选用之。因为我有台服务器上面安装有mysql，自然使用之。在进行数据库的这个操作过程中遇到了不少问题，这里记录一下，大家共勉。
### python中mysql的调用
百度之后可以通过MySQLdb进行数据库操作，查看[文档](http://mysql-python.sourceforge.net/MySQLdb.html),了解到python中提供了一个_mysql时直接实现了mysql的c语言API。MySQLdb是对其在更高一层的封装，因此，使用起来更加方便。我们可以使用_mysql，但更好的方法是使用MySQLdb
<!--more-->
### 安装中遇到的问题
在这个页面[http://sourceforge.net/projects/mysql-python/](http://sourceforge.net/projects/mysql-python/)可以下载到最新版本的MySQLdb，解压后执行安装时，可能会有一些问题。     
    
+ 通过`python setup.py build` 执行安装会提示`No module named setuptools`        
解决方法，安装之        
```     
sudo apt-get install python-setuptools
```

+ 再次执行，可能还是会出错 mysql_config not found  
    此时我们需要安装mysqld-dev
```  

sudo apt-get install libmysqld-dev  
```

+ 可能再次执行还会出现错误，类似这样   ` 
>>>building ‘mysql’ extension gcc -pthread -fno-strict-aliasing -DNDEBUG -g -fwrapv -O2 -Wall -Wstrict-prototypes -fPIC -Dversion_info=(1,2,3,’final’,0) -Dversion=1.2.3 -I/usr/include/mysql -I/usr/include/python2.7 -c mysql.c -o build/temp.linux-i686-2.7/mysql.o -DBIG_JOINS=1 -fno-strict-aliasing -DUNIV_LINUX -DUNIV_LINUX In file included from mysql.c:29:0: pymemcompat.h:10:20: fatal error: Python.h: No such file or directory      

解决方案        
``` 
sudo apt-get install python-dev 
```
这步骤是安装python的一些开发用的头文件。 

+ 基本上前面三种之后，不会再出现其他问题了。但是如果mysql是自己安装的，并且lib文件没有放到/usr/local/lib下面则还会报错。           
解决办法将文件软连接到这个目录下，或者修改系统的/etc/ld.so.cnf文件，把我们lib所在的目录放进去。两种方法都可以，然后在ldconfig，让其生效即可。         
比如我们用第一种方法 `ln -s /usr/local/mysql/lib/mysql/libmysqlclient* /usr/lib`

### 实际使用
1. 引入MySQLdb库 
 
    import MySQLdb

1. 连接数据库 

    conn=MySQLdb.connect(host="localhost",user="root",passwd="sa",db="mytable",charset="utf8")  
提供的connect方法用来和数据库建立连接,接收数个参数,返回连接对象.  
 
3. 执行语句和取结果         

    cursor=conn.cursor() 
    n=cursor.execute(sql,param)     
首先,我们用使用连接对象获得一个cursor对象,接下来,我们会使用cursor提供的方法来进行工作.这些方法包括两大类:1.执行命令,2.接收返回值     
后面再详细说，这里不详说 

4. 结束，关闭数据库连接              
需要分别的关闭指针对象和连接对象.他们有名字相同的方法     
```
cursor.close()         
conn.close() 
```
### 常用操作API
对事务操作的支持,标准的方法 commit() 提交      
rollback() 回滚       
cursor用来执行命令的方法:        
callproc(self, procname, args):用来执行存储过程,接收的参数为存储过程名和参数列表,返回值为受影响的行数         
execute(self, query, args):执行单条sql语句,接收的参数为sql语句本身和使用的参数列表,返回值为受影响的行数       
executemany(self, query, args):执行单挑sql语句,但是重复执行参数列表里的参数,返回值为受影响的行数 nextset(self):移动到下一个结果集      
cursor用来接收返回值的方法:       
fetchall(self):接收全部的返回结果行.      
fetchmany(self, size=None):接收size条返回结果行.如果size的值大于返回的结果行的数量,则会返回cursor.arraysize条数据.        
fetchone(self):返回一条结果行.         
scroll(self, value, mode=‘relative’):移动指针到某一行.如果mode=‘relative’,则表示从当前所在行移动value条,如果 mode=‘absolute’,则表示从结果集的第一行移动value条. 

### 最后插一句
电脑升级到ubuntu14.04重新装的，之前的博客仓库没了，重新从github上面拉回来，中间出了点差错，我删除文件，这篇文章差点没有了，不过还好现在能看到这篇文章。哈哈～～