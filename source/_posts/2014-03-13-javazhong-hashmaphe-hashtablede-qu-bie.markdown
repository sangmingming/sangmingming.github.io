---
layout: post
title: "Java中HashMap和HashTable的区别"
date: 2013-07-28 21:30:01 +0800
comments: true
tags: java
---

面试中遇到，但是不会，回来google到，分享下吧，据说是老掉牙的问题
HashMap 是Hashtable 的轻量级实现（非线程安全的实现），他们都完成了Map 接口，主要区别在于HashMap 允许空（null）键值（key）,由于非线程安全，效率上可能高于Hashtable。

HashMap 允许将null 作为一个entry 的key 或者value，而Hashtable 不允许。

HashMap 把Hashtable 的contains 方法去掉了，改成containsvalue 和containsKey。因为contains方法容易让人引起误解。

Hashtable 继承自Dictionary 类，而HashMap 是Java1.2 引进的Map interface 的一个实现。

最大的不同是，Hashtable 的方法是Synchronize 的，而HashMap 不是，在多个线程访问Hashtable 时，不需要自己为它的方法实现同步，而HashMap 就必须为之提供外同步。

Hashtable 和HashMap 采用的hash/rehash 算法都大概一样，所以性能不会有很大的差异。