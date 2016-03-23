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
		Index.Reset();
	});
	gui.add(PARAM,"maxSize",1,100).onChange(function(){
		Index.Reset();
	});
	gui.add(PARAM,"dotDistance",1,20,false).onChange(function(_val){
		PARAM.dotDistance = _val | 0;
		Index.Reset();
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
	var winWidth = 0,
		winHeight= 0;


	
	
	
	/*contents object
	--------------------------------------------------------------------*/
	var Dot = function(_param){
		
		this.x	= _param.x;
		this.y	= _param.y;
//		this.z 	= _param.z;
		
		this.size	= _param.size;
		this.limitY = 0 - _param.size;
		
		this.spdX	= ((Math.random()*40) * 10 |0) / 100 + 1;
		this.spdY	= ((Math.random()*40) * 10 |0) / 100 + 1;
		
		this.angleX	= 0;
		this.angleY	= 0;
		
		this.alpha	= _param.alpha;
		this.scaleSeed  = (Math.random()*2|0)+1;
	},
		DotMember = Dot.prototype;
	
	
	// Property
	DotMember.ctx	= document.getElementById("myCanvas").getContext("2d");
	DotMember.PI	= 3.141592653589793 / 180;
	DotMember.endAngle = DotMember.PI * 360;
	
	
	// Method
	DotMember.Move = function(){
		var _ctx = this.ctx,
			_y	= this.y | 0;
		
		_ctx.beginPath();
		_ctx.arc(this.x,_y,this.size,0,this.endAngle,false);
		_ctx.fill();
		this.y = this.y - this.spdY;

		if(this.limitY > this.y) this.PositionLoop();
	};
	
	DotMember.PositionLoop = function(){
		this.x = Math.random()*winWidth|0;
		this.y = winHeight + this.size*this.scaleSeed;
		if(this.size > 180) return false;
		this.size = this.size*this.scaleSeed|0;
		this.limitY = 0 - this.size;
	};

	


	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @object Canvas
	 */
	var CANVAS = function(){
		var _self = this;
		this.ary	= [];
		this.length = PARAM.length;
		this.rafObj = null;
		this.Init();
		window.addEventListener("resize",_self.Resize.bind(_self));
	},
		Member 	= CANVAS.prototype;

	Member.elm	= document.getElementById("myCanvas");
	Member.ctx 	= Member.elm.getContext("2d");

	Member.maxSize	= PARAM.maxSize;
	Member.minSize	= 1;
	Member.PI 		= (Math.PI/180)*360;

	Member.noiseRange 	= 0;
	Member.noiseSeed 	= 0;



	
	/*Method
	--------------------------------------------------------------------*/
	Member.Init = function(){
		this.Resize();
		this.addDot();
		this.Loop();		
	};
	
	Member.addDot = function(){
		
		this.length	= PARAM.length;
		this.ary 	= [];
		
		for(var i=0; i<this.length; i++){
			var _param =  {
				size:(Math.random()*PARAM.maxSize|0) + this.minSize,
				x:(Math.random()*winWidth)|0,
				y:winHeight + (i*PARAM.dotDistance),
				alpha:(Math.random()*10|0)/10 + 0.5,
			}
			this.ary[i] = new Dot(_param);
		}
	};
	
	Member.Reset = function(){
		var _self = this;
//		window.cancelAnimationFrame(_self.rafObj);
		_self.addDot();
		_self.Loop();
	};
	
	/**
	 * ループ処理
	 */
	Member.Loop = function(){
		var _self 	= this,
			_ary 	= this.ary,
			_len 	= this.length,
			_ctx 	= this.ctx,
			_dot;
		
//		_self.Setting();
//		_ctx.globalAlpha = PARAM.bgAlpha;
//		_ctx.globalCompositeOperation = "source-over";
		_ctx.fillStyle = PARAM.bgColor;
		_ctx.fillRect(0,0,winWidth,winHeight);

//		_ctx.globalCompositeOperation = PARAM.composition;
		_ctx.fillStyle = PARAM.fillColor;
		
		
		for(var i =0; i<_len; ++i){
			_dot = _ary[i];
			_dot.Move();
		};
		
		window.requestAnimationFrame(_self.Loop.bind(_self));
	};
	
	/**
	 * 設定ボイラーテンプレート
	 */
	Member.Setting = function(){
		var _self = this,
			_ctx = _self.ctx;
		
		_ctx.globalAlpha = PARAM.bgAlpha;
		_ctx.globalCompositeOperation = "source-over";
		_ctx.fillStyle = PARAM.bgColor;
		_ctx.fillRect(0,0,winWidth,winHeight);
		
		_ctx.globalCompositeOperation = PARAM.composition;
		_ctx.fillStyle = PARAM.fillColor;
	};
	
	/**
	 * リサイズ処理
	 */
	Member.Resize  = function(){
		var _elm	= this.elm,
			_width 	= window.innerWidth || document.body.clientWidth,
			_height	= window.innerHeight || document.body.clientHeight;
		_elm.width 	= _width;
		_elm.height = _height;
		winWidth 	= _width;
		winHeight 	= _height;
		this.Reset();
	};

	


	window.INDEX = CANVAS;
})(window, document);


var Index = new INDEX();