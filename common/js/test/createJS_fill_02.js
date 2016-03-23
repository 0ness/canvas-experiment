
(function (window,document) {
	"use strict";

	var stats;
	
	var Particle = function(_param){
		var _self = this;
		
		/*Property*/
		this.stageWidth 		= 0;
		this.stageHeight		= 0;
		this.particles			= [];
		this.particleColor		= "";
		this.particleEndPoint	= 400;
		this.particleLimitScale	= 0;
		this.particleRotateAngle= 0;
		this.spriteImgSrc		= "";
		this.spriteSheet		= null;
		this.spriteContainer	= null;
		this.isParticleRotate 	= false;

		console.log("constructor");

		this.Resize();
		this.SetCategoryColor(_param.category);
		this.TypeSelect(_param.type);
		
		this.image.onload = _self.Init.bind(_self);
		this.image.src 	= this.spriteImgSrc;
	},
		Member = Particle.prototype;
	
	
	
	
	/*Static Property
	--------------------------------------------------------------------*/
	Member.canvas	= document.getElementById("myCanvas");
	Member.ctx		= Member.canvas.getContext("2d");
	Member.stage	= new createjs.SpriteStage(Member.canvas);
	Member.image	= new Image();
	
	
	
	
	/*Method
	--------------------------------------------------------------------*/
	/**
	 * 処理開始
	 */
	Member.Init		= function(){
		var _self = this;
		console.log("init");

		stats = new Stats();
		stats.setMode(1);
		stats.domElement.style.position = "fixed";
		stats.domElement.style.right 	= "0px";
		stats.domElement.style.top 		= "0px";
		document.body.appendChild(stats.domElement);
		
		var isWebGLEnabled;
		isWebGLEnabled = !!WebGLRenderingContext && (!!document.createElement("canvas").getContext("webgl") || !!document.createElement("canvas").getContext("experimental-webgl"));

		
		// SpriteSheet
		var _data 	= {
			images	:[this.image],
			frames	:{
				width	:400,
				height	:400,
				regX	:200,
				regY	:200
			}
		};
		
		// Container
		this.spriteSheet 	= new createjs.SpriteSheet(_data);
		this.spriteContainer= new createjs.SpriteContainer(this.spriteSheet);

		//filter
		var _color	= this.HexToRgb("#0099cc"),
			_r		= _color.red,
			_g		= _color.green,
			_b		= _color.blue;
		
		this.colorFilter = new createjs.ColorFilter(_r,_g,_b,1);
		this.stage.addChild(this.spriteContainer);	

		//tick start
		for (var n = 0; n < 180; n++) _self.Emit();
//		_self.Tick();
		
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", function () { return _self.Tick(); });

//		createjs.Ticker.setFPS(32);
//		createjs.Ticker.addEventListener("tick", function () { return _self.Tick(); });
		window.addEventListener("resize",_self.Resize.bind(_self));
	};
	
	/**
	 * カテゴリーの色を取得
	 * @param   {String} _category カテゴリ名
	 */
	Member.SetCategoryColor	= function(_category){
		console.log("category");
		var _color = "";
		if(_category === "development") _color = "#269acc";
		else if(_category === "electronics") _color = "#bf8ab0";
		else if(_category === "global") _color = "#145698";
		else if(_category === "living") _color = "#82bb8f";
		else if(_category === "infomation") _color = "#e7b759";
		this.particleColor =  _color;
	};
	
	/**
	 * パーティクルの種類を指定
	 * @param {String} _type 種類を指定する為の文字列、無い場合はランダムになる
	 */
	Member.TypeSelect	= function(_type){
		console.log("typeSelect");
		if( !_type ) {
			var _types	= ["arc","square","triangle"],
				_type	=  _types[ Math.floor( Math.random() * _types.length )];
		}
		if(_type === "arc"){
			this.particleLimitScale = 0.78;
			this.spriteImgSrc	= "images/createJS/particle_simple.png";
		}else if(_type === "square"){
			this.particleLimitScale = 0.78;
			this.spriteImgSrc	= "images/createJS/particle_square.png";
			if(Math.random()*10 > 5) this.isParticleRotate = true;
		}else if(_type === "triangle"){
			this.particleLimitScale = 0.88;
			this.spriteImgSrc		= "images/createJS/particle_tri.png";
			this.isParticleRotate 	= true;
		}
	};
	
	/**
	 * HEX値からRGB値に変換
	 * @param   {String} _hex 変換したいHEX値
	 * @returns {Object} 返還後の戻りRGB値
	 */
	Member.HexToRgb = function(_hex){
		// source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		// Expand shorthand form (e.g."03F") to full form (e.g."0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		_hex = _hex.replace(shorthandRegex, function (m, r, g, b) {
			return r + r + g + g + b + b;
		});
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
		return {
			red: parseInt(result[1], 16)/255,
			green: parseInt(result[2], 16)/255,
			blue: parseInt(result[3], 16)/255
		};
	};
	
	/**
	 * エンターフレーム処理
	 */
	Member.Tick = function(){
		var _self 	= this,
			_ctx	= this.ctx;
		
//		_ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
//		_ctx.fillRect(0,0,this.stageWidth,this.stageHeight);

		// Color
//		this.hue += 0.5;
//		this.hue = this.hue % 360;
//		this.hsv.hue = this.hue;
//		this.hsv.saturation = 0.8;
//		this.hsv.value = 0.8;
//		var rgb = ColorUtils.ColorHelper.hsvToRgb(this.hsv);
//		this.colorFilter.redMultiplier = rgb.red;
//		this.colorFilter.greenMultiplier = rgb.green;
//		this.colorFilter.blueMultiplier = rgb.blue;

		
		this.Update();
		this.stage.update();
//		stats.update();
//		window.requestAnimationFrame(_self.Tick.bind(_self));
	};

	/**
	 * パーティクルを生成する
	 */
	Member.Emit = function() {
		var _light 	= new createjs.Sprite(this.spriteSheet, Math.random() * 3 >> 0),
			_id 	= this.particles.length - 1,
			_particle = {
				id		:0,
				light	:null,
				x		:0,
				y		:0,
				speed	:0,
				gravity	:0,
				isLived	:true,
				rotate	:((Math.random()*4 - 2)*10|0)/10 
			};

		_particle.id 		= _id;
		_particle.x 		= Math.random() * this.stageWidth;
		_particle.y 		= this.stageHeight + (_id * 20);
		_particle.speed 	= 0;
		_particle.gravity	= ((Math.random() * 0.1)*100|0)/100;

		//パーティクル実体
		var _scale = (((Math.random() * 0.01 * _id)*100|0)/100);
//		light.alpha	= 0.6;
		_light.stop();
		_light.x 		= _particle.x;
		_light.y 		= _particle.y;
		_light.scaleX	= _light.scaleY = (_scale > this.particleLimitScale)? this.particleLimitScale:_scale;
		_particle.light = _light;

		this.particles.push(_particle);
		this.spriteContainer.addChild(_light);
	};

	/**
 	* アップデート処理
 	*/
	Member.Update = function() {
		var _particles	= this.particles,
			_max	 	= _particles.length,
			_limit		= -this.particleEndPoint,
			_isRotate	= this.isParticleRotate,
			_particle;

		for (var n = 0; n < _max; n++) {
			_particle 		= _particles[n];
//			_particle.speed += _particle.gravity;
//			_particle.y 	= _particle.light.y = (_particle.y - _particle.speed)|0;
//			if(_isRotate) _particle.light.rotation += _particle.rotate;

			if (_particle.scaleX > _limit) continue;
//			_particle.y			= _particle.light.y	= this.stageHeight + 200;
//			_particle.speed 	= (_particle.speed * 0.5 * 10 |0)/10;
		}
	};

	/**
	 * リサイズ処理
	 */
	Member.Resize = function(){
		var _width 	= window.innerWidth || document.body.clientWidth,
			_height	= window.innerHeight || document.body.clientHeight,
			_canvas = this.canvas;
		_canvas.width 	= this.stageWidth 	= _width;
		_canvas.height	= this.stageHeight	= _height;
	};

	
	
	window.Particle = Particle;
}(window,document));


var categories = ["development","electronics","global","living","infomation"];

window.addEventListener("load",function(){
	var INDEX = new Particle({
		category:categories[ Math.floor( Math.random() * categories.length )]
	});
});
