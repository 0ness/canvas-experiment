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

		var s_r = (Math.random()*255)>>0;
		var s_g = (Math.random()*255)>>0;
		var s_b = (Math.random()*255)>>0;
		var s_dotColor = "rgba("+s_r+", "+s_g+", "+s_b+",0.9)";
//		var s_dotColor = "rgba(255,255,255, 0.9)";
		var s_ctxComposition = "xor";

		var n_Loop = 28;
		var n_ObjLen = 60;
//		var n_PI = 3.141592653589793;
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
		stats.domElement.style.right = "5px";
		stats.domElement.style.bottom = "5px";



		/*object Dotsオブジェクト
		--------------------------------------------------------------------*/
		function Dots(){

			this.dotLength = 80;
			this.dotDisLimit = 50;
			this.composition = "source-over";
			this.dotSpd = 1.2;
			this.dotStartSpd = 1.2;
			this.dotSize = 2;
			this.dotStrokeWidth = 1;
			this.flgAnim = true;

			var s_r = (Math.random()*255)>>0;
			var s_g = (Math.random()*255)>>0;
			var s_b = (Math.random()*255)>>0;
			this.fillColor = "rgba("+s_r+", "+s_g+", "+s_b+",0.9)";
			this.strokeColor = "rgba("+s_r+", "+s_g+", "+s_b+",0.9)";

			var max_01 = 200;
			var r = Math.floor(Math.random()*max_01);
			var g = Math.floor(Math.random()*max_01);
			var b = Math.floor(Math.random()*max_01);
			this.bgColor = "rgb("+r+", "+g+", "+b+")";

			this.clearAlpha = 1;

			return false;
		};

		var dots = new Dots();


		/*object dat.GUI用オブジェクト
		--------------------------------------------------------------------*/
		var gui = new dat.GUI();

		var DatParam = function() {};
		var param = new DatParam();
		gui.remember(dots);
		gui.add(dots, 'dotLength',10,300);
		gui.add(dots, 'dotDisLimit',2,500);
		gui.add(dots, 'dotSpd',0.2,10);
		gui.add(dots, 'dotSize',1,8);
		gui.add(dots, 'dotStrokeWidth',0,20);
		gui.add(dots,'composition',["xor","lighter","multiply","difference","source-over"]);
		gui.addColor(dots, 'fillColor');
		gui.addColor(dots, 'strokeColor');
		gui.add(dots, 'flgAnim');
		gui.add(dots, 'clearAlpha',0,1);

		var bgChange = gui.addColor(dots, 'bgColor');
		bgChange.onChange(function(value) {
			canvas.style.backgroundColor = value;
		});


		/*contents 処理
		--------------------------------------------------------------------*/

		//module 二点間の距離計算
		var pointDisCheck  = function(_p1,_p2){

			var p1 = _p1;
			var p2 = _p2;

			var a = 0;
			var b = 0;
			var d = 0;

			a = p1.x - p2.x;
			b = p1.y - p2.y;
			d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

			return d;
		};

		//object Pointオブジェクト
		var Point = function(){
			this.x = 0;
			this.y = 0;
			this.nX = 0;
			this.nY = 0;
			return false;
		}

		//process オブジェクト作成 → 配列に格納
		var objSet = function(){

			aryObj = [];
			n_ObjLen = dots.dotLength>>0;

			for(var i=0; i<n_ObjLen; i++){

				var p = new Point();
				var spd = dots.dotStartSpd;
				var spdHarf = spd/2;

				p.x = (Math.random()*n_iw)>>0;
				p.y = (Math.random()*n_ih)>>0;
				p.nX = (Math.random()*spd)-spdHarf;
				p.nY = (Math.random()*spd)-spdHarf;
				aryObj[i] = p;
			}

			return false;
		};

		//process 描画
		var objDraw = function(){

			stats.begin();

			var len = dots.dotLength>>0;
			if(n_ObjLen !== len) objSet();


			//基本の描画
//			var col = dots.fillColor;
			ctx.globalCompositeOperation = dots.composition;
			ctx.fillStyle = dots.fillColor;
			ctx.strokeStyle = dots.strokeColor;
			ctx.lineWidth = dots.dotStrokeWidth;

			for(var i=0; i<n_ObjLen; i++){

				var o = aryObj[i];
				var x = o.x;
				var y = o.y;

				var limit = dots.dotDisLimit;
				var disLarge = limit;
				var size = 1;

				//他のポイントとの距離確認
				for(var j=0; j<n_ObjLen; j++){
					if(j !== i){
						var o2 = aryObj[j];
						var dis = pointDisCheck(o,o2);

						if(disLarge > dis) disLarge = dis;

						if(disLarge < limit) {
							size = limit-disLarge;
							size = size*dots.dotSize;
						}
					}
				}

				ctx.beginPath();
				ctx.arc(x,y,size,0,n_Angle,false);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();

				x += o.nX*dots.dotSpd;
				y += o.nY*dots.dotSpd;


				if(x < 0) x = n_iw;
				else if(x > n_iw) x = 0;

				if(y < 0) y = n_ih;
				else if(y > n_ih) y = 0;

				o.x = x;
				o.y = y;
			}

			stats.end();

			return false;
		};



		var objDraw_02 = function(){

			var len = dots.dotLength>>0;
			if(n_ObjLen !== len) objSet();


			//基本の描画
			ctx.fillStyle = dots.fillColor;
			ctx.globalCompositeOperation = dots.composition;
			ctx.strokeStyle = dots.strokeColor;
			ctx.lineWidth = dots.dotLineWidth;

			var limit = dots.dotDisLimit<<1;
			var size = 0;

			for(var i=0; i<n_ObjLen; i++){

				var o = aryObj[i];
				var x = o.x;
				var y = o.y;
				var dis = limit;
				var dis_02 = limit;

				ctx.globalAlpha = dots.fillAlpha;
				ctx.beginPath();
				ctx.moveTo(o.x,o.y);

				//他のポイントとの距離確認
				for(var j=0; j<n_ObjLen; j++){
					if(j !== i){
						var o2 = aryObj[j];
						dis = pointDisCheck(o,o2);
						if(dis < limit) {
							ctx.lineTo(o2.x,o2.y);
						}
					}
				}
				ctx.closePath;
//				if(dots.flgLine === true) ctx.stroke();
				ctx.stroke();
				ctx.fill();

				ctx.globalAlpha = 1;

				ctx.beginPath();
				ctx.arc(x,y,dots.dotSize,0,n_Angle,false);
				ctx.closePath;
				ctx.fill();


				x += o.nX*dots.dotSpd;
				y += o.nY*dots.dotSpd;

				if(x < 0) x = n_iw;
				else if(x > n_iw) x = 0;

				if(y < 0) y = n_ih;
				else if(y > n_ih) y = 0;

				o.x = x;
				o.y = y;
			}


			return false;
		};


		//process ループ関数
		var loop = function(){
			stats.begin();

			ctx.globalAlpha = dots.clearAlpha;
			ctx.fillStyle = dots.bgColor;

			ctx.beginPath();
			ctx.rect(0,0,n_iw,n_ih);
			ctx.closePath();
			ctx.fill();

			//ctx.clearRect(0,0,n_iw,n_ih);

			if(dots.flgAnim === true) objDraw();
			else objDraw_02();
			win.requestAnimationFrame(loop);

			stats.end();
			return false;
		};


		//process canvasアニメ開始
		var canvasInit = function(){

			canvas.style.backgroundColor = dots.bgColor;

			objSet();
			setTimeout(loop,n_Loop);
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