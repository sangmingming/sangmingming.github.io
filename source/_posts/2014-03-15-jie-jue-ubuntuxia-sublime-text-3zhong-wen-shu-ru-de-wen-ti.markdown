---
layout: post
title: "解决Ubuntu下Sublime text 3中文输入的问题"
date: 2014-03-15 00:24:45 +0800
comments: true
tags: [linux,ubuntu]
---

好久之前便听朋友说起Sublime Text这款软件很好用，终于这几天有空折腾，把软件给装起来了。用起来确实很不错，写代码很爽。   
但是用了一段时间之后，我需要输入中文了，无论怎么切换输入法，都无法切换到中文。
网上搜索了一下，原来这是Bug。找解决方法吧。下面介绍我的解决方案，是大神cjacker解决成功的啦，我只是copy一下，方便大家在遇到这个问题的时候可以方便解决。
<!-- more -->

		我的系统：ubuntu 13.04  
		我的输入法：fcitx   
		sublime版本：3059    

理论上支持 `sublime text2/3`

1.保存代码sublime-imfix.c

	/*
	sublime-imfix.c
	Use LD_PRELOAD to interpose some function to fix sublime input method support for linux.
	By Cjacker Huang <jianzhong.huang at i-soft.com.cn>

	gcc -shared -o libsublime-imfix.so sublime_imfix.c  `pkg-config --libs --cflags gtk+-2.0` -fPIC
	LD_PRELOAD=./libsublime-imfix.so sublime_text
	*/
	#include <gtk/gtk.h>
	#include <gdk/gdkx.h>
	typedef GdkSegment GdkRegionBox;

	struct _GdkRegion
	{
  		long size;
  		long numRects;
  		GdkRegionBox *rects;
  		GdkRegionBox extents;
	};

	GtkIMContext *local_context;

	void
	gdk_region_get_clipbox (const GdkRegion *region,
            GdkRectangle    *rectangle)
	{	
  		g_return_if_fail (region != NULL);
  		g_return_if_fail (rectangle != NULL);

  		rectangle->x = region->extents.x1;
  		rectangle->y = region->extents.y1;
  		rectangle->width = region->extents.x2 - region->extents.x1;
  		rectangle->height = region->extents.y2 - region->extents.y1;
  		GdkRectangle rect;
  		rect.x = rectangle->x;
  		rect.y = rectangle->y;
  		rect.width = 0;
  		rect.height = rectangle->height; 
  		//The caret width is 2; 
  		//Maybe sometimes we will make a mistake, but for most of the time, it should be the caret.
  		if(rectangle->width == 2 && GTK_IS_IM_CONTEXT(local_context)) {
        	gtk_im_context_set_cursor_location(local_context, rectangle);
  		}
	}

	//this is needed, for example, if you input something in file dialog and return back the edit area
	//context will lost, so here we set it again.

	static GdkFilterReturn event_filter (GdkXEvent *xevent, GdkEvent *event, gpointer im_context)
	{
    	XEvent *xev = (XEvent *)xevent;
    	if(xev->type == KeyRelease && GTK_IS_IM_CONTEXT(im_context)) {
       		GdkWindow * win = g_object_get_data(G_OBJECT(im_context),"window");
       		if(GDK_IS_WINDOW(win))
         		gtk_im_context_set_client_window(im_context, win);
    	}
    	return GDK_FILTER_CONTINUE;
	}

	void gtk_im_context_set_client_window (GtkIMContext *context,
          GdkWindow    *window)
	{
  		GtkIMContextClass *klass;
  		g_return_if_fail (GTK_IS_IM_CONTEXT (context));
  		klass = GTK_IM_CONTEXT_GET_CLASS (context);
  		if (klass->set_client_window)
    	klass->set_client_window (context, window);

  		if(!GDK_IS_WINDOW (window))
    	return;
  		g_object_set_data(G_OBJECT(context),"window",window);
  		int width = gdk_window_get_width(window);
  		int height = gdk_window_get_height(window);
  		if(width != 0 && height !=0) {
    		gtk_im_context_focus_in(context);
    		local_context = context;
  		}
  		gdk_window_add_filter (window, event_filter, context); 
	}

2.安装C/C++的编译环境和gtk libgtk2.0-dev

	sudo	apt-get install build-essential
	sudo apt-get install libgtk2.0-dev

3.编译共享内存
	
	gcc -shared -o libsublime-imfix.so sublime_imfix.c  `pkg-config --libs --cflags gtk+-2.0` -fPIC

4.启动测试
	
	LD_PRELOAD = ./libsublime-imfix.so sublime_text

正常的话这样是没有问题的。

然后我们在修改我们的desktop文件，使图标也可以使用

	sudo vi /usr/share/applications/sublime-text.desktop

先将so文件移动到sublime text的目录

然后按照如下替换（主要是每次执行之前，去预加载我们的libsublime-imfix.so库）

	[Desktop Entry]
	Version=1.0
	Type=Application
	Name=Sublime Text
	GenericName=Text Editor
	Comment=Sophisticated text editor for code, markup and prose
	Exec=bash -c 'LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so /opt/sublime_text/sublime_text' %F
	Terminal=false
	MimeType=text/plain;
	Icon=sublime-text
	Categories=TextEditor;Development;
	StartupNotify=true
	Actions=Window;Document;

	[Desktop Action Window]
	Name=New Window
	Exec=bash -c 'LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so /opt/sublime_text/sublime_text' -n
	OnlyShowIn=Unity;

	[Desktop Action Document]
	Name=New File
	Exec=bash -c 'LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so /opt/sublime_text/sublime_text' --command new_file
	OnlyShowIn=Unity;