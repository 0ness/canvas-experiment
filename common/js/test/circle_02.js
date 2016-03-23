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

		//ページ情報
		var pages = new PageInfo();
		var lib = new Library();
		var s_pageUA = pages.UA();            //ユーザーエージェント保持
		var s_pageID = pages.ID();		      //ページID
		var s_pageMobile = pages.mobile();    //モバイル判定
		var s_pageClass = pages.Category();

        //jQueryオブジェクト
		var $main = $(doc.getElementById("main"));
        var $ancherTag = (s_pageUA === "webkit") ? $("body"):$("html");

		//数値
		var numPI = 3.141592653589793;
		var numAngle = numPI<<1;


		/*const 拡張関数　requestAnimFrame()
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


		/*var 共通変数　このJS内部でグローバルに使う変数
		--------------------------------------------------------------------*/
        var numWidth = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
        var numHeight = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ
		var numCanvasWidth = 1536;
		var numCanvasHeight = 1500;
		var numLineWidth = 4;

        //文字列
        var strStrokeColor = "#ffcc00";
        var strFillColor = "#f00";

		//座標
		var mousePoint = {x:numWidth/2,y:numHeight/2};
		var targetPoint = {x:0, y:0};
		var circlePoint = {x:0,y:0};

		//タイマー用
		var timerID;


		/*object Stats用オブジェクト
		--------------------------------------------------------------------*/
		var stats = new Stats();
		stats.setMode( 1 );
		document.body.appendChild( stats.domElement );
		stats.domElement.style.po
		stats.domElement.style.position = "fixed";
		stats.domElement.style.left = "5px";
		stats.domElement.style.top = "5px";


		/*object リサイズ用オブジェクト
		--------------------------------------------------------------------*/
		var Resizer = function(){};
		Resizer.prototype = {
			winCheck:function(){
				numWidth = win.innerWidth || doc.body.clientWidth;
				numHeight = win.innerHeight || doc.body.clientHeight;
				return false;
			},
			canvasResize:function(){
				canvas.width = numWidth;
				canvas.height = numHeight;
				mousePoint = {x:numWidth/2,y:numHeight/2};
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


		/*function canvas初期化
		--------------------------------------------------------------------*/
		function canvasInit(){
			ctx.fillStyle = strFillColor;
			return false;
		}


		/*object 円操作オブジェクト
		--------------------------------------------------------------------*/
		function Circle(){
			this.angleX = 200;// 角度（初期値）
			this.angleY = 200;// 角度（初期値）
			this.changeX = 1;// X増やす角度
			this.changeY = 1;// Y増やす角度
			this.radiusX = 50;// 半径（折り返す値）
			this.radiusY = 50;// 半径（折り返す値）
			this.radianX = 0;
			this.radianY = 0;
			this.x = 0;
			this.y = 0;
			this.pi = numPI / 180;
			this.color = strFillColor;
			this.strokeColor = strStrokeColor;
			this.size = 30;
			return false;
		};

		Circle.prototype = {
			move:function(){
				this.radianX = this.angleX * this.pi;
				this.radianY = this.angleY * this.pi;
				this.x = (this.radiusX * Math.cos(this.radianX))+mousePoint.x;
				this.y = (this.radiusY * Math.sin(this.radianY))+mousePoint.y;
				this.angleX += this.changeX;
				this.angleY += this.changeY;

				//目標座標
				targetPoint.x += (this.x - targetPoint.x)*0.08;
				targetPoint.y += (this.y - targetPoint.y)*0.08;

				circlePoint.x = targetPoint.x;
				circlePoint.y = targetPoint.y;
				return false;
			}
		};

		var cir = new Circle();


		/*object dat.GUI用オブジェクト
		--------------------------------------------------------------------*/
		var gui = new dat.GUI();

		var DatParam = function() {
			this.color = [ 0, 128, 255]; // CSS string
			this.strokeColor = [ 0, 128, 255]; // CSS string
		};
		var param = new DatParam();
		gui.remember(cir);
		gui.add(cir, 'radiusX',0,500);
		gui.add(cir, 'radiusY',0,500);
		gui.add(cir, 'size',0.5,50);
		gui.add(cir, 'changeX',1,30);
		gui.add(cir, 'changeY',1,30);
		gui.addColor(cir, 'color');
		gui.addColor(cir, 'strokeColor');


		/*function 円描画
		--------------------------------------------------------------------*/
		function arc(x,y,s){
			var _ctx = ctx;
			_ctx.beginPath();
			_ctx.arc(x,y,s,0,numAngle,false);
			_ctx.closePath();
			_ctx.fillStyle = cir.color;
			_ctx.strokeStyle = cir.stroke;
			_ctx.stroke();
			_ctx.fill();
			return false;
		};


		/*function マウス座標取得
		--------------------------------------------------------------------*/
		function mouseMoveHandler(e) {
			var rect = e.target.getBoundingClientRect();
			mousePoint.x = Math.floor(e.clientX - rect.left);
			mousePoint.y = Math.floor(e.clientY - rect.top);
		}


		/*function canvas描画
		--------------------------------------------------------------------*/
		function draw(){

			stats.begin();
			ctx.clearRect(0,0,numWidth,numHeight);
			var target = targetPoint;
			var target2 = mousePoint;
			cir.move();
			arc(target.x,target.y,cir.size);
			arc(target2.x,target2.y,5);

			stats.end();

			requestAnimFrame(draw);

			return false;
		};


		/*contents 処理分岐
		--------------------------------------------------------------------*/
		if(s_pageClass === "full"){
			resizeFunc();
			canvasInit();
			setTimeout(function(){
				//doc.addEventListener("mousemove",mouseMoveHandler,false);
				win.addEventListener("resize",resizeFunc,false);
				draw();
			},100);
		}

        return false;
	}



	$(window).on("load",init);
})
//SCRIPT END