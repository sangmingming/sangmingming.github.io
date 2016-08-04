title: Android中个人推崇的数据库使用方式
comments: true
date: 2014-10-13 23:19:20
tags: ['android', 'sqlite']
---

手机应用开发中经常会使用到数据库存储一些资料或者进行数据缓存，android中为我们提供了一个轻量的数据库，在上层进行了一层封装，同时还为我们提供了ContentProvider的框架，方便我们进行数据操作，以及在不同的程序之间进行数据共享。本文介绍一下，我在使用数据库的一些我认为比较好的习惯，欢迎与我讨论。
<!--more-->

### 关于框架

通常网络操作，Json解析，我都会使用框架,这样可以很好的帮助我处理异常，处理异步操作。但是数据库操作我则使用自带的SQLiteHelper和ContentProvider，这样android系统在SQLite上为我们提供的一层封装。因此，我不再使用第三方的SQLite框架。SQLiteDatabase和ContentProvider为我们提供一下函数

```java
query()  //查询
insert()　//插入
delete()  //删除
update()  //更新
//参数和返回值我没有写
```

可以看到，android为我们提供的操作已经被封装了，很多地方和别的ORM框架也是有一些类似的。而且在android中我们通常不会存储非常复杂的数据结构，没必要给自己学习框架增加成本。

###　数据库建库升级等原则

先看一段代码 

```java
private final class DatabaseHelper extends SQLiteOpenHelper {
        public DatabaseHelper(final Context context) {
            super(context, DB_NAME, null, DB_VERSION);
        }
        
        /**
        * 1-->2 add header table
        * 2-->3 update info
        * 3--> update info haha
        *
        */
        public static final int DB_VERSION = 4;
        public static final String DB_NAME = "download";

        /**
         * Creates database the first time we try to open it.
         */
        @Override
        public void onCreate(final SQLiteDatabase db) {
            if (Constants.LOGVV) {
                Log.v(Constants.TAG, "populating new database");
            }
            onUpgrade(db, 0, DB_VERSION);
        }

        /**
         * Updates the database format when a content provider is used
         * with a database that was created with a different format.
         *
         * Note: to support downgrades, creating a table should always drop it first if it already
         * exists.
         */
        @Override
        public void onUpgrade(final SQLiteDatabase db, int oldV, final int newV) {

            for (int version = oldV + 1; version <= newV; version++) {
                upgradeTo(db, version);
            }
        }

        /**
         * Upgrade database from (version - 1) to version.
         */
        private void upgradeTo(SQLiteDatabase db, int version) {
            switch (version) {
                case 1:
                    createDownloadsTable(db);
                    break;
                case 2:
                    createHeadersTable(db);
                    break;
                case 3:
                    addColumn(db, DB_TABLE, Downloads.Impl.COLUMN_IS_PUBLIC_API,
                              "INTEGER NOT NULL DEFAULT 0");
                    addColumn(db, DB_TABLE, Downloads.Impl.COLUMN_ALLOW_ROAMING,
                              "INTEGER NOT NULL DEFAULT 0");
                    addColumn(db, DB_TABLE, Downloads.Impl.COLUMN_ALLOWED_NETWORK_TYPES,
                              "INTEGER NOT NULL DEFAULT 0");
                    break;
                case 103:
                    addColumn(db, DB_TABLE, Downloads.Impl.COLUMN_IS_VISIBLE_IN_DOWNLOADS_UI,
                              "INTEGER NOT NULL DEFAULT 1");
                    makeCacheDownloadsInvisible(db);
                    break;
                case 4:
                    addColumn(db, DB_TABLE, Downloads.Impl.COLUMN_BYPASS_RECOMMENDED_SIZE_LIMIT,
                            "INTEGER NOT NULL DEFAULT 0");
                    break;
                default:
                    throw new IllegalStateException("Don't know how to upgrade to " + version);
            }
        }
```

以上代码是摘自android 中的DownloadProvider的DatabaseHelper代码。我在这里主要是像推荐这种数据库的建表，最初接触这种建表方式是在以前阅读DownloadManager的时候发现，发现android中这种设计真的是非常精妙。这种方式，方便数据库的升级，在update数据库和create数据库的时候，可以共用建表，修改数据表的代码，同时可以清晰看到数据库的变化。

同时建议,在修改数据库版本的时候，在版本号上面增加注释，写上数据库升级的内容，方便自己以后看到数据库的变化，以及其他人在看代码时候，了解到数据库的变化。

### 数据库建表和数据存储建议

一些简单的配置文件，不建议存到数据库，存到sharepreference中，方便存取，同时也提高访问速度。

文件，图片等绝对不要存到数据库，存储文件路径到数据库中即可。

一些很复杂的数据，建议直接转成json存到数据库即可。一些缓存也可以这样存储。

### 其他要说的

数据库操作时候，不要在主线程操作。这是耗时操作，容易造成ANR.

在进行数据库中的数据显示时候，建议配合CursorLoader使用，这是android提供的异步数据加载，同时会在数据变化时候，自动重新刷新数据。

其他，本文，本人乱扯。如有你有异议，欢迎回复讨论。


>原文地址：[http://blog.isming.me/2014/10/13/good-database-use/](http://blog.isming.me/2014/10/13/good-database-use/)，转载请注明出处。