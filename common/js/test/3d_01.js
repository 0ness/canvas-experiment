;(function(window, document) {
	"use strict";


	var PERLIN = new SimplexNoise(),
		LIB = new Planet(),
		PARAM = {
			//描画要素
			spd			:4,
			lineWidth	:1,
			bgAlpha		:0.6,
			composition	:"source-over",
			noiseRange	:0.1,
			noiseLevel	:50,
			radius		:50,
			interval	:10,
			length		:30,
			
			//色
			fillColor	:LIB.getRndRGB(200),
			strokeColor	:LIB.getRndRGB(200),
			bgColor		:"#000400",
			
			//分岐
			flgColor	:false,
			flgStroke	:true,
			flgFill		:false,
			flgArc		:false,
			flgBG		:false,
			doZLayer 	:true,
			flgAnim		:true
		};

	
	
	/*base object
	--------------------------------------------------------------------*/

	/* @object Stats
	 * 処理速度確認用
	*/
	var stats = new Stats();
	stats.setMode( 0 );
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "fixed";
	stats.domElement.style.right = "0";
	stats.domElement.style.bottom = "5px";


	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI(),
		paramDotLength = gui.add(PARAM, 'length',0,100),
//		paramNoiseLevel = gui.add(PARAM, 'noiseLevel',1,300),
//		paramNoiseRange = gui.add(PARAM, 'noiseRange',0,1),
		paramPointInterval = gui.add(PARAM, 'interval',0.1,100);

//	gui.add(PARAM,"spd",0,20,false);
//	gui.add(PARAM,"radius",0,200,false);
	gui.add(PARAM,'composition',["source-over","xor","lighter","multiply","difference"]);
//	gui.add(PARAM, 'flgStroke',false);
//	gui.add(PARAM, 'flgArc');
//	gui.add(PARAM, 'flgColor');
//	gui.add(PARAM, 'bgAlpha',0,1);
//	gui.addColor(PARAM, 'bgColor');
//	var paramFlgAnim = gui.add(PARAM, 'flgAnim',false);
	var paramZlayer = gui.add(PARAM,"doZLayer");
	
	paramDotLength.onChange(function(e){
		var _len = e>>0;
		Index.createDot(_len);
	});

	paramZlayer.onChange(function(e){
		var _flg = e;
				
		if(_flg) Index.zDefaultAssign();
		else Index.zSameAssign();
	});
	
	
	
	/*contents object
	--------------------------------------------------------------------*/
	var Dot = function(){
//		this.x = 100;
	},
		_Dot = Dot.prototype;
	
	//member property
	_Dot.ctx		= null;
	
	_Dot.x 			= 100;
	_Dot.y 			= 150;
	_Dot.z 			= 1;
	_Dot.bx 		= 100;
	_Dot.by 		= 150;
	_Dot.bz			= 500;
	
	_Dot.size		= 40;
	_Dot.angleX		= 0;
	_Dot.angleY		= 0;
	_Dot.angleZ		= -90;
	_Dot.radiusX	= 1000;
	_Dot.radiusY	= 82;
	_Dot.radiusZ	= 82;
	_Dot.spd 		= 0.5;
	_Dot.spdZ 		= 1;
	_Dot.scale  	= 1.2;
	_Dot.alpha		= 1;
	_Dot.fl			= 0;
	_Dot.PI	 		= 3.141592653589793 / 180;
	_Dot.arnEndAngle= 3.14 * 2;
	_Dot.isFoward	= true;
	
	//member method
	_Dot.draw = function(){
		var _self	= this,
			_ctx	= _self.ctx,
			_size 	= _self.size * _self.scale,
			_alpha  = (1 - (_self.z / 500)) + 0.5,
			_x 		= _self.x,
			_y 		= _self.y;

		_alpha = (_alpha < 0.05) ? 0.05 : _alpha;
		
		_ctx.fillStyle = "#ff0000";
		_ctx.beginPath();
		_ctx.arc(_self.bx,_self.by,2,0,_self.arnEndAngle,false);
		_ctx.fill();

		_ctx.fillStyle = "rgba(5,255,255," + _alpha + ")";
		_ctx.beginPath();
		_ctx.arc(_x,_y,_size,0,_self.arnEndAngle,false);
		_ctx.fill();
		
		_self.rotate();
	};
	
	_Dot.rotate = function(){
		var _self = this,
			_spd = _self.spd,
			_pi = _self.PI,
			_rx = _self.angleX * _pi,//度をラジアンに変換
			_rz = _self.angleZ * _pi,//度をラジアンに変換
			
			_gx = (_self.radiusX * Math.cos(_rx))>>0),//円運動の値を計算
			_gz = _self.z + ((_self.radiusZ * Math.sin(_rz))>>0),//円運動の値を計算
			_downForce = 0.15;

		_self.x += (_gx - _self.x) * _downForce;
		_self.z += (_gz - _self.z) * _downForce;

		_self.angleZ += _spd;

		if(_self.angleZ > 180) _self.angleZ = -180;
	};

	

	


	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @object Canvas
	 */
	var CANVAS = function(){
		var _self = this;
		_self.elm 	= document.getElementById("myCanvas");
		_self.ctx 	= _self.elm.getContext("2d");
		_self.width = window.innerWidth || document.body.clientWidth;
		_self.height= window.innerHeight || document.body.clientHeight; 
		_self.init();
	},
		_CANVAS = CANVAS.prototype;

	_CANVAS.elm = null;
	_CANVAS.ctx = null;
	_CANVAS.ary	= [];
	_CANVAS.width	= null;
	_CANVAS.height	= null;
	_CANVAS.dotLength = 10; 
	_CANVAS.PI 		= (Math.PI/180)*360;
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

	var _xpos = 0,
		_ypos = 0,
		_zpos = 0,
		_fl	= 250,
		_mouse = {
			x:0,
			y:0
		};
	

	
	
	/*Method
	--------------------------------------------------------------------*/
	_CANVAS.init = function(){
		var _self = this;
		
		_self.createDot(30);
		
		window.addEventListener("resize",_self.resize.bind(_self));
		window.addEventListener("mousemove",function(e){
			_mouse = _self.getMousePoint(e);
		});
		
		document.addEventListener("keydown" ,_self.zControl.bind(_self));
		
		_self.resize();
		_self.loop();
	};
	
	_CANVAS.createDot = function(a_len){
		var _self = this,
			_len = a_len,
			_w = _self.width,
			_h = _self.height,
			_angle = 360 / _len,
			_dot = null,
			_scale,
			_a = 0;
		
		_self.ary = [];

		for(var i=0; i<_len; i++){
			_dot = new Dot();
			_dot.ctx = _self.ctx;
			_dot.x = _dot.bx = Math.random()*_w >> 0;
			_dot.y = _dot.by = Math.random()*_h >> 0;
			_dot.z = _dot.bz = Math.random()*1000 >> 0;
			_dot.scale = _fl / (_fl + _dot.z);
			_self.ary[i] = _dot;
			
		}
	};
	
	_CANVAS.loop = function(){
		var _self 	= this,
			_ctx	= _self.ctx,
			_ary 	= _self.ary,
			_len 	= _ary.length,
			_vpx 	= _self.width	>> 1,
			_vpy 	= _self.height	>> 1,
			_dot,
			_scale,
			_focus	= 250;

		_self.setting();
		
		var _x,
			_y;
		
		for(var i =0; i<_len; i++){

			_dot = _ary[i];
//			_dot.z = 1000 - (_mouse.y / _self.height)*1000;
			
			if(_dot.z  > -_fl){
				_scale = _fl / (_fl + _dot.z);
				_dot.scale = _scale;

				//平面的な目標値
				_xpos = (_mouse.x - _vpx);
				_ypos = (_mouse.y - _vpy);

				//視野角を計算した目標値 =　マウスに関連した座標 - Dotの持つ固有の初期値
				_x = ((_vpx + _xpos * _scale) + ((_dot.bx - _vpx) * _scale))>>0;
				_y = ((_vpy + _ypos * _scale) + ((_dot.by - _vpy) * _scale))>>0;

				_dot.x += (_x - _dot.x)*0.2;
				_dot.y += (_y - _dot.y)*0.2;
				_dot.draw();
			}else{
				_dot.z = -_fl+1;
				_scale = _fl / (_fl + _dot.z);
				_dot.scale = _scale;
			};
		}
		
		window.requestAnimationFrame(_self.loop.bind(_self));
	};
	
	/**
	 * 設定ボイラーテンプレート
	 */
	_CANVAS.setting = function(){
		var _self = this,
			_ctx = _self.ctx,
			_w = _self.width,
			_h = _self.height;
		
		//描画リセット
		_ctx.fillStyle = "#000000";
		_ctx.fillRect(0,0,_self.width,_self.height);
		
		//ガイド表示
		_ctx.beginPath();
		_ctx.fillStyle = "rgba(255,255,255,0.2)";
		_ctx.fillRect(0,_h>>1,_w,1);
		_ctx.fillRect(_w>>1,0,1,_h);
	};
	
	/**
	 * リサイズ処理
	 */
	_CANVAS.resize  = function(){
		var _self = this,
			_elm = _self.elm,
			_w = window.innerWidth || document.body.clientWidth,
			_h= window.innerHeight || document.body.clientHeight;
		_elm.width = _self.width =_w;
		_elm.height = _self.height = _h;
	};

	/**
	 * z軸の操作
	 * キーボードの↑と↓で操作
	 */
	_CANVAS.zControl = function(e){
		var _self = this,
			_ary = _self.ary,
			_len = _ary.length,
			_dot = null,
			_code = e.keyCode,
			_zAdjust = 20;
		
		if(_code === 38){
			_zpos += _zAdjust;
			for(var i=0; i<_len; i++){
				_dot 	= _self.ary[i];
				_dot.z 	+= _zAdjust; 
			}
		}else if(_code === 40){
			_zpos -= _zAdjust;
			for(var i=0; i<_len; i++){
				_dot 	= _self.ary[i];
				_dot.z 	-= _zAdjust; 
			}
		}
	};

	/**
	 * z軸再指定
	 */
	_CANVAS.zDefaultAssign = function(){		
		var _self = this,
			_ary = _self.ary,
			_len = _ary.length,
			_dot = null;
		
		console.log("default",_len);

		for(var i=0; i<_len; i++){
			_dot = _ary[i];
			_dot.z = _dot.bz;
		}
	};

	/**
	 * 各オブジェクトのz軸のリセット
	 */
	_CANVAS.zSameAssign = function(){
		var _self = this,
			_ary = _self.ary,
			_len = _ary.length,
			_dot = null;
		
		for(var i=0; i<_len; i++){
			_dot = _ary[i];
			_dot.z = 0;
		}
	};


	window.INDEX = CANVAS;
	
})(window, document);


var Index = new INDEX();