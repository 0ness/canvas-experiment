;(function(window, document) {
	"use strict";

	
	var canvas 		= document.getElementById("myCanvas"),
		ctx 		= canvas.getContext("2d"),
		winWidth 	= window.innerWidth || document.body.clientWidth,
		winHeight	= window.innerHeight || document.body.clientHeight,
		mousePoint 	= {
			x:0,
			y:0
		},
		vanishingPoint = {
			x:0,
			y:0
		}
	
	
	
	/*contents object
	--------------------------------------------------------------------*/
	var Dot = function(_param){
		this.x 			= _param.x;
		this.y 			= _param.y;
		this.z 			= _param.z;
		this.bx 		= _param.x;
		this.by 		= _param.y;
		this.bz			= _param.z;
		this.scale  	= _param.scale;
	},
		_Dot = Dot.prototype;
	
	//member property
	_Dot.adjustZ	= -300;
	_Dot.size		= 20;
	_Dot.alpha		= 1;
	_Dot.endAngle	= 3.14 * 2;
	
	//member method
	/**
	 * 描画
	 */
	_Dot.draw = function(){
		var _ctx	= ctx,
			_size 	= (this.size * this.scale * 100 | 0)/100,
			_x 		= this.x>>0,
			_y 		= this.y>>0,
			_alpha  = (0.8 - (this.z / 500)) + 0.5;

//		_size 	= (_size > 10) ? 10 : _size;
		_alpha  = (_alpha < 0.05) ? 0.05 : _alpha;
		
		_ctx.fillStyle = "#ffffff";
		_ctx.beginPath();
		_ctx.arc(this.bx,this.by,1,0,this.endAngle,false);
		_ctx.fill();

		if(_size <= 0) _size = 0.01;
		_ctx.fillStyle = "rgba(5,255,255," + _alpha + ")";
		_ctx.beginPath();
		_ctx.arc(_x,_y,_size,0,this.endAngle,false);
		_ctx.fill();
	};
	
	/**
	 * 座標計算
	 * @param {number} _fl 視野角
	 */
	_Dot.move = function(_fl){
		var _vpx = vanishingPoint.x,
			_vpy = vanishingPoint.y,
			_scale = _fl / (_fl + (this.z + this.adjustZ));
		
		this.scale = _scale;

		//平面的な目標値
		var _nextX = (mousePoint.x - _vpx),
			_nextY = (mousePoint.y - _vpy);

		//視野角を計算した目標値 =　マウスに関連した座標 - Dotの持つ固有の初期値
		var _x = ((_vpx + _nextX * _scale) + ((this.bx - _vpx) * _scale))>>0,
			_y = ((_vpy + _nextY * _scale) + ((this.by - _vpy) * _scale))>>0;

		this.x += (_x - this.x)*0.15;
		this.y += (_y - this.y)*0.15;
		this.draw();
	};

	


	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @object Canvas
	 */
	var CANVAS = function(){
		this.ary			= [];
		this.noiseRange 	= 0;
		this.noiseSeed 		= 0;
		this.init();
	},
		Member = CANVAS.prototype;

	
	Member.PI 			= (Math.PI/180)*360;
	Member.dotLength 	= 100;
	Member.doZLayer 	= true;
	Member.focalLength	= 200;

	
	
	
	/*Method
	--------------------------------------------------------------------*/
	/**
	 * 開始
	 */
	Member.init = function(){
		var _self = this;
		window.addEventListener("resize",this.resize.bind(this));
		window.addEventListener("mousemove",function(e){
			mousePoint = _self.getMousePoint(e);
		});
		document.addEventListener("keydown" ,this.zControl.bind(this));
		this.resize();
		this.createDot();
		this.loop();
	};
	
	/**
	* 座標取得：マウスポインタ座標取得
	* @method getMousePoint
	* @param{Event} ターゲットイベント
	*/
	Member.getMousePoint = function(e){
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
	
	/**
	 * ドット生成
	 */
	Member.createDot = function(){
		var _w 		= winWidth,
			_h 		= winHeight;
		this.ary = [];
		for(var i=0; i<this.dotLength; i++){
			var _z = Math.random()*1000 >> 0,
				_dot 		= new Dot({
					x 		: (Math.random()*_w >> 0) + (Math.random()*1000) - 500,
					y 		: (Math.random()*_h >> 0) + (Math.random()*1000) - 500,
					z 		: _z,
					scale 	: this.focalLength / (this.focalLength + _z)
				});
			this.ary[i] = _dot;
		}
	};
	
	/**
	 * ループ処理
	 */
	Member.loop = function(){
		var _ary 	= this.ary,
			_len 	= _ary.length,
			_fl		= this.focalLength;
		
		this.baseDraw();
		for(var i =0; i<_len; i++){
			var _dot = _ary[i];
			_dot.move(_fl)
			_dot.draw();
		}
		window.requestAnimationFrame(this.loop.bind(this));
	};
	
	/**
	 * 基本的なcanvas塗り
	 */
	Member.baseDraw = function(){
		var _self = this,
			_ctx = ctx,
			_w = winWidth,
			_h = winHeight;
		
		//描画リセット
		_ctx.fillStyle = "#000000";
		_ctx.fillRect(0,0,_w,_h);
		
		//ガイド表示
		_ctx.beginPath();
		_ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
		_ctx.fillRect(0,_h>>1,_w,1);
		_ctx.fillRect(_w>>1,0,1,_h);
	};
	
	/**
	 * リサイズ時にcanvas範囲を調整
	 */
	Member.resize  = function(){
		canvas.width 	= winWidth = window.innerWidth || document.body.clientWidth;
		canvas.height	= winHeight = window.innerHeight || document.body.clientHeight;
		vanishingPoint.x = winWidth >> 1;
		vanishingPoint.y = winHeight >> 1;
	};

	/**
	 * z軸の操作
	 * キーボードの↑と↓で操作
	 */
	Member.zControl = function(e){
		var _ary 	= this.ary,
			_len 	= _ary.length,
			_dot 	= null,
			_code 	= e.keyCode,
			_zAdjust= 20;
		
		if(_code === 38){
			_Dot.adjustZ += _zAdjust; 
		}else if(_code === 40){
			_Dot.adjustZ -= _zAdjust; 
		}
	};
	
	/**
	 * z軸の有無切り替え
	 */
	Member.zPositionToggle = function(){
		if(this.doZLayer) this.zDefaultAssign();
		else this.zSameAssign();
	};

	/**
	 * z軸再指定
	 */
	Member.zDefaultAssign = function(){		
		var _ary = this.ary,
			_len = _ary.length,
			_dot = null;
		for(var i=0; i<_len; i++){
			_dot = _ary[i];
			_dot.z = _dot.bz;
		}
	};

	/**
	 * 各オブジェクトのz軸のリセット
	 */
	Member.zSameAssign = function(){
		var _ary = this.ary,
			_len = _ary.length,
			_dot = null;
		for(var i=0; i<_len; i++){
			_dot = _ary[i];
			_dot.z = 0;
		}
	};
	
	
	
	
	/*base object
	--------------------------------------------------------------------*/

	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI();

	gui.add(Member, 'dotLength',0,400).onChange(function(e){
		Member.dotLength = e>>0;
		Index.createDot();
	});
	gui.add(Member, 'focalLength',1,500);
	gui.add(_Dot, 'adjustZ',-600,600);
	gui.add(_Dot, 'size',1,100);
	gui.add(Member,"doZLayer").onChange(function(e){
		Member.doZLayer = e;
		Index.zPositionToggle();
	});
	
	
	
	
	
	
	

	window.INDEX = CANVAS;
	
})(window, document);
var Index = new INDEX();