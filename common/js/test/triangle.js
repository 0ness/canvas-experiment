$(function(){



	
	/*const 共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win 	= window,
		doc 	= document,
		canvas	= doc.getElementById("myCanvas"),
		ctx		= canvas.getContext("2d"),
		LIB 	= new Planet();

	//数値
	var numPI 	= 3.141592653589793,
		numAngle= numPI<<1;

	
	
	
	/*var 共通変数　このJS内部でグローバルに使う変数
	--------------------------------------------------------------------*/
	var numWidth = win.innerWidth || doc.body.clientWidth,
		numHeight = win.innerHeight || doc.body.clientHeight,
		strStrokeColor = "#ffcc00",
		strFillColor = "#f00",
		centerPoint = {x:numWidth/2,y:numHeight/2};

	
	

	/*object リサイズ用オブジェクト
	--------------------------------------------------------------------*/
	var Resizer = function(){};
	Resizer.prototype = {
		winCheck:function(){
			numWidth = win.innerWidth || doc.body.clientWidth;
			numHeight = win.innerHeight || doc.body.clientHeight;
		},
		canvasResize:function(){
			canvas.width = numWidth;
			canvas.height = numHeight;
			centerPoint = {x:numWidth>>1,y:numHeight>>1};
		},
		resize:function(){
			var _self = this;
			_self.winCheck();
			_self.canvasResize();
		}
	};
	var resizer = new Resizer();

	
	

	/*object 円操作オブジェクト
	--------------------------------------------------------------------*/
	var Circle = function(a_angle){
		"use strict";
		var _self 	= this;
		_self.angle	= a_angle;
		_self.spd 	= (Math.random()*10>>0)*0.005+0.005;
//		_self.spd 	= 0.02;
//		_self.radius= (Math.random()*100>>0)+50;
		_self.radius= (Math.random()*100>>0)+50;
		_self.x 	= 0;
		_self.y 	= 0;
		_self.pi 	= numPI / 360;
		_self.color = LIB.getRndRGB();
		_self.size 	= 4;
		
		_self.rotate();
	};

	Circle.prototype = {
		rotate:function(){
			var _self 	= this,
				_radius = _self.radius;
			_self.angle += _self.spd;
			_self.x 	= _radius * Math.cos(_self.angle)+centerPoint.x;
			_self.y 	= _radius * Math.sin(_self.angle)+centerPoint.y;
		},
		draw:function(){
			var _self = this,
				_ctx = ctx;
			
			_self.rotate();
			
			_ctx.fillStyle 	= _self.color;
			_ctx.beginPath();
			_ctx.arc(_self.x,_self.y,_self.size,0,numAngle,false);
			_ctx.closePath();
			_ctx.fill();
		}
	};

	var circle_01 = new Circle(0),
		circle_02 = new Circle(90),
		circle_03 = new Circle(180);

	
	
	
	/*object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
	var gui = new dat.GUI();
	gui.remember(circle_01);
	gui.add(circle_01, 'radius',0,500);
	gui.add(circle_01,'spd',0.001,0.05);
	gui.add(circle_01, 'size',0.5,50);
	gui.addColor(circle_01, 'color');

	
	
	
	/*function canvas描画
	--------------------------------------------------------------------*/
	function draw(){
		var _ctx 	= ctx,
			_cir_01 = circle_01,
			_cir_02 = circle_02,
			_cir_03 = circle_03;

//		_ctx.clearRect(0,0,numWidth,numHeight);
		_ctx.fillStyle = "#333";
		_ctx.fillRect(0,0,numWidth,numHeight);
		
//		_cir_01.rotate();
//		_cir_02.rotate();
//		_cir_03.rotate();
		
		_ctx.fillStyle 	= "#ffcc00";
		_ctx.beginPath();
		_ctx.moveTo(_cir_01.x,_cir_01.y);
		_ctx.lineTo(_cir_02.x,_cir_02.y);
		_ctx.lineTo(_cir_03.x,_cir_03.y);
		_ctx.closePath();
		_ctx.fill();
		
		
		var _point12 = {
			x:(_cir_01.x + _cir_02.x) / 2,
			y:(_cir_01.y + _cir_02.y) / 2,
		},
			_point13 = {
			x:(_cir_01.x + _cir_03.x) / 2,
			y:(_cir_01.y + _cir_03.y) / 2,
		},
			_point23 = {
			x:(_cir_02.x + _cir_03.x) / 2,
			y:(_cir_02.y + _cir_03.y) / 2,
		},
			_centerX = (_cir_01.x + _cir_02.x + _cir_03.x) / 3,
			_centerY = (_cir_01.y + _cir_02.y + _cir_03.y) / 3;
		
		_ctx.fillStyle 	= "#0099cc";
		_ctx.beginPath();
		_ctx.arc(_point12.x,_point12.y,5,0,numAngle,false);
		_ctx.closePath();
		_ctx.fill();
		_ctx.beginPath();
		_ctx.arc(_point13.x,_point13.y,5,0,numAngle,false);
		_ctx.closePath();
		_ctx.fill();
		_ctx.beginPath();
		_ctx.arc(_point23.x,_point23.y,5,0,numAngle,false);
		_ctx.closePath();
		_ctx.fill();
		_ctx.beginPath();
		_ctx.arc(_centerX,_centerY,5,0,numAngle,false);
		_ctx.closePath();
		_ctx.fill();

		
		
		window.requestAnimationFrame(draw);
	};

	
	

	/*contents 処理分岐
	--------------------------------------------------------------------*/
	resizer.resize();
	win.addEventListener("resize",function(){ resizer.resize(); },false);
	draw();
	
})
//SCRIPT END