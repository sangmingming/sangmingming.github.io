---
layout: post
title: "Java中Collection和Collections的区别"
date: 2013-07-23 19:12:46 +0800
comments: true
tags: java
---
前几天去一个公司参加面试遇到这个问题，Java中Collection和Collections的区别，当时不会，回来从网上找到，现在记录一下。

1、java.util.Collection 是一个 *集合接口*。它提供了对集合对象进行基本操作的通用接口方法。Collection接口在Java 类库中有很多具体的实现。Collection接口的意义是为各种具体的集合提供了最大化的统一操作方式。

 Collection    
 ├List   
 │├LinkedList   
 │├ArrayList   
 │└Vector   
 │　└Stack└Set

2、java.util.Collections 是一个包装类。它包含有各种有关集合操作的 *静态多态方法*。此类 *不能实例化* ，就像一个 *工具类*，服务于Java的Collection框架。
 
    import java.util.ArrayList;      
    import java.util.Collections;      
    import java.util.List;      
    public class TestCollections {      
        public static void main(String args[]) {     
            //注意List是实现Collection接口的       
            List list = new ArrayList();      
            double array[] = { 112, 111, 23, 456, 231 };      
            for (int i = 0; i < array.length; i++) {      
                list.add(new Double(array[i]));      
            }      
            Collections.sort(list);      
            for (int i = 0; i < array.length; i++) {      
                System.out.println(list.get(i));      
            }      
            // 结果：23.0 111.0 112.0 231.0 456.0      
        }      
    }
