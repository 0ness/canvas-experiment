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
        var win = window;
		var doc = document;
		var canvas = doc.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		var pages = new PageInfo();
		var lib = new Library();

		var $main = $(doc.getElementById("main"));
        var $ancherTag = (s_pageUA === "webkit") ? $("body"):$("html");

		var s_pageUA = pages.UA();            //ユーザーエージェント保持
		var s_pageID = pages.ID();		      //ページID
		var s_pageMobile = pages.mobile();    //モバイル判定
		var s_pageClass = pages.Category();

		var n_Loop = 28;
		var n_ObjLen = 60;
		var n_PI = Math.PI*2;
		var n_Angle = n_PI<<1;
		var n_DisLimit = 50;



		/*var 共通変数　このJS内部でグローバルに使う変数
		--------------------------------------------------------------------*/
		var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
		var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ

		var aryObj = [];

		
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
			this.lineLen = 10;
			this.bgAlpha = 1;
			this.composition = "source-over";

			//塗りの色
			var s_r = (Math.random()*200)>>0;
			var s_g = (Math.random()*200)>>0;
			var s_b = (Math.random()*200)>>0;
			this.fillColor = "rgba("+s_r+", "+s_g+", "+s_b+",1)";
			this.strokeColor = "rgb("+s_r+", "+s_g+", "+s_b+")";

			//背景色
			var max_01 = 135;
			var r = (Math.random()*max_01 + 120)>>0;
			var g = (Math.random()*max_01 + 120)>>0;
			var b = (Math.random()*max_01 + 120)>>0;
			var bgColor = "rgb("+r+", "+g+", "+b+")";
			this.bgColor = {r:r,g:g,b:b};
			this.bgColorObj = bgColor;

			//分岐フラグ
			this.flgStroke = true;
			this.flgFill = false;
			this.flgBG = false;

			doc.getElementById("contents").style.color = colorOnRGB(bgColor);

			//コンテンツ固有のパラメータ
			this.pointDeff = 14;
			this.pointLen = 500;
			this.pointFPS = 5;

			return false;
		}


		/* @object LinePoint
		 * 始点と終点の間でラインを屈折する座標
		*/
		function LinePoint(_x,_y,_flg){
			this.x = _x;
			this.y = _y;
			this.by = _y;
			this.posFlg = _flg;
			this.deff = param.pointDeff;
			this.init();
			return false;
		};
		LinePoint.prototype = {
			x:0,
			y:0,
			nx:0,
			ny:0,
			by:0,
			easing:0.4,
			size:1,
			deff:0,
			flg:true,

			init:function(){
				var half = this.deff >>1;
				this.ny = (((Math.random() * this.deff) >> 0) - half) + this.y;
				this.ny = ( this.posFlg === true ) ? this.ny + half : this.ny - half;
				this.deff = this.ny - this.y;
				return false;
			},
			draw:function(){

				//ランダム描画
//				var limit = param.pointDeff;
//				var deff = limit >>1;
//				var y = (((Math.random()*limit) >> 0) - deff) + this.y;
//				this.ny = (this.flg === true) ?

				//イージング描画
//				var deff = this.ny - this.y;
//				this.y += deff * param.pointFPS;

				//移動差の分割描画
				var deff = this.ny - this.y;
				this.y += deff / (param.pointFPS >> 0);

				ctx.lineTo(this.x,this.y);
//				ctx.arc(this.x,this.y,5,0,n_Angle,false);

				//目標座標の変更
				deff = abs(deff);
				if(deff >= 0.1) return false;


//				if(this.flg === true) this.ny += this.deff;
//				else this.ny -= this.deff;
//				this.flg = !this.flg;

				var limit = param.pointDeff >> 0;
				deff = limit >>1;

				//有機的な波
				this.posFlg = (this.posFlg === true) ? false : true;
				var ny = (((Math.random()*limit) >> 0) - deff) + this.by;
				this.ny = ( this.posFlg === true ) ? ny + deff : ny - deff;

				return false;
			}
		}


		/* @object LineContainer
		 * LinePointの一括管理、一括操作
		*/
		function LineContainer(_num,_y){
			this.number = _num;
			this.sy = this.ey = _y;
			this.init();
			return false;
		};
		LineContainer.prototype = {
			sx:0,
			sy:0,
			ex:0,
			ey:0,
			ary:[],
			number:0,

			init:function(){
				var that = this;
				var len = this.number;

//				var y = (len*1.5 + (len*len*0.3) + (n_ih >> 1))>>0;
//				var deff = n_ih / (n_ObjLen+1);
//				var y = deff * len >>0;
//				this.sy = y;
//				this.ey = this.sy;
				this.ex = n_iw;

				var i;
				var devide = this.ex / (len+1);

				//擬似スコープで個々の値を設定
				var ary = [];
				for (var i = 0; i < len; i++) {
					var dx = (devide * (i + 1)) >> 0;
					var flg = ( i % 2) ? true : false;
					var lp = new LinePoint(dx,that.sy,flg);
					ary[i] = lp;
				}
				this.ary = ary;

				return false;
			},
			draw:function(){

				ctx.beginPath();
				ctx.moveTo(this.sx,this.sy);

				var i;
				var ary = this.ary;
				var len = ary.length;

				for (i = 0; i < len; i++) ary[i].draw();
				ctx.lineTo(n_iw,this.ey);

				if(param.flgStroke === true) ctx.stroke();
				if(param.flgFill === true) ctx.fill();

				return false;
			}
		}


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


		/*object dat.GUI用オブジェクト
		--------------------------------------------------------------------*/
		var gui = new dat.GUI();
		var param = new ParamMaster();

		//ライン用パラメータ
		var paramLineLen =  gui.add(param, 'lineLen',1,50);
		gui.add(param, 'lineWidth',0,20);

		//ポイント用パラメータ
		var paramPointLen = gui.add(param, 'pointLen',1,800);
		gui.add(param, "pointDeff",0,50);
		gui.add(param, 'pointFPS',1,50);

		//context用パラメータ
		gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
		gui.add(param, 'flgStroke',false);
		gui.add(param, 'flgFill',false);
		gui.addColor(param, 'fillColor');
		gui.addColor(param, 'strokeColor');

		//背景用パラメータ
		gui.add(param, 'flgBG',false);
		gui.add(param, 'bgAlpha',0,1);

		//数値の変更処理
		paramLineLen.onChange(function(value){
			param.lineLen = value;
			objSet();
			return false;
		})
		paramPointLen.onChange(function(value){
			param.pointLen = value;
			objSet();
			return false;
		});

		//背景の変更処理
		var paramBGColor = gui.addColor(param, 'bgColor');
		paramBGColor.onChange(function(value) {
			var val = value;
			var bgColor = "rgb("+ (val.r>>0) +", "+ (val.g>>0) +", "+ (val.b>>0) +")";
			canvas.style.backgroundColor = bgColor;
			doc.getElementById("contents").style.color = colorOnRGB(val);
			return false;
		});


		/*contents 処理
		--------------------------------------------------------------------*/

		//process オブジェクト作成 → 配列に格納
		var objSet = function(){
			aryObj = [];
			n_ObjLen = param.lineLen >> 0;

			for(var i = 0; i < n_ObjLen; i++){
				var deff = n_ih / (n_ObjLen+1);
				var y = deff * (i + 1) >>0;
//				var len = i + 1;
				var obj = new LineContainer(param.pointLen,y);
				aryObj[i] = obj;
			};

			return false;
		};


		//process 描画
		var objDraw = function(){

			if(param.flgBG === true){
				ctx.globalAlpha = param.bgAlpha;
				var bgColor = "rgb("+ (param.bgColor.r>>0) +", "+ (param.bgColor.g>>0) +", "+ (param.bgColor.b>>0) +")";
				ctx.fillStyle = bgColor;
				ctx.beginPath();
				ctx.rect(0,0,n_iw,n_ih);
				ctx.closePath();
				ctx.fill();
				ctx.globalAlpha = 1;
			}else{
				ctx.clearRect(0,0,n_iw,n_ih);
			}

			//基本の描画
			if(param.flgFill === true) ctx.fillStyle = param.fillColor;
			ctx.globalCompositeOperation = param.composition;
			ctx.strokeStyle = param.strokeColor;
			ctx.lineWidth = param.lineWidth;

			for(var i=0; i<n_ObjLen; i++) aryObj[i].draw();

			return false;
		};


		//process ループ関数
		var loop = function(){
			stats.begin();

			objDraw();

			win.requestAnimationFrame(loop);
			stats.end();
			return false;
		};


		//process canvasアニメ開始
		var canvasInit = function(){
			doc.getElementById("contents").style.color = param.strokeColor;
			var value = param.bgColor;
			var bgColor = "rgb("+ value.r +", "+ value.g +", "+ value.b +")";
			canvas.style.background = bgColor;
			objSet();
			win.requestAnimationFrame(loop);
			return false;
		}();


		/*object リサイズ用オブジェクト
		--------------------------------------------------------------------*/
		var Resizer = function(){};
		Resizer.prototype = {
			winCheck:function(){
				n_iw = win.innerWidth || doc.body.clientWidth;
				n_ih = win.innerHeight || doc.body.clientHeight;
				return false;
			},
			canvasResize:function(){
				canvas.width = n_iw;
				canvas.height = n_ih;
				objSet();
				return false;
			}
		};
		var resizer = new Resizer();


		/*function リサイズ実行
		--------------------------------------------------------------------*/
		var resizeFunc = function(){
			resizer.winCheck();
			resizer.canvasResize();
			return false;
		};


		/*contents 処理分岐
		--------------------------------------------------------------------*/
		if(s_pageClass === "full"){
			resizeFunc();
			window.addEventListener("resize",resizeFunc);
		}

        return false;
	}



	$(window).on("load",init);
})
//SCRIPT END