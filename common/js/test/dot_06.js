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
		var lib = new Library_Anim();

		var $main = $(doc.getElementById("main"));
        var $ancherTag = (s_pageUA === "webkit") ? $("body"):$("html");

		var s_pageUA = pages.UA();            //ユーザーエージェント保持
		var s_pageID = pages.ID();		      //ページID
		var s_pageMobile = pages.mobile();    //モバイル判定
		var s_pageClass = pages.Category();

		var s_r = (Math.random()*255)>>0;
		var s_g = (Math.random()*255)>>0;
		var s_b = (Math.random()*255)>>0;
		var s_dotColor = "rgb("+s_r+", "+s_g+", "+s_b+",1)";
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

		//座標
		var mousePoint = {x:0,y:0};


		/*function 拡張　requestAnimFrame()
		--------------------------------------------------------------------*/
		lib.requestAnimFrame();



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

			this.dotLength =45;
			this.dotDisLimit = 180;
			this.composition = "source-over";
			this.dotSpd = 1;
			this.dotStartSpd = 5;
			this.dotSize =6;
			//this.dotFieldSize = 1;
			this.dotLineWidth = 4;
			this.clearAlpha = 1;
			this.fillAlpha = 1;

			var r = Math.floor(Math.random()*140);
			var g = Math.floor(Math.random()*140);
			var b = Math.floor(Math.random()*140);
			this.fillColor = "rgb("+r+", "+g+", "+b+")";

			r = Math.floor(Math.random()*255);
			g = Math.floor(Math.random()*255);
			b = Math.floor(Math.random()*255);
			this.fillHitColor = "rgb("+r+", "+g+", "+b+")";

			r = Math.floor(Math.random()*255);
			g = Math.floor(Math.random()*255);
			b = Math.floor(Math.random()*255);
			this.strokeColor = "rgb("+r+", "+g+", "+b+")";

			r = Math.floor(Math.random()*150);
			g = Math.floor(Math.random()*150)+20;
			b = Math.floor(Math.random()*150)+20;
			this.bgColor = "rgb("+r+", "+g+", "+b+")";

			this.fillShadowColor = "rgba(0,0,0,0.1)";

			doc.getElementById("txt").style.color = this.strokeColor;

			this.flgFade = false;
			this.flgAutoSpd = false;

			this.difference = 1;

			return false;
		};

		var dots = new Dots();


		/*object object Dotsオブジェクト
		--------------------------------------------------------------------*/
		var Point = function(){
			this.x = 0;
			this.y = 0;
			this.nX = 0;
			this.nY = 0;
			this.nextObj = null;
			this.flgHitted = false;
			return false;
		}


		/*object dat.GUI用オブジェクト
		--------------------------------------------------------------------*/
		var gui = new dat.GUI();

		var DatParam = function() {};
		var param = new DatParam();
		gui.remember(dots);
		gui.add(dots, 'dotLength',10,300);
		gui.add(dots, 'dotDisLimit',10,600);
		gui.add(dots, 'dotSpd',0,8).listen();
		gui.add(dots, 'dotSize',0,20);
		gui.add(dots, 'dotLineWidth',0,20);
		gui.add(dots, 'fillAlpha',0,1);
		gui.add(dots, 'clearAlpha',0,1);
//		gui.add(dots, 'dotFieldSize',1,10);
		gui.add(dots, "flgFade");
		gui.add(dots, "flgAutoSpd");
		gui.add(dots,'composition',["xor","lighter","multiply","difference","source-over"]);
		gui.addColor(dots, 'fillColor');
		gui.addColor(dots, 'fillHitColor');
		gui.addColor(dots, 'fillShadowColor');
		gui.addColor(dots, 'strokeColor');
//		gui.add(dots, 'fieldAlpha',0,0.4).listen();

		var bgChange = gui.addColor(dots, 'bgColor');
		bgChange.onChange(function(value) {
			canvas.style.backgroundColor = value;
		});

		var plus = 0.05;
		var flg = true;
		var detune = 0.02;
		var parmUpdate = function() {
			if(dots.flgAutoSpd === false ) return false;

			if(flg === true) dots.dotSpd += (8 - dots.dotSpd ) * detune;
			else dots.dotSpd += (0 - dots.dotSpd ) * detune;

			if(dots.dotSpd > 7.8) flg = false;
			else if(dots.dotSpd <= 0.2) flg =true;

		};


		/*module オブジェクト作成 → 配列に格納
		--------------------------------------------------------------------*/
		var objSet = function(){

			aryObj = [];
			n_ObjLen = dots.dotLength>>0;

			for(var i=0; i<n_ObjLen; i++){

				var p = new Point();
				var spd = dots.dotStartSpd;
				var spdHarf = spd/2;

				var rand = (Math.random()*4>>0)%2;
				var flg = (rand === 0)? true : false;

				if(flg === true) {
					p.x = (Math.random()*n_iw)>>0;
					p.y = (Math.random()*n_ih)>>0;
					p.nX = (Math.random()*spd)-spdHarf;
				}else{
					p.x = (Math.random()*n_iw)>>0;
					p.y = (Math.random()*n_ih)>>0;
					p.nY = (Math.random()*spd)-spdHarf;
				}
				aryObj[i] = p;
			}

			for(var n=0; n<n_ObjLen; n++){
				if(n = n_ObjLen-1) return false;
				var p = aryObj[n];
				p.nextObj = aryObj[n+1];
			}


			return false;
		};


		/*module 二点間の距離計算
		--------------------------------------------------------------------*/
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


		/*module 差の絶対値の計算
		--------------------------------------------------------------------*/
		var absoluteValue = function(_num){
			var _n = _num;
			var n = _n < 0 ? -_n : _n;
			return n;
		}


		/*process 描画
		--------------------------------------------------------------------*/
		var objDraw = function(){

			var len = dots.dotLength>>0;
			if(n_ObjLen !== len) objSet();

			//基本の描画
			ctx.globalCompositeOperation = dots.composition;
			ctx.strokeStyle = dots.strokeColor;
			ctx.lineWidth = dots.dotLineWidth;

			var limit = dots.dotDisLimit;
			var size = 0;

			for(var i=0; i<n_ObjLen; i++){

				var o = aryObj[i];

				var x = o.x;
				var y = o.y;
				var dis = limit;
				var dis_02 = limit;
				var flg = false;

				ctx.globalAlpha = dots.fillAlpha;

				//他のポイントとの距離確認
				var o2;
				var n_div;
				var n_difX;
				var n_difY;
				var dis02 = limit;
				var forLen = n_ObjLen - i;

				for(var j=0; j<n_ObjLen; j++){

					var num;

					if(j === i) continue;
					o2 = aryObj[j];
					dis = pointDisCheck(o,o2);

					if(flg === true) break;
					if(dis >= limit ) continue;
					
					n_difX = x - o2.x;
					n_difY = y - o2.y;
					n_difX = absoluteValue(n_difX);
					n_difY = absoluteValue(n_difY);

					if(n_difX >= dots.difference　&& n_difY >= dots.difference) continue;

					ctx.beginPath();
					ctx.moveTo(x,y);
					ctx.lineTo(o2.x,o2.y);
					ctx.stroke();
					o.flgHitted = true;
					o2.flgHitted = true;
				}
				if(o.flgHitted === true){
					if(o.nX === 0){
						o.nX = o.nY;
						o.nY = 0;
					}else if(o.nY === 0){
						o.nY = o.nX;
						o.nX = 0;
					}
				}

				ctx.globalAlpha = 1;
				ctx.fillStyle = dots.fillShadowColor;
				ctx.beginPath();
				ctx.arc(x,y+1,dots.dotSize+2,0,n_Angle,false);
//				ctx.closePath;
				ctx.fill();

				ctx.fillStyle = (o.flgHitted === true)? dots.fillHitColor :dots.fillColor;
				ctx.beginPath();
				ctx.arc(x,y,dots.dotSize,0,n_Angle,false);
//				ctx.closePath;
				ctx.fill();


				x += o.nX*dots.dotSpd;
				y += o.nY*dots.dotSpd;

				if(x < 0) x = n_iw;
				else if(x > n_iw) x = 0,y = (Math.random()*n_ih)>>0;
				if(y < 0) y = n_ih,x = (Math.random()*n_iw)>>0;
				else if(y > n_ih) y = 0;

				o.x = x;
				o.y = y;

				o.flgHitted = false;
			}


			return false;
		};


		/*process ループ関数
		--------------------------------------------------------------------*/
		var loop = function(){
			stats.begin();

			if(dots.flgFade === true){
				ctx.globalAlpha = dots.clearAlpha;
				ctx.fillStyle = dots.bgColor;

				ctx.beginPath();
				ctx.rect(0,0,n_iw,n_ih);
				ctx.closePath();
				ctx.fill();
			}else{
				ctx.clearRect(0,0,n_iw,n_ih);
			}

			//ctx.globalAlpha = 1;
			parmUpdate();

			objDraw();
			win.requestAnimationFrame(loop);

			stats.end();
			return false;
		};


		/*function マウス座標取得
		--------------------------------------------------------------------*/
		function mouseMoveHandler(e) {
			var rect = e.target.getBoundingClientRect();
			mousePoint.x = Math.floor(e.clientX - rect.left);
			mousePoint.y = Math.floor(e.clientY - rect.top);
		}


		//process canvasアニメ開始
		var canvasInit = function(){

			canvas.style.backgroundColor = dots.bgColor;
			objSet();
			loop();
			doc.addEventListener("mousemove",mouseMoveHandler)

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