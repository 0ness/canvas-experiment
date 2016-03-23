(function () {
	"use strict";

	
	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas 	= document.getElementById("myCanvas"),
		ctx 	= canvas.getContext("2d"),
		perlin 	= new SimplexNoise(),
		lib 	= new Planet();

	
	

	/*var 共通変数
	--------------------------------------------------------------------*/
	var n_iw = window.innerWidth || document.body.clientWidth,  //ウィンドウ幅
		n_ih = window.innerHeight || document.body.clientHeight,//ウィンドウ高さ
		n_PI = (Math.PI/180)*360,
		n_noiseRange = 0,
		n_noiseSeed = 0;




	/*object
	--------------------------------------------------------------------*/
	/* @object paramMaster
	 * 描画処理のパラメータを管理する
	*/
	var param = {
		//描画要素
		spd:4,
		lineWidth:1,
		bgAlpha:0.6,
		composition:"source-over",
		noiseRange:0.1,
		noiseLevel:50,
		radius:50,
		interval:10,
		spreadRange:2000,
		downForce:0.01,
		//色
		fillColor:lib.getRndRGB(200),
		strokeColor:lib.getRndRGB(200),
		bgColor:"#000400",
		//分岐
		flgColor:false,
		flgStroke:true,
		flgFill:false,
		flgArc:false,
		flgBG:false,
		canAnim:true
	};
	
	
	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI(),
		p_spreadRange = gui.add(param,"spreadRange",0,2000),
		p_downForce = gui.add(param,"downForce",0,0.5);
//		p_effectPettern = gui.add(param,'effect',["spreadX","spreadY","spreadXY"]);
	gui.add(param,"spd",0,20,false);
	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.addColor(param, 'bgColor');
	var paramcanAnim = gui.add(param, 'canAnim',false);

	//数値の変更処理
	paramcanAnim.onChange(function(val){
		cancelAnimationFrame(raf);
		setup();
	});
	p_spreadRange.onChange(function(){
		cancelAnimationFrame(raf);
		ctx.clearRect(0,0,n_iw,n_ih);
		setup();
	});

	p_downForce.onChange(function(){
		cancelAnimationFrame(raf);
		ctx.clearRect(0,0,n_iw,n_ih);
		setup();
	});
	

	
	/**
	 * ピクセルクラス
	 */
	function Pixel(a_param){
		var _self = this,
			_param = a_param,
			_range = param.spreadRange,
			_rangeHalf = _range >> 1,
			_rndNum;
		
		_self.color = _param.color;
		_self.nx 	= _param.x;
		_self.ny 	= _param.y;
		_self.size = _param.size;

		_rndNum =  (Math.random()*_range>>0) - _rangeHalf;
//		_rndNum =  (Math.random()*200>>0) - 100;
		_self.x = _rndNum + _self.nx;
		_self.y = _rndNum + _self.ny;
		
//		_self.x = (Math.random()*_range>>0) - _rangeHalf + (n_iw>>1);
//		_self.y = (Math.random()*_range>>0) - _rangeHalf + (n_ih>>1);
//		_self.x = (Math.random()*100) - 50>>0;
//		_self.y = (Math.random()*100) - 50>>0;
//		_self.x = (Math.random()*100) - 50 + (n_iw>>1);
//		_self.y = (Math.random()*100) - 50 + (n_ih>>1);

		_self.downForce = (Math.random()*0.5) / 100 + param.downForce;
		if(_self.downForce < 0.1) _self.downForce = 0.08;
	};
	Pixel.prototype = {
		size		:1,
		color		:null,
		x			:0,
		y			:0,
		nx			:0,
		ny			:0,
		alpha		:0,
		pi			:Math.PI*360,
		downForce	:null,
		isEnd		:false,
		
		draw:function(){
			var _self = this,
				_ctx 	= ctx,
				_size	= _self.size,
				_rad 	= _size>>1,
				_x 		= _self.x + _size,
				_y 		= _self.y + _size;
			
			_ctx.globalAlpha = _self.alpha;
			_ctx.fillStyle = "rgba(0,0,0,0.5)";
			_ctx.fillRect(_self.x+_size-2,_self.y+_size-2,_size,_size);
			_ctx.fillStyle = _self.color;
			_ctx.fillRect(_self.x,_self.y,_size,_size);

//			_ctx.strokeStyle = _self.color;
//			_ctx.beginPath();
//			_ctx.arc(_x,_self.y,_rad,0,_self.pi,false);
//			_ctx.fill();
//			_ctx.stroke();
			_self.motionCheck();
		},
		motionCheck:function(){
			if(this.isEnd === true) return false;
			var _self = this,
				x = _self.x,
				y = _self.y,
				nx = _self.nx,
				ny = _self.ny,
				abs = nx - x,
				df = _self.downForce;
			
//			_self.x += abs * df;
//			_self.y = _self.ny;
			_self.x = _self.x + (nx - x) * df;
			_self.y = _self.y + (ny - y) * df;
			_self.alpha += (1 - _self.alpha) * df;

			abs = lib.abs(abs);
			if(abs < 0.4){
				_self.x = nx;
				_self.y = ny;
				_self.alpha = 1;
				_self.isEnd = true;
			}
		}
	};
	
	
	/**
	 * ピクセル管理
	 */
	function PixelManager(){
		var _self = this;
		_self.img = new Image();
//		_self.img.src = "images/dummy/txt-title.png";
		_self.img.src = "images/gallery/04.jpg";
		
		_self.img.onload = function(){
			_self.imgWidth 	= _self.img.width;
			_self.imgHeight = _self.img.height;
			_self.init();
		};
	};
	PixelManager.prototype = {
		ary			:[],
		img			:null,
		imgWidth	:0,
		imgHeight	:0,
		pixelSize	:20,
		pixelBlank	:15,
		callBack	:null,
		
		init:function(){
			var _self = this,
				_ctx = ctx,
				_img = _self.img,
				_pixelSize 	= _self.pixelSize,
				_pixelBlank = (_self.pixelBlank >= _pixelSize)?_pixelSize-1:_self.pixelBlank,
				_baseW 		= _self.imgWidth,
				_baseH 		= _self.imgHeight,
				_baseX 		= (n_iw>>1) - (_baseW>>1) + (_pixelBlank>>1),
				_baseY 		= (n_ih>>1) - (_baseH>>1) + (_pixelBlank>>1),
				_ary		= _self.ary,
				_wLen 		= _baseW / _pixelSize >>0,
				_hLen 		= _baseH / _pixelSize >>0;

			//ベースイメージ描画
			_ctx.drawImage(_img,_baseX,_baseY);

			//ピクセル取得
			for(var w=0; w<_wLen; w++){
				var w2 = w*_pixelSize;
				
				for(var h=0; h<_hLen; h++){
					var h2 = h*_pixelSize,
						_param = {
							x:w2+_baseX,
							y:h2+_baseY,
							size:_pixelSize-_pixelBlank,
							color:null
						},
						data = _ctx.getImageData(_param.x,_param.y,_pixelSize,_pixelSize).data,
						dataNum = 0;

					//ピクセルの色情報パース
					dataNum = data[0] + data[1] + data[2] + data[3];
					if(dataNum < 100) continue;
					_param.color = "rgba(" + data[0]+","+data[1]+","+data[2]+","+(((data[3]/255*100)>>0)/100)+")";
					_ary.push(new Pixel(_param));
				}
			};
			_ctx.clearRect(0,0,n_iw,n_ih);
			loop();
		},
		draw:function(){
			var _self = this,
				_ctx = ctx,
				_ary = _self.ary,
				_len = _ary.length;
			for(var i=0; i<_len; i++)_ary[i].draw();
		}
	};
	
	
	

	/*flow CANVAS操作
	--------------------------------------------------------------------*/	

	var pm = new PixelManager(),
		raf;
	
	var setup = function(){
		var _ctx = ctx;
		_ctx.clearRect(0,0,n_iw,n_ih);
		_ctx.globalCompositeOperation = param.composition;
		pm.ary = [];
		pm.init();
	};

	var resetup = function(){
		resize();
		setup();
	};

	var noise = function(_seed){
		var num = ( perlin.noise(_seed,0) * param.noiseLevel ) >> 0;
		return num;
	};

	var loop = function(){
		var _ctx = ctx;
		_ctx.globalAlpha = param.bgAlpha;
//		_ctx.drawImage(pm.img,0,0);
		_ctx.fillStyle = "#222";
		_ctx.fillRect(0,0,n_iw,n_ih);
//		ctx.clearRect(0,0,n_iw,n_ih);
		_ctx.globalAlpha = 1;
		pm.draw();
		if(param.canAnim === true) raf = requestAnimationFrame(loop);
	};

	var resize = function(){
		n_iw = window.innerWidth || document.body.clientWidth;
		n_ih = window.innerHeight || document.body.clientHeight;
		canvas.width = n_iw;
		canvas.height = n_ih;
	};




	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);
	resetup();
	
	
	
	return false;
}());
