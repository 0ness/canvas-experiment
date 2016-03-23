(function () {
	"use strict";

	

	
	/*const 共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	var win 	= window,
		doc	 	= document,
		canvas 	= doc.getElementById("myCanvas");

	


	/*var 共通変数　このJS内部でグローバルに使う変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth,
		n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ

	
	

	/*object リサイズ用オブジェクト
	--------------------------------------------------------------------*/
	var Resizer = function(){};
	Resizer.prototype = {
		winCheck:function(){
			n_iw = win.innerWidth || doc.body.clientWidth;
			n_ih = win.innerHeight || doc.body.clientHeight;
		},
		canvasResize:function(){
			this.winCheck();
			canvas.width = n_iw+10;
			canvas.height = n_ih;
		}
	};
//	var resizer = new Resizer();
	
	


	/*function リサイズ実行
	--------------------------------------------------------------------*/
	var resizeFunc = function(){
//		resizer.canvasResize();
	};


	
	
	/*contents 処理分岐
	--------------------------------------------------------------------*/
	resizeFunc();

	
	
}());