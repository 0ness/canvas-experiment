"use strict";
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
	
	var DRAWER = null;
	


	/*object Stats用オブジェクト
	--------------------------------------------------------------------*/
	var stats = new Stats();
	stats.setMode( 1 );
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "fixed";
	stats.domElement.style.left = "5px";
	stats.domElement.style.top = "5px";
	
	

	
	/*object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
	var gui = new dat.GUI(),
		param = {
			rangeWidth:200,
			rangeHeight:200,
			circleLength:10,
			circleSpd:1,
			globalAlpha:0.03,
			composition:"source-over",
			isRndSize:false,
		};

	gui.remember(param);
	var paramRangeWidth 	= gui.add(param, 'rangeWidth',100,800),
		paramRangeHeight	= gui.add(param, 'rangeHeight',100,500),
		paramSpd			= gui.add(param, 'circleSpd',0,1),
		paramLength 		= gui.add(param, 'circleLength',1,2000),
		paramComposition 	= gui.add(param, 'composition',["souce-over","xor","lighter","multiply","difference"]),
		paramRndSize		= gui.add(param, 'isRndSize');
	gui.add(param, 'globalAlpha',0,1);
	
	paramSpd.onChange(function(){
		DRAWER.init();
	});
	paramRangeWidth.onChange(function(){
		DRAWER.init();
	});
	paramRangeHeight.onChange(function(){
		DRAWER.init();
	});
	paramLength.onChange(function(){
		DRAWER.init();
	});
	paramRndSize.onChange(function(){
		DRAWER.init();
	});
	

	
	
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
			centerPoint = {x:numWidth/2,y:numHeight/2};
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
	var Circle = function(){
		var _rangeWidth = param.rangeWidth,
			_rangeHeight= param.rangeHeight,
			_angle = Math.random()*360>>0;
		
		this.angle	= {
			x:_angle + (Math.random()*0.6*10|0)/10 - 0.3,
			y:_angle + (Math.random()*0.6*10|0)/10 - 0.3

		};
		
//		this.spd 	= 0.05;
		this.spd 	= ((Math.random()*0.5)*10|0)/100- 0.025;
		this.radius= {
			x: (Math.random()*_rangeWidth>>1)+_rangeWidth,
			y: (Math.random()*_rangeHeight>>1)+_rangeHeight
		};
		this.x 	= 0;
		this.y 	= 0;
		this.pi 	= numPI / 180;
		this.color	= LIB.getRndRGB_02(155,155,155,100);
		this.size 	= (param.isRndSize === true)?  (Math.random()*5>>0)+1 : 4;
		this.next	= undefined;
		
		this.endAngle = -90;
	},
		CircleMember = Circle.prototype,
		c = null;
	
	/**
	 * 円運動
	 */
	CircleMember.rotate = function(){
		var _radius = this.radius,
			_angle 	= this.angle;
		_angle.x 	+= (this.spd * param.circleSpd);
		_angle.y 	+= (this.spd * param.circleSpd);
		this.x 	= _radius.x * Math.cos(_angle.x)+centerPoint.x;
		this.y 	= _radius.x * Math.sin(_angle.x)+centerPoint.y;
	};
	
	/**
	 * 描画
	 */
	CircleMember.draw = function(){
		var _ctx 	= ctx,
			_next 	= this.next,
			_enAngle= (this.pi * this.endAngle * 1000|0) /1000;

		this.endAngle += 3;

		ctx.clearRect(0,0,numWidth,numHeight);

		_ctx.fillStyle = _ctx.strokeStyle = this.color;
		_ctx.lineWidth = 5;
		
		_ctx.beginPath();
		_ctx.arc(centerPoint.x,centerPoint.y,100,this.pi * -90,_enAngle,false);
		_ctx.stroke();
		
		this.mask();
		this.clear();
	};
	
	/**
	 * マスク処理
	 */
	CircleMember.mask = function(){
		var _ctx = ctx,
			_endAngle = this.pi*(this.endAngle-3);
		_ctx.globalCompositeOperation = param.composition;
		
		_ctx.fillStyle = "#0099cc";
		_ctx.beginPath();
		_ctx.moveTo(centerPoint.x,centerPoint.y);
		_ctx.arc(centerPoint.x,centerPoint.y,80,0,_endAngle,false);
		_ctx.closePath();
		_ctx.fill();
		
		_ctx.globalCompositeOperation = "source-over";
	};
	
	/**
	 * 一周ごとにクリア処理
	 */
	CircleMember.clear = function(){
		if(this.endAngle > 270) this.endAngle = -90;
	};
	
	
	var circle = new Circle();
	
	
	
	/*function canvas描画
	--------------------------------------------------------------------*/
	function draw(){		
		stats.begin();
		circle.draw();
		stats.end();
		window.requestAnimationFrame(draw);
	};

	
	

	/*contents 処理分岐
	--------------------------------------------------------------------*/
	resizer.resize();
	win.addEventListener("resize",function(){ resizer.resize(); },false);
	draw();
	
})
//SCRIPT END