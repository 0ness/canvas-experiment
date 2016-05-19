;(function(window, document) {
    "use strict";
	
	
	var canvas 	= document.getElementById("myCanvas"),
		ctx		= canvas.getContext("2d"),
		winW	= 0,
		winH	= 0,
		rectX	= 0,
		rectY 	= 0,
		centerX	= 0,
		centerY = 0,
		adjustX = 0,
		adjustY = 0,
		radiusX = 0,
		radiusY = 0,
		PI		= Math.PI/180;
	
	
	var points		= [],
		pointMargin = 4,
		pointLength = 0;
	
	
	
	
	/*subClass
	--------------------------------------------------------------------*/
	/**
	 * 座標オブジェクト
	 * @param {object} _param パラメータ
	 */
	var Point = function(_param){
		this.x 			= _param.x || 0;
		this.y 			= _param.y || 0;
		this.angle 		= _param.angle;
		this.radian		= PI * this.angle;
		this.waveRadian = PI * this.angle;
	},
		PointMember = Point.prototype;
	
	/**
	 * 表示更新
	 */
	PointMember.update = function(){
		var _radian 		= this.radian,
			_waveRadian		= this.waveRadian*17,
			_peak			= 0.038,
			_waveX			= (centerX - this.x - adjustX) * _peak * Math.sin(_waveRadian),
			_waveY 			= (centerY - this.y - adjustY) * _peak * Math.sin(_waveRadian),
			_x 				= centerX + ( radiusX * Math.sin(_radian)),
			_y 				= centerY + ( radiusY * Math.cos(_radian));
				
		this.x = ((_x + _waveX) * 10 | 0) / 10 - adjustX;
		this.y = ((_y + _waveY) * 10 | 0) / 10 - adjustY;
//		this.angle 		= this.angle+0.1;
//		this.waveRadian = PI * this.angle;

		var _c =  ctx;
		_c.lineTo(this.x,this.y);
	};
	
	
	
	
	/*Constructor
   --------------------------------------------------------------------*/
	/**
     * @class INDEX
     * @constructor
     */
	var Balloon = function(_param){
		var _param = _param || {}
		/*Property*/
		this.width 		= _param.width || 175;
		this.height		= _param.height || 143;
		this.maxWidth 	= _param.maxWidth || 444;
		this.maxHeight	= _param.maxHeight || 362;
		this.nextWidth 	= 0;
		this.nextHeight	= 0;
		
		this.nextX 		= 0;
		this.nextY		= 0;
		
		this.lineWidth	= 4;
		this.downforce	= _param.downforce || 0.12;
		this.fillColor 	= "#e4f4ff";
		this.strokeColor= "#007dd4";
		
		this.doAnimation= false;
		
		this.init();
	},
		Member = Balloon.prototype;
	
	
	
	
	/*Public Static Method
	--------------------------------------------------------------------*/
	Member.init = function(){
		var _mw = this.maxWidth,
			_mh = this.maxHeight,
			_margin = this.lineWidth*4 + 50;

		//句形の座標と、円の半径を取得
		radiusX = this.width / 2;
		radiusY = this.height / 2;
		
		winW = _mw + _margin;
		winH = _mh + _margin;
		canvas.width = _mw + _margin;
		canvas.height= _mh + _margin;
		centerX = (_mw >> 1) +  8;
		centerY = (_mh >> 1) + 8;
//		adjustX = (_mw - this.width) /2; 
//		adjustY = (_mh - this.height) /2;
		
		this.createPoints();
		this.draw();
		this.draw();
	};
	
	Member.createPoints = function(){
		var _outerArea = this.width * 2 + this.height * 2;

		//外周からポイント数を算出
		pointLength = _outerArea / pointMargin | 0;
		points = [];
		for(var i=0; i<pointLength; i++){
			points[i] = new Point({
				angle: (360 / pointLength) * i
			});
		};
	};
	
	/**
	 * 描画　下地塗り
	 */
	Member.drawBase	= function(){
		var _c = ctx;
		_c.globalAlpha = 1;
		_c.clearRect(0,0,winW,winH);
		
		_c.globalAlpha 		= 1;
		_c.fillStyle 		= this.fillColor;
		_c.strokeStyle 		= this.strokeColor;
		_c.lineWidth 		= 4;
		_c.lineCap 			= "round";
		_c.shadowColor 		= 'rgba(0, 0, 0, 0.1)';
		_c.shadowBlur 		= 10;
		_c.shadowOffsetX 	= 10;
		_c.shadowOffsetY 	= 10;
	};
	
	/**
	 * 描画　吹き出しのポイント更新
	 */
	Member.pointUpdate = function(){
		var _c 			= ctx,
			_points 	= points,
			_startPoint = _points[0];
		
//		adjustX = ((this.maxWidth - this.width) /2 * 10 | 0) /10;
//		adjustY = ((this.maxHeight - this.height) /2 * 10 | 0) /10;
		
		_startPoint.update();
		_c.beginPath();
		_c.moveTo(_startPoint.x,_startPoint.y);
		for(var i=1; i<pointLength; i=(i+1)|0) _points[i].update();	
		_c.closePath();
		_c.fill();
		_c.shadowColor 	= 'rgba(0, 0, 0, 0)';
		_c.stroke();
	};
	
	/**
	 * 描画一式
	 */
	Member.draw = function(){
		this.drawBase();
		this.pointUpdate();
	};
	
	/**
	 * アニメーション指定のメソッド
	 */
	Member.scaleAnimation = function(_w,_h){
		this.nextWidth 	= _w;
		this.nextheight = _h;
		this.animToNext();
	};
	
	/**
	 * 最大サイズへアニメーション
	 */
	Member.animToNext = function(){
		var _nw = (this.nextWidth-this.width) * this.downforce,
			_nh = (this.nextheight-this.height) * this.downforce;

		this.width += (_nw*10|0)/10;
		this.height+= (_nh*10|0)/10;

		var _abs= Math.abs(this.width - this.nextWidth);
		radiusX = this.width >> 1;
		radiusY = this.height >> 1;

		if(_abs < 2) return false; 
		this.draw();
		window.requestAnimationFrame(this.animToNext.bind(this));
	};
	
	/**
	 * 最大サイズへアニメーション
	 */
	Member.animToNextMax = function(){
		this.scaleAnimation(444,362);
	};

	/**
	 * 最大サイズへアニメーション
	 */
	Member.animToNextMin = function(){
		this.scaleAnimation(175,143);
	};

		
	
	

	
    window.Balloon = Balloon;
})(window, document);


var INDEX = new Balloon();




/*develop object
	--------------------------------------------------------------------*/
/* @object
	 * dat.GUI用オブジェクト
	*/
var GUI = new dat.GUI();
GUI.add(INDEX,"width",10,800).onChange(function(){ INDEX.init() });
GUI.add(INDEX,"height",10,800).onChange(function(){ INDEX.init() });
GUI.add(INDEX,"height",10,800).onChange(function(){ INDEX.init() });
GUI.add(INDEX,"animToNextMax");
GUI.add(INDEX,"animToNextMin");
