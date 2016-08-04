title: 创建Material Design风格的Android应用--创建列表和卡片
comments: true
date: 2014-10-21 23:07:47
tags: ["android", "material design"]
---


上次说过使用主题，应用Material Design的样式，同时卡片布局也是Material Design的重要组成部分，今天来写写。


### 引言
在程序中创建复杂的Material Design 样式的 List和Card,可以使用RecyclerView和CardView组件,这两个组件是在最新的support v7包(version 21)中提供的。因此需要引入依赖包：

```java
dependencies {
    compile 'com.android.support:appcompat-v7:+'
    compile 'com.android.support:cardview-v7:+'
    compile 'com.android.support:recyclerview-v7:+'
}
```
<!--more-->
### 创建List

RecylerView组件是一个更加高效灵活的ListView。这个组件时一个显示大数据集的容器，可以有效的滚动，保持显示一定数量的视图。使用RecyclerView组件，当你有数据集，并且数据集的元素在运行时根据用户的操作或者网络事件改变。

RecylerView类简化大数据集的显示和处理，通过提供：
布局管理者控制元素定位。
在通用的元素上操作上显示默认的动画，比如移除和增加元素。

使用RecyclerView组件，你需要指定一个Adapter和布局管理器，创建一个Adapter继承RecyclerView.Adapter类，具体的实现细节要根据数据集合视图的类型变化，具体信息，看下面的例子。

一个布局管理器定位Item视图在RecyclerView中，决定什么时候去回收它当他不再可见时。当重用（或者回收）一个视图时，布局管理器可能会请求适配器（Adapter）去替换子视图中的内容用不同的内容。通过这种方式回收重用视图，可以减少view的创建和避免更多的*findViewById()*，从而提高性能。

RecyclerView提供了以下内建的布局管理器：

>LinearLayoutManager 显示Item 在一个水平或者垂直的滚动列表中。
>GridLayoutManager 显示Item 作为网格布局。
>StaggeredGridLayoutManager 显示Item在交错的网格布局。

也可以自己通过继承*RecyclerView.LayoutManager*类创建自定义的布局管理器。

![RecylerView组件](http://isming.qiniudn.com/RecyclerView.png)

RecylerView组件

##### 动画：
RecyclerView默认情况下就有动画，在删除或者增加Ite的时候。如果需要自定义动画，继承RecyclerView.ItemAnimator类，并且使用RecyclerView.setItemAnimator()方法将定义的动画设置到我们的视图中。

下面开始看例子：
1.首先在xml布局文件增加一个RecyclerView
```xml
<!-- A RecyclerView with some commonly used attributes -->
<android.support.v7.widget.RecyclerView
    android:id="@+id/my_recycler_view"
    android:scrollbars="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

2.然后在我们的Java代码中使用，附加Adapter和数据就可以显示了。

```java
public class MyActivity extends Activity {
    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.my_activity);
        mRecyclerView = (RecyclerView) findViewById(R.id.my_recycler_view);

        // use this setting to improve performance if you know that changes
        // in content do not change the layout size of the RecyclerView
        mRecyclerView.setHasFixedSize(true);

        // use a linear layout manager
        mLayoutManager = new LinearLayoutManager(this);
        mRecyclerView.setLayoutManager(mLayoutManager);

        // specify an adapter (see also next example)
        mAdapter = new MyAdapter(myDataset);
        mRecyclerView.setAdapter(mAdapter);
    }
    ...
}
```


3.Adapter提供访问数据集中的Item，创建视图映射到数据上，并且替换布局的内容数据用新的item。下面的代码显示一个简单的实现，使用TextView显示简单的String数组。
```java
public class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {
    private String[] mDataset;

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder
    public static class ViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        public TextView mTextView;
        public ViewHolder(TextView v) {
            super(v);
            mTextView = v;
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public MyAdapter(String[] myDataset) {
        mDataset = myDataset;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public MyAdapter.ViewHolder onCreateViewHolder(ViewGroup parent,
                                                   int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext())
                               .inflate(R.layout.my_text_view, parent, false);
        // set the view's size, margins, paddings and layout parameters
        ...
        ViewHolder vh = new ViewHolder(v);
        return vh;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        holder.mTextView.setText(mDataset[position]);

    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return mDataset.length;
    }
}
```

### 创建Card

*CardView*继承*FrameLayout*类，通过它可以显示信息在卡片内部，并且在不同的平台上有统一的样式。CardView组件可以有阴影和圆角。

创建有阴影的Card,使用*card_view:cardElevation*属性。CardView 使用真实的高度和动态阴影在Android5.0(API 21)和更高版本，较早的版本则使用传统的阴影。

使用这些属性去定制CardView的外观：

>使用*card_view:cardCornerRadius*属性设置圆角的半径，在布局文件中。
>使用*CardView.setRadius*方法设置圆角的半径在java代码中。
>设置卡片的背景颜色，使用*card_view:cardBackgroundColor*属性。

下面是一个在xml布局文件中包含一个CardView的示例：
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:card_view="http://schemas.android.com/apk/res-auto"
    ... >
    <!-- A CardView that contains a TextView -->
    <android.support.v7.widget.CardView
        xmlns:card_view="http://schemas.android.com/apk/res-auto"
        android:id="@+id/card_view"
        android:layout_gravity="center"
        android:layout_width="200dp"
        android:layout_height="200dp"
        card_view:cardCornerRadius="4dp">

        <TextView
            android:id="@+id/info_text"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />
    </android.support.v7.widget.CardView>
</LinearLayout>
```

![Card示例图](http://isming.qiniudn.com/card_travel.png)

Card示例图

### 乱弹

通过上面可以看到RecyclerView。跟我们经常使用的ListView很像，不过它的父类并不是AbsListView,因此不能混着使用。但是在很多地方可以替换ListView,通过ViewHolder,View重用，可以看到这是一个更加高效的视图组件，推荐使用。

CardView,本质上就是一个比较符合Material Design的组件，使用Card布局，效果更好。很多人之前可能也使用一些CardUi,谷歌官方出了这个，强烈推荐使用。

上面RecyclerView和CardView,是分开写的，但是我们可以用在一起的哦，不要糊涂了呀。

参考资料：[http://developer.android.com/training/material/lists-cards.html](http://developer.android.com/training/material/lists-cards.html)


>原文地址：[http://blog.isming.me/2014/10/21/creating-app-with-material-design-two-list/](http://blog.isming.me/2014/10/21/creating-app-with-material-design-two-list/)，转载请注明出处。