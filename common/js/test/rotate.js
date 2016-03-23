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

        //文字列
		var s_pageUA = pages.UA();            //ユーザーエージェント保持
		var s_pageID = pages.ID();		      //ページID
		var s_pageMobile = pages.mobile();    //モバイル判定
		var s_pageClass = pages.Category();

        //jQueryオブジェクト
		var $main = $(doc.getElementById("main"));
        var $ancherTag = (s_pageUA === "webkit") ? $("body"):$("html");


		/*var 共通変数　このJS内部でグローバルに使う変数
		--------------------------------------------------------------------*/
        var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
        var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ


		/*contents 処理
		--------------------------------------------------------------------*/
		
		var bg = new Image();
		var x = 50;
		var y = 50;
		var dx = 1;
		var dy = 0;
		var rotation = 90;
		
		bg.addEventListener("load",eventShipLoaded,false);
		bg.src = "images/dummy/photo-01.jpg";
		
		
		function eventShipLoaded(){
			
			drawScreen();
			
			return false;
		}


		function drawScreen(){
						
			var t = 1000;
			
			ctx.fillStyle = "#fc0fc0";
			ctx.fillRect(0,0,n_iw,n_ih);
			
			ctx.save();
			ctx.setTransform(1,0,0,1,0,0);
			
			ctx.translate(x+t,y);
			var angleRadians = rotation * Math.PI / 180;
			ctx.rotate(angleRadians);

			ctx.drawImage(bg,0,0,1024,768,-16,-16,1024,768);
			ctx.restore();
			
			return false;
		}




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
				this.winCheck();
				canvas.width = n_iw;
				canvas.height = n_ih;
				return false;
			}
		};
		var resizer = new Resizer();


		/*event リサイズ実行
		--------------------------------------------------------------------*/
		var resizeFunc = function(){
			resizer.canvasResize();
			return false;
		};


		/*event 処理分岐
		--------------------------------------------------------------------*/
		resizeFunc();
		setTimeout(function(){win.addEventListener("resize",resizeFunc,false);},100);

        return false;
	}



	$(window).on("load",init);
})
//SCRIPT END