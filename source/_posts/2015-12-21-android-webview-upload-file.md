title: Android WebView 上传文件支持全解析
comments: true
date: 2015-12-21 20:02:30
tags: [android]
---

默认情况下情况下，使用Android的WebView是不能够支持上传文件的。而这个，也是在我们的前端工程师告知之后才了解的。因为Android的每个版本WebView的实现有差异，因此需要对不同版本去适配。花了一点时间，参考别人的代码，这个问题已经解决，这里把我踩过的坑分享出来。

主要思路是重写WebChromeClient，然后在WebViewActivity中接收选择到的文件Uri，传给页面去上传就可以了。

<!--more-->

### 创建一个WebViewActivity的内部类

```java
public class XHSWebChromeClient extends WebChromeClient {

    // For Android 3.0+
    public void openFileChooser(ValueCallback<Uri> uploadMsg) {
        CLog.i("UPFILE", "in openFile Uri Callback");
        if (mUploadMessage != null) {
            mUploadMessage.onReceiveValue(null);
        }
        mUploadMessage = uploadMsg;
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");
        startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_RESULTCODE);
    }

    // For Android 3.0+
    public void openFileChooser(ValueCallback uploadMsg, String acceptType) {
        CLog.i("UPFILE", "in openFile Uri Callback has accept Type" + acceptType);
        if (mUploadMessage != null) {
            mUploadMessage.onReceiveValue(null);
        }
        mUploadMessage = uploadMsg;
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        String type = TextUtils.isEmpty(acceptType) ? "*/*" : acceptType;
        i.setType(type);
        startActivityForResult(Intent.createChooser(i, "File Chooser"),
                FILECHOOSER_RESULTCODE);
    }

    // For Android 4.1
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
        CLog.i("UPFILE", "in openFile Uri Callback has accept Type" + acceptType + "has capture" + capture);
        if (mUploadMessage != null) {
            mUploadMessage.onReceiveValue(null);
        }
        mUploadMessage = uploadMsg;
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        String type = TextUtils.isEmpty(acceptType) ? "*/*" : acceptType;
        i.setType(type);
        startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_RESULTCODE);
    }


//Android 5.0+
    @Override
    @SuppressLint("NewApi")
    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
        if (mUploadMessage != null) {
            mUploadMessage.onReceiveValue(null);
        }
        CLog.i("UPFILE", "file chooser params：" + fileChooserParams.toString());
        mUploadMessage = filePathCallback;
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        if (fileChooserParams != null && fileChooserParams.getAcceptTypes() != null
                && fileChooserParams.getAcceptTypes().length > 0) {
            i.setType(fileChooserParams.getAcceptTypes()[0]);
        } else {
            i.setType("*/*");
        }
        startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_RESULTCODE);
        return true;
    }
}
```


上面openFileChooser是系统未暴露的接口，因此不需要加Override的注解，同时不同版本有不同的参数，其中的参数，第一个ValueCallback用于我们在选择完文件后，接收文件回调到网页内处理，acceptType为接受的文件mime type。在Android 5.0之后，系统提供了onShowFileChooser来让我们实现选择文件的方法，仍然有ValueCallback，在FileChooserParams参数中，同样包括acceptType。我们可以根据acceptType，来打开系统的或者我们自己创建文件选择器。当然如果需要打开相机拍照，也可以自己去使用打开相机拍照的Intent去打开即可。

### 处理选择的文件

以上是打开响应的选择文件的界面，我们还需要处理接收到文件之后，传给网页来响应。因为我们前面是使用startActivityForResult来打开的选择页面，我们会在onActivityResult中接收到选择的结果。Show code：

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == FILECHOOSER_RESULTCODE) {
        if (null == mUploadMessage) return;
        Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
        if (result == null) {
            mUploadMessage.onReceiveValue(null);
            mUploadMessage = null;
            return;
        }
        CLog.i("UPFILE", "onActivityResult" + result.toString());
        String path =  FileUtils.getPath(this, result);
        if (TextUtils.isEmpty(path)) {
            mUploadMessage.onReceiveValue(null);
            mUploadMessage = null;
            return;
        }
        Uri uri = Uri.fromFile(new File(path));
        CLog.i("UPFILE", "onActivityResult after parser uri:" + uri.toString());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mUploadMessage.onReceiveValue(new Uri[]{uri});
        } else {
            mUploadMessage.onReceiveValue(uri);
        }

        mUploadMessage = null;
    }
}
```

以上代码主要就是调用ValueCallback的onReceiveValue方法，将结果传回web。

### 注意，其他要说的，重要

由于不同版本的差别，Android 5.0以下的版本，ValueCallback 的onReceiveValue接收的参数类型是Uri, 5.0及以上版本接收的是Uri数组，在传值的时候需要注意。

选择文件会使用系统提供的组件或者其他支持的app，返回的uri有的直接是文件的url，有的是contentprovider的uri，因此我们需要统一处理一下，转成文件的uri，可参考以下代码（获取文件的路径）。

调用getPath可以将Uri转成真实文件的Path，然后可以自己生成文件的Uri

```java
public class FileUtils {
    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is ExternalStorageProvider.
     */
    public static boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is DownloadsProvider.
     */
    public static boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is MediaProvider.
     */
    public static boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }

    /**
     * Get the value of the data column for this Uri. This is useful for
     * MediaStore Uris, and other file-based ContentProviders.
     *
     * @param context The context.
     * @param uri The Uri to query.
     * @param selection (Optional) Filter used in the query.
     * @param selectionArgs (Optional) Selection arguments used in the query.
     * @return The value of the _data column, which is typically a file path.
     */
    public static String getDataColumn(Context context, Uri uri, String selection,
                                       String[] selectionArgs) {

        Cursor cursor = null;
        final String column = "_data";
        final String[] projection = {
                column
        };

        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs,
                    null);
            if (cursor != null && cursor.moveToFirst()) {
                final int column_index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(column_index);
            }
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return null;
    }

    /**
     * Get a file path from a Uri. This will get the the path for Storage Access
     * Framework Documents, as well as the _data field for the MediaStore and
     * other file-based ContentProviders.
     *
     * @param context The context.
     * @param uri The Uri to query.
     * @author paulburke
     */
    @SuppressLint("NewApi")
    public static String getPath(final Context context, final Uri uri) {

        final boolean isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;

        // DocumentProvider
        if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
            // ExternalStorageProvider
            if (isExternalStorageDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                if ("primary".equalsIgnoreCase(type)) {
                    return Environment.getExternalStorageDirectory() + "/" + split[1];
                }

                // TODO handle non-primary volumes
            }
            // DownloadsProvider
            else if (isDownloadsDocument(uri)) {

                final String id = DocumentsContract.getDocumentId(uri);
                final Uri contentUri = ContentUris.withAppendedId(
                        Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));

                return getDataColumn(context, contentUri, null, null);
            }
            // MediaProvider
            else if (isMediaDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                Uri contentUri = null;
                if ("image".equals(type)) {
                    contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video".equals(type)) {
                    contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio".equals(type)) {
                    contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }

                final String selection = "_id=?";
                final String[] selectionArgs = new String[] {
                        split[1]
                };

                return getDataColumn(context, contentUri, selection, selectionArgs);
            }
        }
        // MediaStore (and general)
        else if ("content".equalsIgnoreCase(uri.getScheme())) {
            return getDataColumn(context, uri, null, null);
        }
        // File
        else if ("file".equalsIgnoreCase(uri.getScheme())) {
            return uri.getPath();
        }

        return null;
    }

}
```

再有，即使获取的结果为null，也要传给web，即直接调用`mUploadMessage.onReceiveValue(null)`,否则网页会阻塞。

最后，在打release包的时候，因为我们会混淆，要特别设置不要混淆WebChromeClient子类里面的openFileChooser方法，由于不是继承的方法，所以默认会被混淆，然后就无法选择文件了。

就这样吧。


>原文地址：[http://blog.isming.me/2015/12/21/android-webview-upload-file/](http://blog.isming.me/2015/12/21/android-webview-upload-file/)，转载请注明出处。
