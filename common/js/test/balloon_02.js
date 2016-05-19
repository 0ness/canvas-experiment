;(function(window, document) {
    "use strict";

	
	var canvas 	= document.getElementById("myCanvas"),
		ctx		= canvas.getContext("2d"),
		LIB		= new Planet(),
		winW	= LIB.getWindowWidth(),
		winH	= LIB.getWindowHeight(),
		rectX	= 0,
		rectY 	= 0,
		centerX	= 0,
		centerY = 0,
		radiusX = 0,
		radiusY = 0,
		PI		= Math.PI/180;
	
	
	var points		= [],
		pointMargin = 10,
		pointLength = 0,
		balloonArea	= 0;
	
	
	var Point = function(_param){
		this.x 	= _param.x || 0;
		this.y 	= _param.y || 0;
		this.vx	= _param.vx || (Math.random()*2*10|0) / 10;
		this.vy	= _param.vy || (Math.random()*2*10|0) / 10;
		
		this.rx = _param.rx || 0;
		this.ry = _param.rx || 0;
		this.rw = _param.rw || 0;
		this.rh = _param.rh || 0;
		
		this.angle 		= _param.angle;
		this.radian		= PI * this.angle;
		this.waveRadian = PI * this.angle;
		this.roundLevel = 0;
		this.adjustRoundPoint();
	},
		PointMember = Point.prototype;
	PointMember.roundScale = 40;
	
	/**
	 * 表示更新
	 */
	PointMember.update = function(){
		var _radian 		= this.radian,
			_roundNoise		= (Math.random()*0.1*100|0)/100,
//			_roundMargin	= (_roundNoise + this.roundLevel) * this.roundScale,
			_roundMargin	= 0,
			_waveRadian		= this.waveRadian*18,
			_waveRange		= 2,
			_dx		= (centerX - this.x) * 0.05,
			_dy		= (centerY - this.y) * 0.05,
			_px		= _dx * Math.sin(_waveRadian),
			_py 	= _dy * Math.sin(_waveRadian),
//			_px2	= -_waveRange/2 * Math.sin(_waveRadian),
//			_py2 	= _waveRange/2 * Math.cos(_waveRadian),
			_x 		= centerX + ((_roundMargin + radiusX) * Math.sin(_radian)),
			_y 		= centerY + ((_roundMargin + radiusY) * Math.cos(_radian));
		
//		if(_x < this.rx) _x = this.rx;
//		else if(_x > (this.rx+this.rw))_x = this.rx+this.rw;
//		if(_y < this.ry) _y = this.ry;
//		else if(_y > (this.ry+this.rh)) _y = this.ry+this.rh;
		
		this.x = ((_x + _px) * 100 | 0) / 100;
		this.y = ((_y + _py) * 100 | 0) / 100;
//		this.angle 		= this.angle+0.1;
//		this.waveRadian = PI * this.angle;
		this.draw();
	};
	
	/**
	 * 描画
	 */
	PointMember.draw = function(){
		var _c =  ctx;
		_c.lineTo(this.x,this.y);
//		_c.beginPath();
//		_c.arc(this.x,this.y,2,0,PI,false);
//		_c.stroke();
	};
	
	/**
	 * 角丸付近のポイントの座標調整
	 */
	PointMember.adjustRoundPoint = function(){
		var _angle = this.angle,
			_roundLevel = ( _angle - 90 )/ 90;
		
		//吹き出し型の楕円にする為の計算
		_roundLevel += 0.5;
		_roundLevel = parseFloat("."+(String( _roundLevel )).split(".")[1]);
		_roundLevel = (Math.abs(_roundLevel - 0.5)*100 | 0)/100;
		
		//45と90の倍数の角度の計算
		if(!_roundLevel) {
			if(_angle%90 ===0) _roundLevel = 0;
			else _roundLevel = 0.45;
		}
//		console.log(_angle,_roundLevel);
		this.roundLevel = _roundLevel;
	};
	
	
	
	
	var drawBaseBg	= function(){
		var _c = ctx;
		_c.globalAlpha = 1;
		_c.fillStyle = "#111";
		_c.fillRect(0,0,winW,winH);
		_c.globalAlpha = 1;
	};
	
	var addBaseRect = function(){
		var _x = 100,
			_y = 100,
			_w = 400,
			_h = 300;
		
		//矩形描画
//		ctx.fillStyle = "#fff";
//		ctx.fillRect(_x,_y,_w,_h);
		
		//句形の座標と、円の半径を取得
		radiusX = _w / 2;
		radiusY = _h / 2;
		centerX = _w / 2 + _x;
		centerY = _h / 2 + _y;
		
		ctx.fillStyle = ctx.strokeStyle = "#ccc";
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		ctx.fillRect(centerX,centerY,5,5);
		
		//外周からポイント数を算出
		balloonArea = _w*2 + _h*2;
		pointLength = balloonArea / pointMargin | 0;
		for(var i=0; i<pointLength; i++){
			points[i] = new Point({
				angle: (360 / pointLength) * i,
				rx:_x,
				ry:_y,
				rw:_w,
				rh:_h
			});
		};
		
	};
	
	var updatePoints = function(){
		var _c = ctx,
			_p,
			_radian,
			_points 	= points,
			_startPoint = _points[0];
		
		_startPoint.update();
		_c.beginPath();
		_c.moveTo(_startPoint.x,_startPoint.y);
		for(var i=1; i<pointLength; i=(i+1)|0) _points[i].update();	
		_c.closePath();
		_c.stroke();
	};
	
	var draw = function(){
		drawBaseBg();
		updatePoints();
//		window.requestAnimationFrame(draw);
	};
	
	
	var resize = function(){
		winW = LIB.getWindowWidth();
		winH = LIB.getWindowHeight();
		canvas.width = winW;
		canvas.height= winH;
	};
	
	
	
	
	window.addEventListener("resize",resize);
	resize();
	addBaseRect();
	draw();
	draw();




   /*Constructor
   --------------------------------------------------------------------*/
    /**
     * @class INDEX
     * @constructor
     */
    var Index = function() {},
        Member = Index.prototype;




    /*Private Static Property
	--------------------------------------------------------------------*/




    /*Public Static Method
	--------------------------------------------------------------------*/
	Member.init = function() {};





    window.Index = Index;
})(window, document);
