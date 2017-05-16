(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root['Mobile'] = factory();
    }
}(this, function() {
	var _isShow = false;
	var $tag, $aboutme, $friends;
	//构造函数
	function Mobile(opts){
		//构造函数需要的参数
		this.ctn = opts.ctn;
		//构造四步
		this.init();
		this.renderDOM();
		this.combine();
		this.bindDOM();
	}

	//第一步 -- 初始化
	Mobile.prototype.init = function() {
		//设定窗口比率
		this.radio = document.body.scrollHeight/document.body.scrollWidth;
		//设定一页的宽度
		this.scaleW = document.body.scrollWidth;
		//设定初始的索引值
		this.idx = 0;
	};
	//第一步 -- 组合
	Mobile.prototype.combine = function(){
		if($tag){
			document.getElementById("js-mobile-tagcloud").innerHTML = $tag.innerHTML;
		}
		if($aboutme){
			document.getElementById("js-mobile-aboutme").innerHTML = $aboutme.innerHTML;
		}
		if($friends){
			document.getElementById("js-mobile-friends").innerHTML = $friends.innerHTML;
		}
	}
	//第三步 -- 根据数据渲染DOM
	Mobile.prototype.renderDOM = function(){
		//生成节点
		var $viewer = document.createElement("div");
		$viewer.id = "viewer";
		$viewer.className = "hide";
		$tag = document.getElementById("js-tagcloud");
		$aboutme = document.getElementById("js-aboutme");
		$friends = document.getElementById("js-friends");
		var tagStr = '<div class="viewer-title"><a href="/">主页</a></div>';
    var allStr = '<div class="viewer-title"><a href="/archives">所有文章</a></div>';
		var friendsStr =  '<div class="viewer-title"><a href="/links">朋友</a></div>';
		var aboutmeStr =  '<div class="viewer-title"><a href="/about">关于</a></div>';

		$viewer.innerHTML = '<div id="viewer-box">\
		<div class="viewer-box-l">\
			<div class="viewer-box-wrap">'+tagStr+allStr+friendsStr+aboutmeStr+'</div>\
		</div>\
		<div class="viewer-box-r"></div>\
		</div>';

		//主要图片节点
		document.getElementsByTagName("body")[0].appendChild($viewer);
		var wrap = document.getElementById("viewer-box");
		this.wrap = wrap;
		wrap.style.height = document.body.scrollHeight + 'px';
	};

	Mobile.prototype.show = function(target, idx){
		var self = this;
		document.getElementById("viewer").className = "";
		setTimeout(function(){
			self.wrap.className = "anm-swipe";
		},0);
		_isShow = true;
		document.ontouchstart=function(e){
			if(e.target.tagName != "A"){
				return false;
			}
		}
	}

	Mobile.prototype.hide = function(){
		var self = this;
		document.getElementById("viewer-box").className = "";
		_isShow = false;
		document.ontouchstart=function(){
			return true;
		}
	}

	//第四步 -- 绑定 DOM 事件
	Mobile.prototype.bindDOM = function(){
		var self = this;
		var scaleW = self.scaleW;

		//滑动隐藏
		document.getElementById("viewer-box").addEventListener("webkitTransitionEnd", function(){

			if(_isShow == false){
				document.getElementById("viewer").className = "hide";
				_isShow = true;
			}else{
				//console.log(self.idx);
			}

		}, false);

		//点击展示和隐藏
		self.ctn.addEventListener("touchend", function(){
			self.show();
		}, false);

		var $right = document.getElementsByClassName("viewer-box-r")[0];
		var touchStartTime;
		var touchEndTime;
		$right.addEventListener("touchstart", function(){
			touchStartTime = + new Date();
		}, false);
		$right.addEventListener("touchend", function(){
			touchEndTime = + new Date();
			if(touchEndTime - touchStartTime < 300){
				self.hide();
			}
			touchStartTime = 0;
			touchEndTime = 0;
		}, false);

		//滚动样式
		var $overlay = $("#mobile-nav .overlay");
		var $header = $(".js-mobile-header");
		window.onscroll = function(){
		    var scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
		    if(scrollTop >= 69){
		    	$overlay.addClass("fixed");
		    }else{
		    	$overlay.removeClass("fixed");
		    }
		    if(scrollTop >= 160){
		    	$header.removeClass("hide").addClass("fixed");
		    }else{
		    	$header.addClass("hide").removeClass("fixed");
		    }
		};
		$header[0].addEventListener("touchstart", function(){
			$('html, body').animate({scrollTop:0}, 'slow');
		}, false);
	};

	return Mobile;
}))
