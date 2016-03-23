;(function(window, document) {
	"use strict";


	var PERLIN = new SimplexNoise(),
		LIB = new Planet(),
		PARAM = {
			//描画要素
			spd:4,
			lineWidth:1,
			bgAlpha:1,
			composition:"source-over",
			noiseRange:0.1,
			noiseLevel:50,
			radius:50,
			length:60,
			maxSize:10,
			dotDistance:5,
			
			//色
			fillColor:LIB.getRndRGB_02(255,255,255,1),
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
		paramNoiseLevel = gui.add(PARAM, 'noiseLevel',1,300),
		paramNoiseRange = gui.add(PARAM, 'noiseRange',0,1);

	gui.add(PARAM,"length",0,1000).onChange(function(){
		Reset();
	});
	gui.add(PARAM,"maxSize",1,100).onChange(function(){
		Reset();
	});
	gui.add(PARAM,"dotDistance",1,20,false).onChange(function(_val){
		PARAM.dotDistance = _val | 0;
		Reset();
	});
	gui.add(PARAM,"spd",0,20,false);
	gui.add(PARAM,"radius",0,200,false);
	gui.add(PARAM,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.add(PARAM, 'flgStroke',false);
	gui.add(PARAM, 'flgArc');
	gui.add(PARAM, 'flgColor');
	gui.add(PARAM, 'bgAlpha',0,1);
	gui.addColor(PARAM, 'fillColor');
	gui.addColor(PARAM, 'bgColor');
	var paramFlgAnim = gui.add(PARAM, 'flgAnim',false);
	
	
	
	
	/*static property
	--------------------------------------------------------------------*/
	var stage 		= new createjs.Stage("myCanvas"),
		winWidth 	= 0,
		winHeight	= 0,
		particles	= [],
		dotAryLen	= 0,
		elm			= document.getElementById("myCanvas"),
		ctx 		= elm.getContext("2d"),
		unit	 	= 16,
		maxSize		= PARAM.maxSize,
		minSize		= 1,
		PI 			= (Math.PI/180)*360,
		noiseRange 	= 0,
		noiseSeed 	= 0;

	var isWebGLEnabled;
	try {
		isWebGLEnabled = !!WebGLRenderingContext && (!!document.createElement("canvas").getContext("webgl") || !!document.createElement("canvas").getContext("experimental-webgl"));
	}
	catch (e) {
		isWebGLEnabled = false;
	}
	
	alert(isWebGLEnabled);
	
	
	
	/*contents object
	--------------------------------------------------------------------*/
	var Dot = function(_param){
		
		this.x	= _param.x;
		this.y	= _param.y;
//		this.z 	= _param.z;
		
		this.size	= _param.size;
		this.limitY = 0 - _param.size;
		
		this.spdX	= ((Math.random()*50) * 10 |0) / 100 + 1;
		this.spdY	= ((Math.random()*50) * 10 |0) / 100 + 1;
		
		this.angleX	= 0;
		this.angleY	= 0;
		
		this.alpha	= _param.alpha;
		this.scaleSeed  = (Math.random()*2|0)+1;
		
		this.circle= new createjs.Shape();
		this.graphics = this.circle.graphics.beginFill("#0099cc");
//		this.draw = this.graphics.beginFill("#0099cc");
		this.graphics.drawCircle(0,0,this.size);
		stage.addChild(this.circle);
	},
		DotMember = Dot.prototype;
	
	
	// Property
//	DotMember.ctx	= document.getElementById("myCanvas").getContext("2d");
	DotMember.PI	= 3.141592653589793 / 180;
	DotMember.endAngle = DotMember.PI * 360;
	
	
	// Method
	DotMember.Move = function(){
		var _y	= this.y | 0;
		
		this.y = this.y - this.spdY;
		
		this.circle.x = this.x;
		this.circle.y = _y;
//		this.draw.drawCircle(0,0,this.size);
//		this.graphics.beginFill("#0099cc").drawCircle(0,0,this.size);
//		stage.addChild(this.circle);

		if(this.limitY-90 > this.y) this.PositionLoop();
	};
	
	DotMember.PositionLoop = function(){
		this.x = Math.random()*winWidth|0;
		this.y = winHeight + this.size*this.scaleSeed;
		
		if(this.size > 180) return false;
		
		this.size = this.size*this.scaleSeed|0;
		this.limitY = 0 - this.size;
		this.graphics.drawCircle(0,0,this.size);
	};

	


	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @object Canvas
	 */
	var CANVAS = function(){
		Resize();
		addDot();
		window.addEventListener("resize",Resize);
	},
		Member 	= CANVAS.prototype;
	
	
	
	
	/*Method
	--------------------------------------------------------------------*/
	/**
	 * ドット生成
	 */
	var addDot = function(){
		dotAryLen	= PARAM.length;
		particles 		= [];
		
		for(var i=0; i<dotAryLen; i++){
			var _param =  {
				size	:(Math.random()*PARAM.maxSize|0) + minSize,
				x		:(Math.random()*winWidth)|0,
				y		:winHeight + (i*PARAM.dotDistance),
				alpha	:(Math.random()*10|0)/10 + 0.5,
			};
			particles[i] = new Dot(_param);
		}
		
		createjs.Ticker.setFPS(60);
//		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.addEventListener('tick', function(){
			Tick();
		});
	};
	
	/**
	 * リセット
	 */
	var Reset = function(){
		stage.clear();
		addDot();
	};
	
	/**
	 * ループ処理
	 */
	var Tick = function(){
		for(var i =0; i<dotAryLen; ++i){
			var _dot = particles[i];
			_dot.Move();
		};
		stage.update();
	};
	
	/**
	 * リサイズ処理
	 */
	var Resize  = function(){
		var _width 	= window.innerWidth || document.body.clientWidth,
			_height	= window.innerHeight || document.body.clientHeight;
		elm.width 	= _width;
		elm.height	= _height;
		winWidth 	= _width;
		winHeight 	= _height;
	};

	


	window.INDEX = CANVAS;
})(window, document);


var Index = new INDEX();