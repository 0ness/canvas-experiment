(function () {
	"use strict";

	
	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas 	= document.getElementById("myCanvas"),
		ctx 	= canvas.getContext("2d"),
		NOISE 	= new SimplexNoise(),
		LIB 	= new Planet(),
		MANAGER	= null;

	
	

	/*var 共通変数
	--------------------------------------------------------------------*/
	var winWidth 	= window.innerWidth || document.body.clientWidth,  //ウィンドウ幅
		winHeight 	= window.innerHeight || document.body.clientHeight,//ウィンドウ高さ
		mathPI 		= (Math.PI/180)*360,
		noiseRange 	= 0,
		noiseSeed 	= 0;




	/*object
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

	
	/* @object paramMaster
	 * 描画処理のパラメータを管理する
	*/
	var param = {
		//描画要素
		lineWidth:1,
		bgAlpha:1,
		composition:"lighter",
		noiseRange:0.1,
		noiseLevel:50,
		//色
		fillColor:LIB.getRndRGBA(80,80,80,0.8),
		strokeColor:LIB.getRndRGBA(200),
		bgColor:LIB.getRndRGB(20,20,20),
		//分岐
		flgStroke:true,
		flgFill:false,
		flgBG:false,
		flgAnim:false
	};

	
	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI(),
		paramNoiseLevel = gui.add(param, 'noiseLevel',1,300),
		paramNoiseRange = gui.add(param, 'noiseRange',0,0.1);

	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	var paramFlgAnim = gui.add(param, 'flgAnim',false);

	//数値の変更処理
	paramNoiseLevel.onChange(function(val){
		param.noiseLevel = val>>0;
		setup();
	});
	paramNoiseRange.onChange(function(val){
		param.noiseRange = Math.round(val * 1000) / 1000;
		setup();
	});
	paramFlgAnim.onChange(function(val){
		param.flgAnim = val;
		loop();
	});

	
	
	
	/*class
	--------------------------------------------------------------------*/
	var Moon = function(a_prop){
		var _self = this,
			_prop = a_prop;
		
		/* インスタンスメンバ */
		_self.grid	= {
			x		:_prop.x,
			y		:_prop.y,
			color	:"#ffffff"
		};
		_self.obj 	= {
			x		:_prop.x + (_self.gridWidth >>1),
			y		:_prop.y + (_self.gridHeight >>1),
			size	:10,
			color	:param.fillColor,
			angle	:_prop.angle,
			pi		:_self.getArc(_prop.angle)
		};

	},
		MoonMember = Moon.prototype;
		
	/* クラスメンバ */
	MoonMember.gridWidth 	= 80;
	MoonMember.gridHeight 	= 80;
	MoonMember.pi 	= Math.PI*360;
	MoonMember.draw	= function(){
		var _self 	= this,
			_ctx 	= ctx,
			_grid 	= _self.grid,
			_obj 	= _self.obj,
			_rndNumX = Math.random()*20,
			_rndNumY = Math.random()*20,
			_rndNumX_02 = Math.random()*10,
			_rndNumY_02 = Math.random()*10;
		
		_ctx.fillStyle 	= _obj.color;
		_ctx.strokeStyle= _obj.color;
		
		_ctx.beginPath();
		_ctx.arc(_obj.x +_rndNumX,_obj.y +_rndNumY,_obj.size,0,_obj.pi,false);
		_ctx.closePath();
		_ctx.stroke();

		_ctx.beginPath();
		_ctx.arc(_obj.x,_obj.y,_obj.size,0,_obj.pi,false);
		_ctx.closePath();
		_ctx.fill();

		_ctx.beginPath();
		_ctx.arc(_obj.x+_rndNumX_02,_obj.y+_rndNumY_02,_obj.size,0,_obj.pi,false);
		_ctx.closePath();
		_ctx.fill();


//		_ctx.arc(_obj.x +_rndNum,_obj.y +_rndNum,_obj.size,0,_obj.pi,false);
//		_ctx.arc(_obj.x + _rndNum02,_obj.y + _rndNum02,_obj.size,0,_obj.pi,false);
		
//		_obj.angle+=10;
//		_obj.pi = _self.getArc(_obj.angle);
		
	};
	MoonMember.getArc = function(a_num){
		var _pi 	= Math.PI / 180,
			_radian	= a_num *_pi,
			_radius = (360 * Math.sin(_radian)),
			_arc 	= _radius * _pi;
		if(_arc < 0)_arc *= -1;
		return _arc;
	};

	
	
	var MoonManager = function(){
		this.init();
	},
		ManagerStatic = MoonManager.prototype;
	
	ManagerStatic.arr 	= [];
	ManagerStatic.len 	= 0;
	ManagerStatic.init 	= function(){
		var _self = this,
			_moon 	= MoonMember,
			_arr	= _self.arr,
			_len	= _arr.length,
			_hLen	= 1 + (winHeight / _moon.gridHeight)>>0,
			_vLen	= 1 + (winWidth / _moon.gridWidth)>>0,
			_count	= 0,
			_angleCount = Math.random()*360 >>0,
			_level  =  (Math.random()*10 >>0) + 1;
		
		for(var i=0; i<_vLen; i++){
			for (var l = 0; l < _hLen; l++) {
				var _obj = new Moon({
					x:i*_moon.gridWidth,
					y:l*_moon.gridHeight,
//					pi:_self.getArc(_count),
					angle:(_angleCount * _level)
				});
				_arr[_count] = _obj;
				_count++;
				_angleCount++;
			}
		}
	};
	ManagerStatic.draw 	= function(){
		var _self = this,
			_arr	= _self.arr,
			_len	= _arr.length;
		for (var i = 0; i < _len; i++) _arr[i].draw();
	};
	
	
	


	/*flow CANVAS操作
	--------------------------------------------------------------------*/
	/* 初期化 */
	var setup = function(){
		var _self = this;
		resize();
		MANAGER = new MoonManager();
		loop();
	};

	/* リセット */
	var resetup = function(){
		resize();
		setup();
	};

	/* ノイズ関数 */
	var noise = function(_seed){
		var _num = ( NOISE.noise(_seed,0) * param.noiseLevel ) >> 0;
		return _num;
	};

	/* 描画 */
	var draw = function(){
		var _ctx = ctx,
			_param = param;

		_ctx.fillStyle 		= _param.bgColor;
//		_ctx.fillStyle 		= "#000000";
		_ctx.globalAlpha 	= _param.bgAlpha;
		_ctx.globalCompositeOperation = "source-over";
		_ctx.fillRect(0,0,winWidth,winHeight);

		_ctx.globalAlpha = 1;
		_ctx.globalCompositeOperation = _param.composition;
	};

	/* ループ関数 */
	var loop = function(){
		stats.begin();
		draw();
		MANAGER.draw();
		stats.end();
		if(param.flgAnim === true) window.requestAnimationFrame(loop);
	};

	/* リサイズ */
	var resize = function(){
		winWidth 	= window.innerWidth || document.body.clientWidth;
		winHeight 	= window.innerHeight || document.body.clientHeight;
		canvas.width 	= winWidth;
		canvas.height	= winHeight;
	};




	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);

	
	setup();
	
}());
