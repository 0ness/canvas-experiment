;(function(window, document) {
	"use strict";


	var PERLIN = new SimplexNoise(),
		LIB = new Planet(),
		PARAM = {
			//描画要素
			spd:4,
			lineWidth:1,
			bgAlpha:0.6,
			composition:"source-over",
			noiseRange:0.1,
			noiseLevel:50,
			radius:50,
			interval:10,
			//色
			fillColor:LIB.getRndRGB(200),
			strokeColor:LIB.getRndRGB(200),
			bgColor:"#000400",
			//分岐
			flgColor:false,
			flgStroke:true,
			flgFill:false,
			flgArc:false,
			flgBG:false,
			flgAnim:true
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
		//		paramLineWidth = gui.add(param, 'lineWidth',0.1,50),
		paramNoiseLevel = gui.add(PARAM, 'noiseLevel',1,300),
		paramNoiseRange = gui.add(PARAM, 'noiseRange',0,1),
		paramPointInterval = gui.add(PARAM, 'interval',0.1,100);

	gui.add(PARAM,"spd",0,20,false);
	gui.add(PARAM,"radius",0,200,false);
	gui.add(PARAM,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.add(PARAM, 'flgStroke',false);
	//	gui.add(param, 'flgFill',false);
	//	gui.add(param, 'flgBG',false);
	//	gui.addColor(param, 'fillColor');
	//	gui.addColor(param, 'strokeColor');
	gui.add(PARAM, 'flgArc');
	gui.add(PARAM, 'flgColor');
	gui.add(PARAM, 'bgAlpha',0,1);
	gui.addColor(PARAM, 'bgColor');
	var paramFlgAnim = gui.add(PARAM, 'flgAnim',false);

	
//	var s_r = (Math.random()*255)>>0;
//	var s_g = (Math.random()*255)>>0;
//	var s_b = (Math.random()*255)>>0;
//	var s_dotColor = "rgb("+s_r+", "+s_g+", "+s_b+",1)";
//	var s_ctxComposition = "xor";
//
//	var n_Loop = 28;
//	var n_ObjLen = 60;
//	var n_PI = Math.PI*2;
//	var n_Angle = n_PI<<1;
//	var n_DisLimit = 50;
	
	
	
	/*contents object
	--------------------------------------------------------------------*/
	var Dot = function(){},
		_Dot = Dot.prototype;
	
	//member property
	_Dot.ctx		= null;
	_Dot.x 			= 0;
	_Dot.y 			= 0;
	_Dot.z 			= 1;
	_Dot.size		= 10;
	_Dot.angleX		= 0;
	_Dot.angleY		= 0;
	_Dot.angleZ		= -90;
	_Dot.radiusX	= 270;
	_Dot.radiusY	= 82;
	_Dot.spd 		= 0.5;
	_Dot.spdZ 		= 1;
	_Dot.scale  	= 1.2;
	_Dot.alpha		= 1;
	_Dot.PI	 		= 3.141592653589793 / 180;
	_Dot.arnEndAngle= 3.141592653589793 << 1;
	_Dot.isFoward	= true;
	
	//member method
	_Dot.init 		= function(){};
	_Dot.move		= function(){
		var _self = this,
			_spd = _self.spd,
			_pi = _self.PI,
			_cx = 450,
			_cy = 310,
			_rx = _self.angleX * _pi,
			_ry = _self.angleY * _pi,//度をラジアンに変換
			_gx = ((_self.radiusX * Math.cos(_rx))>>0) + _cx,
			_gy = ((_self.radiusY * Math.sin(_ry))>>0) + _cy,//円運動の値を計算
			_downForce = 0.15;

		_self.x += (_gx - _self.x) * _downForce;
		_self.y += (_gy - _self.y) * _downForce;
		_self.angleX += _spd;
		_self.angleY += _spd;
		_self.angleZ += _self.spdZ;

		if(_self.angleX > 180){
			_self.angleX = -180;
		}
		if(_self.angleY > 360){
			_self.angleY = -360;
		}
		if(_self.angleZ > 360){
			_self.angleZ = -360;
		}
		
		_self.draw();
	};
	
	_Dot.draw = function(){
		var _self	= this,
			_ctx	= _self.ctx,
			_angle 	= _self.angleX,
			_angleZ = _self.angleZ,
			_size 	= _self.size * _self.scale,
			_alpha  = _self.alpha,
			_x 		= _self.x,// + (_self.radiusX>>1),
			_y 		= _self.y;// + (_self.radiusY>>1);

//		var _per = (((1 - ( 100 - Math.abs(_angleZ - 90)) / 100 ))*100>>0)/100;
//		_size *= (_per+0.5);

		//表裏確認
//		if(_angle < 0){
//			_ctx.fillStyle = "#ffffff";
//		}else if(_angle > 0){
//			_ctx.fillStyle = "#ff0000";
//		}
		_ctx.fillStyle = "rgba(5,255,255," + 0.1 + ")";
		
//		console.log(_x,_y,_size);
		
		//プロパティ反映
		_ctx.beginPath();
		_ctx.arc(_x,_y,_size,0,_self.arnEndAngle,false);
		_ctx.fill();
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
	_CANVAS.PI 		= (Math.PI/180)*360;

	_CANVAS.noiseRange 	= 0;
	_CANVAS.noiseSeed 	= 0;


	
	/*Method
	--------------------------------------------------------------------*/
	_CANVAS.init = function(){
		var _self = this,
			_len = 10,
			_w = _self.width,
			_h = _self.height,
			_cx = _w >> 1,
			_cy = _h >> 1,
			_rx = 0,
			_ry = 0,
			_rz = 0,
			_angle = 360 / _len,
			_dot = null,
			_a = 0;
		
		var xNum 		= 8,
			yNum 		= 8,
			zNum 		= 10,
			xInterval 	= 50,
			yInterval 	= 50,
			zInterval 	= 50;

		for( var i=0; i<xNum; ++i ) {
			for( var j=0; j<yNum; ++j ) {
				for( var k=0; k<zNum; ++k ) {
					var _dot = new Dot();
					_dot.x = (i - xNum*0.5)*xInterval;
					_dot.y = (j - yNum*0.5)*yInterval;
					_dot.z = (k - zNum*0.2)*zInterval;
					_dot.ctx = _self.ctx;
					_self.ary.push(_dot);
				}
			}
		}
		
//		for(var i =0; i<_len; i++){
//			_dot = new Dot();
//			_a =(i*_angle - 180)>>0;
//			_rx 		= Math.random()*_w;
//			_ry 		= Math.random()*_h;
//			_rz 		= Math.random()*50;
//			
//			_dot.ctx	= _self.ctx;
////			_dot.x 		= _rx;
////			_dot.y 		= _ry;
//			_dot.z 		= _rz;
//			
//			_dot.angleY = Math.random()*_h;
//			_dot.radiusX= _cx>>1;
//			_dot.radiusY= Math.random()*_h - _cy;
//			
//			_self.ary[i] = _dot;
//		};
//		
		_self.resize();	
		_self.loop();
		window.addEventListener("resize",_self.resize.bind(_self));
	};
	
	/**
	 * ループ処理
	 */
	//	private var focus:uint = 250;
	//	private function render(e:Event):void {
	//		renderList.sortOn( "z", Array.DESCENDING|Array.NUMERIC );
	//		var l:uint = renderList.length;
	//		for( var i:uint=0; i<l; ++i ) {
	//			var obj:Object = renderList[i];
	//			if( obj.z > -focus ) {
	//				var scale :Number= focus/(focus+obj.z);
	//				obj.view.x = screenX + obj.x * scale;
	//				obj.view.y = screenY + obj.y * scale;
	//				obj.view.scaleX = obj.view.scaleY = scale;
	//				obj.view.alpha = Math.min( 1, scale );
	//				obj.view.visible = true;
	//				this.setChildIndex( obj.view, i );
	//			}
	//			else {
	//				obj.view.visible = false;
	//			}
	//		}
	//	}
	_CANVAS.loop = function(){
		var _self 	= this,
			_ctx	= _self.ctx,
			_ary 	= _self.ary,
//			_rendar = 
			_len 	= _ary.length,
			_cx 	= _self.width	>> 1,
			_cy 	= _self.height	>> 1,
			_dot,
			_focus	= 250;

		_self.setting();
		
		for(var i =0; i<_len; ++i){
//			_ary[i].move();	
			_dot = _ary[i];
			var _scale 	= _focus / (_focus + _dot.z);
			_dot.x 		= _cx + _dot.x + _scale;
			_dot.y 		= _cy + _dot.y + _scale;
			_dot.scale	= _scale;
			_dot.alpha = Math.min(1,_scale);

			_dot.draw();
		};
		
//		window.requestAnimationFrame(_self.loop.bind(_self));
	};
	
	/**
	 * 設定ボイラーテンプレート
	 */
	_CANVAS.setting = function(){
		var _self = this,
			_ctx = _self.ctx;
		
		_ctx.fillStyle = "#000000";
		_ctx.fillRect(0,0,_self.width,_self.height);
	};
	
	/**
	 * リサイズ処理
	 */
	_CANVAS.resize  = function(){
		var _self = this,
			_elm = _self.elm,
			_width = window.innerWidth || document.body.clientWidth,
			_height= window.innerHeight || document.body.clientHeight;
		_elm.width = _width;
		_elm.height = _height;
		_self.width = _width;
		_self.height = _height;
	};



	
	



	window.INDEX = CANVAS;
})(window, document);


var Index = new INDEX();
