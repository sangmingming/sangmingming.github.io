title: android反编译-smali语法	
comments: true	
date: 2015-01-14 23:52:44	
tags: [android,decompile,smali]	
---


### 前言
前面我们有说过android反编译的工具，如何进行反编译。反编译后可以得到jar或者得到smali文件。Android采用的是java语言进行开发，但是Android系统有自己的虚拟机Dalvik,代码编译最终不是采用的java的class，而是使用的smali。我们反编译得到的代码，jar的话可能很多地方无法正确的解释出来，如果我们反编译的是smali则可以正确的理解程序的意思。因此，我们有必要熟悉smali语法。

### 类型的表示
java里面包含两种类型，原始类型和引用类型(包括对象)，同时映射到smali也是有这两大类型。

<!--more-->

##### 原始类型
> V void (只能用于返回值类型)	
> Z boolean	
> B byte	
> S short		
> C char	
> I int	
> J long	
> F float	
> D Double

##### 对象类型
> Lpackage/name/ObjectName; 相当于java中的package.name.ObjectName		

*L* 表示这是一个对象类型	
*package/name* 该对象所在的包	
*ObjectName* 对象名称			
*;* 标识对象名称的结束		

##### 数组的表示

*[I* 表示一个int型的一维数组，相当于int[]；		
增加一个维度增加一个*[*,如*[[I*表示*int[][]*

数组每一个维度最多*255*个;

对象数组表示也是类似，如String数组的表示是*[Ljava/lang/String*	

### 寄存器与变量

java中变量都是存放在内存中的，android为了提高性能，变量都是存放在寄存器中的，寄存器为32位，可以支持任何类型，其中long和double是64为的，需要使用两个寄存器保存。

寄存器采用v和p来命名	
v表示本地寄存器，p表示参数寄存器，关系如下

如果一个方法有两个本地变量，有三个参数
> v0     第一个本地寄存器
> v1		第二个本地寄存器
> v2	p0	 (this)
> v3	p1	第一个参数
> v4 	p2	第二个参数
> v5	p3	第三个参数

当然，如果是静态方法的话就只有5个寄存器了，不需要存this了。

.registers 使用这个指令指定方法中寄存器的总数
.locals 使用这个指定表明方法中非参寄存器的总数，放在方法的第一行。


### 方法和字段的表示

##### 方法签名
methodName(III)Lpackage/name/ObjectName;	

如果做过ndk开发的对于这样的签名应该很熟悉的，就是这样来标识一个方法的。	
上面methodName标识方法名，III表示三个整形参数，Lpackage/name/ObjectName;表示返回值的类型。

##### 方法的表示

Lpackage/name/ObjectName;——>methodName(III)Z 	
即 package.name.ObjectName中的 function boolean methondName(int a, int b, int c) 类似这样子

##### 字段的表示

Lpackage/name/ObjectName;——>FieldName:Ljava/lang/String;

即表示： 包名，字段名和各字段类型


#### 方法的定义

比如我下面的一个方法

```java
private static int sum(int a, int b) {
        return a+b;
}
```

使用编译后是这样

```smali

.method private static sum(II)I
    .locals 4   #表示需要申请4个本地寄存器
    .parameter
    .parameter #这里表示有两个参数

    .prologue
    .line 27 
    move v0, p0

    .local v0, a:I
    move v1, p1

    .local v1, b:I
    move v2, v0

    move v3, v1

    add-int/2addr v2, v3

    move v0, v2

    .end local v0           #a:I
    return v0
.end method

```

从上面可以看到函数声明使用*.method*开始 *.end method*结束，java中的关键词private,static 等都可以使用，同时使用签名来表示唯一的方法，这里是*sum(II)I*。

#### 声明成员

.field private name:Lpackage/name/ObjectName;	
比如：private TextView mTextView;表示就是	
.field private mTextView:Landroid/widget/TextView;	
private int mCount;	
.field private mCount:I		

### 指令执行

smali字节码是类似于汇编的，如果你有汇编基础，理解起来是非常容易的。

比如：
move v0, v3 #把v3寄存器的值移动到寄存器v0上.

const v0， 0x1 #把值0x1赋值到寄存器v0上。

invoke-static {v4, v5}, Lme/isming/myapplication/MainActivity;->sum(II)I   #执行方法sum(),v4,v5的值分别作为sum的参数。

### 其他

通过前面我们可以看到，smali就是类似汇编，其中很多命令，我们可以去查它的手册来一一对应。学习时，我们可以自己写一个比较简单的java文件，然后转成smali文件来对照学习。

下面，我贴一个我写的一个比较简单的java文件以及其对应的smali，其中包含if判断和for循环。

java文件：	
```java
package me.isming.myapplication;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

public class MainActivity extends ActionBarActivity {

    private TextView mTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTextView = (TextView) findViewById(R.id.text);

        mTextView.setText("a+b=" + sum(1,2) + "a>b?" + max(1,2) + "5 accumulate:" + accumulate(5));

    }

    private static int sum(int a, int b) {
        return a+b;
    }

    private boolean max(int a, int b) {
        if (a > b) {
            return true;
        } else {
            return false;
        }
    }
    
    private int accumulate(int a) {
        if (a <= 0) {
            return 0;
        }
        int sum = 0;
        for(int i = 0; i <= a; i++) {
            sum += a;
        }
        return sum;
    }
}

```

对应的smali:

```smali
.class public Lme/isming/myapplication/MainActivity;
.super Landroid/support/v7/app/ActionBarActivity;
.source "MainActivity.java"


# instance fields
.field private mTextView:Landroid/widget/TextView;


# direct methods
.method public constructor <init>()V
    .locals 2

    .prologue
    .line 10
    move-object v0, p0

    .local v0, this:Lme/isming/myapplication/MainActivity;
    move-object v1, v0

    invoke-direct {v1}, Landroid/support/v7/app/ActionBarActivity;-><init>()V

    return-void
.end method

.method private accumulate(I)I
    .locals 6
    .parameter

    .prologue
    .line 39
    move-object v0, p0

    .local v0, this:Lme/isming/myapplication/MainActivity;
    move v1, p1

    .local v1, a:I
    move v4, v1

    if-gtz v4, :cond_0

    .line 40
    const/4 v4, 0x0

    move v0, v4

    .line 46
    .end local v0           #this:Lme/isming/myapplication/MainActivity;
    :goto_0
    return v0

    .line 42
    .restart local v0       #this:Lme/isming/myapplication/MainActivity;
    :cond_0
    const/4 v4, 0x0

    move v2, v4

    .line 43
    .local v2, sum:I
    const/4 v4, 0x0

    move v3, v4

    .local v3, i:I
    :goto_1
    move v4, v3

    move v5, v1

    if-gt v4, v5, :cond_1

    .line 44
    move v4, v2

    move v5, v1

    add-int/2addr v4, v5

    move v2, v4

    .line 43
    add-int/lit8 v3, v3, 0x1

    goto :goto_1

    .line 46
    :cond_1
    move v4, v2

    move v0, v4

    goto :goto_0
.end method

.method private max(II)Z
    .locals 5
    .parameter
    .parameter

    .prologue
    .line 31
    move-object v0, p0

    .local v0, this:Lme/isming/myapplication/MainActivity;
    move v1, p1

    .local v1, a:I
    move v2, p2

    .local v2, b:I
    move v3, v1

    move v4, v2

    if-le v3, v4, :cond_0

    .line 32
    const/4 v3, 0x1

    move v0, v3

    .line 34
    .end local v0           #this:Lme/isming/myapplication/MainActivity;
    :goto_0
    return v0

    .restart local v0       #this:Lme/isming/myapplication/MainActivity;
    :cond_0
    const/4 v3, 0x0

    move v0, v3

    goto :goto_0
.end method

.method private static sum(II)I
    .locals 4
    .parameter
    .parameter

    .prologue
    .line 27
    move v0, p0

    .local v0, a:I
    move v1, p1

    .local v1, b:I
    move v2, v0

    move v3, v1

    add-int/2addr v2, v3

    move v0, v2

    .end local v0           #a:I
    return v0
.end method


# virtual methods
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 8
    .parameter

    .prologue
    .line 16
    move-object v0, p0

    .local v0, this:Lme/isming/myapplication/MainActivity;
    move-object v1, p1

    .local v1, savedInstanceState:Landroid/os/Bundle;
    move-object v2, v0

    move-object v3, v1

    invoke-super {v2, v3}, Landroid/support/v7/app/ActionBarActivity;->onCreate(Landroid/os/Bundle;)V

    .line 17
    move-object v2, v0

    const v3, 0x7f030017

    invoke-virtual {v2, v3}, Lme/isming/myapplication/MainActivity;->setContentView(I)V

    .line 19
    move-object v2, v0

    move-object v3, v0

    const v4, 0x7f08003f

    invoke-virtual {v3, v4}, Lme/isming/myapplication/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v3

    check-cast v3, Landroid/widget/TextView;

    iput-object v3, v2, Lme/isming/myapplication/MainActivity;->mTextView:Landroid/widget/TextView;

    .line 21
    move-object v2, v0

    iget-object v2, v2, Lme/isming/myapplication/MainActivity;->mTextView:Landroid/widget/TextView;

    new-instance v3, Ljava/lang/StringBuilder;

    move-object v7, v3

    move-object v3, v7

    move-object v4, v7

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "a+b="

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const/4 v4, 0x1

    const/4 v5, 0x2

    invoke-static {v4, v5}, Lme/isming/myapplication/MainActivity;->sum(II)I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "a>b?"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    move-object v4, v0

    const/4 v5, 0x1

    const/4 v6, 0x2

    invoke-direct {v4, v5, v6}, Lme/isming/myapplication/MainActivity;->max(II)Z

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "5 accumulate:"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    move-object v4, v0

    const/4 v5, 0x5

    invoke-direct {v4, v5}, Lme/isming/myapplication/MainActivity;->accumulate(I)I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 23
    return-void
.end method

```

### 参考资料
最后附上一些参考资料：

[http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html](http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html)	

[https://code.google.com/p/smali/w/list](https://code.google.com/p/smali/w/list)

[http://www.miui.com/thread-409543-1-1.html](http://www.miui.com/thread-409543-1-1.html)



>原文地址：[http://blog.isming.me/2015/01/14/android-decompile-smali/](http://blog.isming.me/2015/01/14/android-decompile-smali/)，转载请注明出处。
