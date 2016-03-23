/*==============================================================================

	汎用処理ライブラリ

	・基本DOM操作の自動化
	・HTML5対応
	・IE対応

==============================================================================*/


//SCRIPT START
var Library_Anim = function(){


	/*const 定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window;
	var doc = document;

	//ページ情報
	var pages = new PageInfo();

	//文字列
	var strPageUA = pages.UA();			//ユーザーエージェント保持
	var strPageVER = pages.VER();		//IEのバージョン保持

	//正否値
	var flgPageMobile = pages.mobile();   //モバイル判定


	/*function 拡張　requestAnimFrame()
	--------------------------------------------------------------------*/
	var requestAnimFrame = function(){
		win.requestAnimFrame = (function(){
			return	win.requestAnimFrame ||
					win.webkitRequestAnimFrame ||
					win.mozRequestAnimFrame ||
					win.msRequestAnimFrame ||
					function(callback,element){
						win.setTimeout(callback,1000/60);
					};
		})();
	}




	/*method 色計算＿01（減数値）
	--------------------------------------------------------------------*/
	var getRGB = function(c_01){
		var sub = (c_01 === null)?0:c_01;
		var max_01 = 255-sub;
		var r = ((Math.random()*max_01)>>0)+c_01;
		var g = ((Math.random()*max_01)>>0)+c_01;
		var b = ((Math.random()*max_01)>>0)+c_01;
		var str = "rgb("+r+","+g+","+b+")";
		return str;
	}




	/*method 色計算＿02
	--------------------------------------------------------------------*/
	var getRGB = function(){
		var cseed = ( Math.random()*100 ) >> 0;
		// 色の計算R ≒ 256 * n / 3, G ≒ 256 * n / 7, B ≒ 256 * n / 5
		var cnum = ( cseed++ * 0x552433 ) % 0x1000000;
		var hex = "000000" + cnum.toString(16);
		return "#" + hex.substr( hex.length - 6, 6 );
	}





	/*method 色計算＿03
	--------------------------------------------------------------------*/
	var getRGB_03 = function(){
		var COLOR_MAX = 16777215;
		this.color = "#" + ((COLOR_MAX - Math.random()* 50000) | 0).toString(16);
	}




	/*method 差の絶対値の計算（数値）
	--------------------------------------------------------------------*/
	var abs = function(_num){
		var a = _num;
		a = a>0?a:-a;
		return a;
	}



	/*method ２点間の距離算出（ポイント１、ポインt２）
	--------------------------------------------------------------------*/
	var pointDisCheck = function(_p1,_p2){
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



	/*function 戻り値関数
	--------------------------------------------------------------------*/
	return {
		requestAnimFrame:function(){ requestAnimFrame(); },
		pointDisCheck:function(obj_1,obj_2){ pointDisCheck(obj_1,obj_2); }
	};


};