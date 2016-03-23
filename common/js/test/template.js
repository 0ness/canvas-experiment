;(function(window, document) {
	"use strict";




	/*Property
	--------------------------------------------------------------------*/
	var INF0	= new UserInfo(),
		LIB		= new Planet();




	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @object Canvas
	 */
	var CANVAS = function(){
		var _self = this;
		_self.elm 	= document.getElementById("myCanvas");
		_self.init();
	},
		_CANVAS = CANVAS.prototype;

	_CANVAS.elm 		= null;
	_CANVAS.ctx 		= null;
	_CANVAS.ary			= [];
	_CANVAS.width		= null;
	_CANVAS.height		= null;
	_CANVAS.dotLength 	= 10; 
	_CANVAS.PI 			= (Math.PI/180)*360;
	_CANVAS.noiseRange 	= 0;
	_CANVAS.noiseSeed 	= 0;

	/**
	* 座標取得：マウスポインタ座標取得
	* @method getMousePoint
	* @param{Event} ターゲットイベント
	*/
	_CANVAS.getMousePoint = function(e){
		var _p = {x:0,y:0},
			doc = document.body;
		if(e){
			_p.x = e.pageX;
			_p.y = e.pageY;
		}else{
			var ev = event;
			_p.x = ev.x + doc.scrollLeft;
			_p.y = ev.y + doc.scrollTop;
		}
		return _p;
	};




	/*Init
	--------------------------------------------------------------------*/
	_CANVAS.init = function() {
		var _self = this;

		window.addEventListener("resize",function(){
			_self.resize();	
		});

		_self.resize();		
		_self.loop();
	};




	/*Member Method
	--------------------------------------------------------------------*/
	_CANVAS.loop = function(){
		var _self = this;


		window.requestAnimationFrame(_self.loop.bind(_self));

	};


	_CANVAS.resize = function(){
		var _self = this,
			_winW = LIB.getWindowWidth(),
			_winH = LIB.getWindowHeight();

		_self.elm.width = _winW;
		_self.elm.height = _winH;
	};





	window.INDEX = CANVAS;


})(window, document);


var Index = new INDEX();
