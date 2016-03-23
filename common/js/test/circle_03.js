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
			circleLength:50,
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
		"use strict";
		var _self 	= this,
			_rangeWidth = param.rangeWidth,
			_rangeHeight= param.rangeHeight,
			_angle = Math.random()*360>>0;
		
		_self.angle	= {
			x:_angle,
			y:_angle
		};
		
		_self.spd 	= (Math.random()*15>>0)*0.005+0.005;
//		_self.spd 	= 0.02;
//		_self.radius= (Math.random()*100>>0)+50;
		_self.radius= {
			x: (Math.random()*_rangeWidth>>1)+_rangeWidth,
			y: (Math.random()*_rangeHeight>>1)+_rangeHeight
		};
		_self.x 	= 0;
		_self.y 	= 0;
		_self.pi 	= numPI / 360;
		_self.color = LIB.getRndRGB_02(155,155,155,100);
		_self.size 	= (param.isRndSize === true)?  (Math.random()*5>>0)+1 : 4;
		_self.next	= undefined;
	},
		CircleMember = Circle.prototype,
		c = null;
	
	
	/**
	 * 円運動
	 */
	CircleMember.rotate = function(){
		var _self 	= this,
			_radius = _self.radius;
		
		_self.angle.x += (_self.spd*param.circleSpd);
		_self.angle.y += (_self.spd*param.circleSpd);
		console.log(_self.angle.x);
		
		_self.x 	= _radius.x * Math.cos(_self.angle.x)+centerPoint.x;
		_self.y 	= _radius.y * Math.sin(_self.angle.y)+centerPoint.y;
	};
	
	/**
	 * 描画
	 */
	CircleMember.draw = function(){
		var _self = this,
			_ctx = ctx,
			_next = _self.next

		_self.rotate();

		_ctx.fillStyle 	= _self.color;
		_ctx.beginPath();
		_ctx.arc(_self.x,_self.y,_self.size,0,numAngle,false);
		_ctx.fill();
		
//		if(_next !== undefined) _next.draw();
	};
	
	CircleMember.nextSet = function(a_circle,a_num){
		var _self = this;
		if(a_num === param.circleLength) return false;
		_self.next = a_circle;
		a_num += 1;
		_self.next.nextSet(new Circle(),a_num);
	};
	
	
	
	
	/*object 円管理オブジェクト
	--------------------------------------------------------------------*/
	var Drawer = function(){
		"use strict";
		var _self = this;
		
		_self.circles 		= [];
		_self.circleLength 	= 0;
		_self.init();
	},
		DrawerMember = Drawer.prototype;
	
	/**
	 * 初期化
	 */
	DrawerMember.init = function(){
		var _self 	= this,
			_len	= param.circleLength,
			_circles= _self.circles;
		
		for(var i=0; i<_len; i++) _circles[i] = new Circle();
		_self.circleLength = _len;

//		c = new Circle();
//		c.nextSet(new Circle(),0);
	};
	
	/**
	 * 描画処理
	 */
	DrawerMember.draw = function(){
		var _self = this,
			_circles = _self.circles,
			_len 	= _self.circleLength;
		
		_self.baseDraw();
		for(var i=0; i<_len; i++) _circles[i].draw();
//		c.draw();
	};
	
	/**
	 * 下地の描画
	 */
	DrawerMember.baseDraw = function(){
		var _ctx = ctx,
			_center = centerPoint;

		_ctx.globalCompositeOperation = "source-over";
		_ctx.fillStyle 	= "rgba(0,0,0,"+ param.globalAlpha +")";
		_ctx.fillRect(0,0,numWidth,numHeight);

		_ctx.globalCompositeOperation = param.composition;
		_ctx.fillStyle 	= "#fff";
		_ctx.beginPath();
		_ctx.arc(_center.x,_center.y,4,0,numAngle,false);
		_ctx.fill();
	};
	
	DRAWER = new Drawer();
	
	
	
	/*function canvas描画
	--------------------------------------------------------------------*/
	function draw(){
		stats.begin();
		DRAWER.draw();
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