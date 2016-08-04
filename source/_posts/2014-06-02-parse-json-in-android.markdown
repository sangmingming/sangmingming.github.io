---
layout: post
title: "android中JSON的解析"
date: 2014-06-04 22:57:01 +0800
comments: true
tags: ['android','json']
---


android中网络数据传输是经常被用到的，通常我们使用xml或者json，而json更加轻量，便捷，我们使用的更多。我自己在项目中使用很多，今天就说说android中怎么去解析JSON，帮助自己总结内容，同时帮助别人少走弯路。

##JSON语法        
首先看JSON的语法和结构，这样我们才知道怎么去解析它。JSON语法时JavaScript对象表示语法的子集。

JSON的值可以是：  

+   数字（整数或者浮点数）

+   字符串（在双引号内）

+   逻辑值(true 或 false)

+   数组(使用方括号[]包围)

+   对象( 使用花括号{}包围)

+   null

JSON中有且只有两种结构：对象和数组。

1、对象：对象在js中表示为“{}”括起来的内容，数据结构为 *{key：value,key：value,...}*的键值对的结构，在面向对象的语言中，key为对象的属性，value为对应的属性值，所以很容易理解，取值方法为 对象.key 获取属性值，这个属性值的类型可以是 数字、字符串、数组、对象几种。
<!--more-->
2、数组：数组在js中是中括号“[]”括起来的内容，数据结构为 *["java","javascript","vb",...]*，取值方式和所有语言中一样，使用索引获取，字段值的类型可以是 数字、字符串、数组、对象几种。

##andoroid解析JSON
android sdk中为我们提供了org.json，可以用来解析json，在android3.0又为在android.util包JsonReader和JsonWriter来进行json的解析和生成。

####使用org.json包JSONObject和JSONArray进行解析
我们知道json中就两种结构array和object，因此就有这个两个类进行解析。

如我们有下面几个json字符串：

```javascript
{"name":"sam","age":18,"weight":60} //json1 一个json对象
[12,13,15]                    //json2 一个数字数组
[{"name":"sam","age":18},{"name":"leo","age":19},{"name":"sky", "age":20}] //json3 json array中有object

```

第一个json对象json1的解析

```java
JSONObject jsonObj = new JSONObject(json1);
String name = jsonObj.optString("name");
int age = jsonObj.optInt("age");
int weight = jsonObj.optInt("weight");
```
另外还有

```java
Object opt（String name）
boolean optBoolean(String name)
double optDouble(String name)
JSONArray optJSONArray(String name)
JSONObject optJSONObject(String name)
```

等方法，我推荐用这些方法，这些方法在解析时，如果对应字段不存在会返回空值或者0，不会报错。

当然如果你使用以下方法
```java
Object get(String name)
boolean getBoolean(String name)
int getInt(String name)
```
等方法时，代码不会去判断是否存在该字段，需要你自己去判断，否则的话会报错。自己判断的话使用`has(String name)`来判断。

再来看解析数组，简单的数组。第二个json2
```java
JSONArray jsonArray = new JSONArray(json2);
for (int = 0; i < jsonArray.length();i++) {
    int age = jsonArray.optInt(i); 
}

```

解析复杂数组，包含对象，json3
```java
JSONArray jsonArray = new JSONArray(json3);
for (int = 0; i < jsonArray.length();i++) {
    JSONObject jsonObject = jsonArray.optJSONObject(i);
    String name = jsonObject.optString("name");
    int age = jsonObject.optInt("age");
}
```

从上面可以看到数组的话解析方法和对象差不多，只是将键值替换为在数组中的下标。另外也是有optXXX（int index）和getXXX（int index）方法的，opt也是安全的，即对应index无值的时候，不会报错，返回空，推荐使用。

####使用JsonReader进行解析

JsonReader的使用其实和xml解析中的pull是有一点类似的，我们来看示例。

前面的JSONObject和JSONArray创建时传的是String，而JsonReader需要传入的时候是Reader，网络访问中，我们可以直接拿输入流传进来，转成Reader。我们这里假设我们上面的String已经转成InputStream了，分别为jsonIs1，jsonIs2,jsonIs3。

上面的json1解析：


```java
JsonReader reader = new JsonReader(new InputStreamReader(jsonIs1));
try {积分：49排名：第1495693名上传资源：1
    reader.beginObject();
    while (reader.hasNext()) {
        String keyName = reader.nextName();
        if (keyName.equals("name")) { 
            String name = reader.nextString();
        } else if (keyName.equals("age")) {
            int age = reader.nextInt();
        } else if (keyName.equals("weight")) {
            int weight = reader.nextInt();
        }
    }
    reader.endObject();
} finally {
    reader.close();
}

```

上面json2的解析:

```java
JsonReader reader = new JsonReader(new InputStreamReader(jsonIs2));
try {
    List<Integer> ages = new ArrayList<Integer>();
    reader.beginArray();
    while (reader.hasNext()) {
        ages.add(reader.nextInt());
    }
    reader.endArray();
} finally {
    reader.close();
}
```

第三个我就不写示例了。

看到这个的话是通过去遍历我们的json，去取得我们的内容，我觉得在效率上面会比第一种效率高一些。具体使用的话就按照我这两个例子可以写出来的。

##使用GSON解析JSON

GSON是谷歌出品，很好用。同时呢还有一些其他的第三方的比如fastjson等，都和Gson差不多，传一个string和要转换的对象，帮你直接直接解析出来，不再需要我们自己一个字段一段字段的解析。这里就以Gson为例吧，因为我只用过Gson，对其最熟悉。^_^

使用Gson，我们需要导入Gson的包，下载地址[https://code.google.com/p/google-gson/downloads/list](https://code.google.com/p/google-gson/downloads/list)。

现在开始看看，怎么解析上面的三个json字符串例子。

第一个对象json1

首先我们需要一个实体类
```java
public class People{

public String name;

@SerializedName(age)
pubic int mAge;    //如果我们类中成员的名称和json对象中的键名不同，可以通过注解来设置名字

public int weight;
}
```

然后就可以解析了

```java
Gson gson = new Gson();
Poeple people = gson.fromJson(json1, People.class);
```
对于第二个json2，我们可以解析成int数组，也可以解析成Integer的List。
解析成数组：
```java
Gson gson = new Gson();
int[] ages = gson.fromJson(json2, int[].class);
```

解析成List：

```java
Gson gson = new Gson();
List<Integer> ages = gson.fromJson(json2, new TypeToken<List<Integer>>(){}.getType);
```

第三个同样可以解析成List或者数组，我们就直接解析成List.
```java
Gson gson = new Gson();
List<People> peoples = gson.fromJson(json3, new TypeToke<List<People>>(){}.getType);
```

从上面的代码看到，使用Gson解析的话就非常简单了。需要注意的是如果对应的键值和成员名称不同的话可以使用注解来标记。


##闲扯

上面就说清了主流的一些解析，可以看到使用Gson之后解析是十分简单，这可以为我们的开发节约很多的时间。同时呢android本身为我们提供的也挺够用的，并且3.0后增加的JsonReader操作更加流畅，和其他如Pull解析xml的方式有些类似。

本文中仅仅介绍了使用，还有一些api以及高级用法没有提到，毕竟一篇文章能描写的有限，请自行查看官方文档。

上面说的只是解析，其实还有json的生成，JSONObject,JSONArray,都可以直接生成json的，3.0也提供了JsonWriter来生成json。而Gson中，直接gson.toJson()，就可以生成json了，一切都是这么的美妙。不过我们平时，生成json使用比较少，我这里就不写了（或者单独写一篇生成）^_^。


参考资料地址：    

+   [http://developer.android.com/reference/org/json/JSONArray.html](http://developer.android.com/reference/org/json/JSONArray.html)

+   [http://developer.android.com/reference/org/json/JSONObject.html](http://developer.android.com/reference/org/json/JSONObject.html)

+   [http://developer.android.com/reference/android/util/JsonReader.html](http://developer.android.com/reference/android/util/JsonReader.html)

+   [https://code.google.com/p/google-gson/](https://code.google.com/p/google-gson/)


