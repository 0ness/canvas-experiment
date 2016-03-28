/*==============================================================================

	サイト内部　機能・演出用

	・基本の状態を維持する必要は無く、プロジェクトによってカスタマイズする
	・機能実装→演出実装→最適化処理のフローで構築

==============================================================================*/




//SCRIPT START
$(function(){


	function init(){


		/*const 共通定数　このJS内部でグローバルに使う定数
		--------------------------------------------------------------------*/
		//DOMオブジェクト
        var win = window,
			doc = document,
			canvas = doc.getElementById("myCanvas"),
			ctx = canvas.getContext("2d");

		var pages = new PageInfo();

		var $main = $(doc.getElementById("main")),
			$ancherTag = (s_pageUA === "webkit") ? $("body"):$("html");

		var s_pageUA = pages.UA(),
			s_pageID = pages.ID(),
			s_pageMobile = pages.mobile(),
			s_pageClass = pages.Category();

		var n_Loop = 28,
			n_PI = Math.PI*2,
			n_Angle = n_PI<<1,
			n_DisLimit = 50;




		/*var 共通変数　このJS内部でグローバルに使う変数
		--------------------------------------------------------------------*/
		var n_iw = win.innerWidth || doc.body.clientWidth,
			n_ih = win.innerHeight || doc.body.clientHeight;

		//module RGBで対比させる色 黒/白
		var colorOnRGB = function(_rgb){
			var rgb = _rgb;
			var red = rgb.r;
			var green = rgb.g;
			var blue = rgb.b;
			var color = '#222';
			if ((red * 0.299 + green * 0.587 + blue * 0.114) < 186) color = param.strokeColor;
			return color;
		};

		//差の絶対値を算出
		var abs = function(_num){
			var a = _num;
			a = a>0?a:-a;
			return a;
		}
		
		

		
		/*function 拡張　requestAnimFrame()
		--------------------------------------------------------------------*/
		win.requestAnimFrame = (function(){
			return	win.requestAnimFrame ||
					win.webkitRequestAnimFrame ||
					win.mozRequestAnimFrame ||
					win.msRequestAnimFrame ||
					function(callback,element){
						win.setTimeout(callback,1000/60);
					};
		})();
		
		


		/*object Stats用オブジェクト
		--------------------------------------------------------------------*/
		var stats = new Stats();
		stats.setMode( 0 );
		document.body.appendChild( stats.domElement );
		stats.domElement.style.position = "fixed";
		stats.domElement.style.right = "0";
		stats.domElement.style.bottom = "5px";

		


		/*オブジェクト
		--------------------------------------------------------------------*/
		/* @object paramMaster
		 * 描画処理のパラメータを管理する
		*/
		function ParamMaster(){

			this.lineWidth = 1;
			this.lineLen = 50;
			this.lineDeff = 20;
			this.devideY = 20;
			this.slideY = 0;
			this.bgAlpha = 0.1;
			this.composition = "source-over";
			
			this.drawPattern = "slide";

			//塗りの色
			var s_r = (Math.random()*180 + 50)>>0;
			var s_g = (Math.random()*180 + 50)>>0;
			var s_b = (Math.random()*180 + 50)>>0;
			this.fillColor = "rgb("+s_r+", "+s_g+", "+s_b+")";
			this.strokeColor = "rgb("+s_r+", "+s_g+", "+s_b+")";

			//背景色
			var max_01 = 20;
			var r = (Math.random()*max_01)>>0;
			var g = (Math.random()*max_01)>>0;
			var b = (Math.random()*max_01)>>0;
			var bgColor = "rgb("+r+", "+g+", "+b+")";
			this.bgColor = {r:r,g:g,b:b};
			this.bgColorObj = bgColor;

			//分岐フラグ
			this.flgStroke = false;
			this.flgFill = true;
			this.flgBG = true;
			this.flgRndColor = false;

			doc.getElementById("contents").style.color = colorOnRGB(bgColor);

			//コンテンツ固有のパラメータ
			this.pointDeff = 14;
			this.pointLen = 500;
			this.pointFPS = 5;

			this.marginY = 50;
			this.paddingX = 0;
			this.paddingY = 0;
			
			return false;
		};

		
		/* object dat.GUI用オブジェクト */
		var gui = new dat.GUI(),
			param = new ParamMaster();

		//ライン用パラメータ
		var paramLineLen =  gui.add(param, 'lineLen',1,500),
			paramLineWidth = gui.add(param, 'lineWidth',0.1,50),
			paramLineDeff = gui.add(param, 'lineDeff',0,100),
			paramDevideY =  gui.add(param, 'devideY',1,100),
			paramSlideY = gui.add(param, 'slideY',0,10),
			paramMarginY = gui.add(param,'marginY',0,100),
			paramPaddingX = gui.add(param,'paddingX',0,500),
			paramPaddingY = gui.add(param,'paddingY',0,200);

		//ポイント用パラメータ
//		var paramPointLen = gui.add(param, 'pointLen',1,800);
//		gui.add(param, "pointDeff",0,50);
//		gui.add(param, 'pointFPS',1,50);

		//context用パラメータ
		gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
		gui.add(param,'drawPattern',["slide","random","foward"]);
		gui.add(param, 'flgStroke',false);
		gui.add(param, 'flgFill',false);
		gui.add(param, 'flgRndColor',false);
		gui.addColor(param, 'fillColor');
		gui.addColor(param, 'strokeColor');

		//背景用パラメータ
		gui.add(param, 'flgBG',false);
		gui.add(param, 'bgAlpha',0,1);

		//数値の変更処理
		paramLineLen.onChange(function(val){
			param.lineLen = val>>0;
			dict.init();
		});
		paramLineWidth.onChange(function(val){
			param.lineWidth = (val < 1)? val:val>>0;
			dict.init();
		});
		paramDevideY.onChange(function(val){
			param.devideY = val>>0;
			dict.init();
		});
		paramSlideY.onChange(function(val){
			param.slideY = val;
			dict.init();
		});
		paramMarginY.onChange(function(val){
			param.marginY = val>>0;
			dict.init();
		});
		paramPaddingX.onChange(function(val){
			param.paddingX = val>>0;
			dict.init();
		});
		paramPaddingY.onChange(function(val){
			param.paddingY = val>>0;
			dict.init();
		});

//		paramPointLen.onChange(function(value){
//			param.pointLen = value;
//			dict.init();
//			return false;
//		});

		//背景の変更処理
		var paramBGColor = gui.addColor(param, 'bgColor');
		paramBGColor.onChange(function(value) {
			var val = value;
			var bgColor = "rgb("+ (val.r>>0) +", "+ (val.g>>0) +", "+ (val.b>>0) +")";
			canvas.style.backgroundColor = bgColor;
//			doc.getElementById("contents").style.color = colorOnRGB(val);
		});


		/* @object Line
		 * 始点と終点の間でラインを屈折する座標
		 * @param{Number} x座標
		 * @param{Number} y座標
		 * @param{Number} width
		 * @param{Number} height
		*/
		function Line(_x,_y,_w,_h,_parent){
			this.x = _x;
			this.y = this.oy = _y;
			this.width = _w;
			this.height = _h;
			this.parent = _parent;
			this.sy = ((Math.random()*10)>>0) - 5;
//			this.deff = Math.random()*(param.lineDeff>>1);
//			this.init();
//			this.lineWidth = ((Math.random()*5)>>0) * param.lineWidth;
		};
		Line.prototype = {
			x:0,
			y:0,
			lx:0,
			ly:0,
			oy:0,
			sy:0,
			width:0,
			height:0,
			parent:null,
			easing:0.4,
			size:1,
			deff:0,
			flg:true,
			lineWidth:1,
			
			init:function(){
//				this.lx = this.parent.x;
			},
			
			draw:function(){
				var pattern = param.drawPattern,
					t = this;
				t.y = t.oy + t.sy * param.slideY;
				if(pattern === "slide") t.slide();
				else if(pattern === "random") t.random();
				else if(pattern === "foward") t.foward();
			},
			random:function(){
				var c = ctx,
					t = this,
					p = t.parent;
//				c.beginPath();
				c.fillRect(t.x,t.y,t.width,t.height);
//				c.closePath();
//				c.fill();

				//移動差の分割描画
				t.x = (Math.random()*p.w + p.x)>>0;
			},
			slide:function(){
				var c = ctx,
					t = this,
					p = t.parent,
					deff = param.lineDeff >> 0;
//				c.beginPath();
				c.fillRect(t.x,t.y,t.width,t.height);
//				c.closePath();
//				c.fill();

				//移動差の分割描画
				var deff = (Math.random()*deff - deff/2)>>0;
				var out = p.x+p.w;
				t.x += deff;
				if(p.x > t.x) t.x = p.x;
				else if(out < t.x) t.x = out;
			},
			foward:function(){
				var c = ctx,
					t = this,
					p = t.parent;
//				c.beginPath();
				c.fillRect(t.x,t.y,t.width,t.height);
//				c.closePath();
//				c.fill();

				//移動差の分割描画
				var out = p.x+p.w;
				t.x +=  Math.random()*(param.lineDeff>>1);
				if(out < t.x) t.x = p.x;
			}
		}


		/* @object lineRect
		 * Lineの一括管理、一括操作
		*/
		function LineRect(_x,_y,_w,_h,_color){
			this.x = _x;
			this.y = _y;
			this.width = _w;
			this.height = _h;
			this.color = _color || "#ffffff";
			this.init();
			return false;
		};
		LineRect.prototype = {
			x:0,
			y:0,
			width:0,
			height:0,
			lines:[],
			lineLen:null,
			color:null,

			init:function(){
				var t = this;
				t.lineLen = param.lineLen;
				t.lines = (function () {
					var ary = [],
						lineWidth = param.lineWidth;
					for (var i = 0; i < t.lineLen; i++) {
						var x = ((Math.random()*t.width)>>0) + t.x,
							y = t.y,
							nx = x,
							ny = (t.y + t.height)>>0,
							w = Math.random()*lineWidth,
							h = t.height,
							parent = {
								x:t.x,
								y:t.y,
								w:t.width,
								h:t.height
							},
							line = new Line(x,y,w,h,parent);
						ary[i] = line;
					}
					return ary;
				}());
			},
			draw:function(){
				var i = 0,
					ary = this.lines,
					len = ary.length,
					c = ctx;
				
				if(param.flgRndColor === true) c.fillStyle = this.color;
				else c.fillStyle = param.fillColor;
				
//				c.beginPath();
				for (i = 0; i < len; i++) ary[i].draw();
//				c.closePath();
//				c.fill();
				
//				if(param.flgStroke === true) ctx.stroke();
//				if(param.flgFill === true) c.fill();
			}
		};

		
		function LineDictionary(){
			this.init();
			return false;
		};
		LineDictionary.prototype = {
			ary:[],
			height:0,
			
			init:function(){
				
				this.ary = [];
				var ary = this.ary,
					n_ObjLen = param.devideY >> 0,
					paddingX = param.paddingX,
					paddingY = param.paddingY,
					ah = (n_ih - (paddingY<<1));

				for(var i = 0; i < n_ObjLen; i++){
					ary[i] = (function (n) {
						"use strict";
						
						//枠の初期値
						var w = n_iw - (paddingX<<1),
							h = (ah / n_ObjLen),
							x = paddingX,
							y = (n * h >>0) + paddingY;
						
						//marginがある場合、高さとY座標を調整
						var percentH = (n_ObjLen > 1) ? (100 - param.marginY) * 0.01 : 1,
							marginH = (n > 0) ? (h - (h*percentH)) : 0,
							marginHAll = (n > 0) ? (marginH*n_ObjLen): 0,
							marginY = (n > 0) ? (marginHAll / n_ObjLen)  :0;
						
						h = h * percentH;
						y = (y+marginY) >> 0;
						
						if(n !== 0){
							var my = marginH / (n_ObjLen);
							var my2 = ( marginH/2 )/ n_ObjLen;
							y = Math.round( y + (n-n_ObjLen)*my + my2);
						}

						//色情報
						var s_r = (Math.random()*180 + 50)>>0,
							s_g = (Math.random()*180 + 50)>>0,
							s_b = (Math.random()*180 + 50)>>0,
							color = "rgb("+s_r+", "+s_g+", "+s_b+")";						
						
						//インスタンス生成
						var rect = new LineRect(x,y,w,h,color);
						
						return rect;
					}(i));

				};
			}
		};

		var dict = new LineDictionary();




		/*contents 処理
		--------------------------------------------------------------------*/
		//process 描画
		var objDraw = function(){
			var ary = dict.ary,
				len = ary.length,
				p = param,
				c = ctx;
			
			c.globalCompositeOperation = p.composition;


			if(param.flgBG === true){
				c.globalAlpha = Math.round(p.bgAlpha * 100) / 100;
				var bg = p.bgColor;
				c.fillStyle = "rgb("+ (bg.r>>0) +", "+ (bg.g>>0) +", "+ (bg.b>>0)+")";
//				c.beginPath();
//				c.closePath();
				c.fillRect(0,0,n_iw,n_ih);
				c.globalAlpha = 1;
			}else{
				c.clearRect(0,0,n_iw,n_ih);
			}

			//基本の描画
			for(var i=0; i<len; i++) ary[i].draw();
		};


		//process ループ関数
		var loop = function(){
			stats.begin();

			objDraw();

			win.requestAnimationFrame(loop);
			stats.end();
		};


		//process canvasアニメ開始
		var canvasInit = function(){
			doc.getElementById("contents").style.color = param.strokeColor;
			var value = param.bgColor;
			var bgColor = "rgb("+ value.r +", "+ value.g +", "+ value.b +")";
			canvas.style.background = bgColor;
			win.requestAnimationFrame(loop);
		}();



		/*function リサイズ実行
		--------------------------------------------------------------------*/
		var resizeFunc = function(){
			n_iw = win.innerWidth || doc.body.clientWidth;
			n_ih = win.innerHeight || doc.body.clientHeight;
			canvas.width = n_iw;
			canvas.height = n_ih;
			dict.init();
		};


		window.addEventListener("resize",resizeFunc);
		resizeFunc()
	}



	init();
})
//SCRIPT END