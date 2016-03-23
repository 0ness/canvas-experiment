/*==============================================================================

	サイト内部　機能・演出用

	・基本の状態を維持する必要は無く、プロジェクトによってカスタマイズする
	・機能実装→演出実装→最適化処理のフローで構築

==============================================================================*/




//SCRIPT START
function init(){


	/*const 共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window;
	var doc = document;
	var canvas = doc.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	var n_PI = Math.PI*2;
	var n_Angle = n_PI<<1;


	/*var 共通変数　このJS内部でグローバルに使う変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
	var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ


	/*function 拡張　requestAnimFrame()
	--------------------------------------------------------------------*/
	win.requestAnimFrame = (function(){
		return	win.requestAnimFrame ||
				win.webkitRequestAnimFrame ||
				win.mozRequestAnimFrame ||
				win.msRequestAnimFrame ||
				function(callback,element){
					win.setTimeout(callback,1000/60);
				};
	})();


	/*object Stats用オブジェクト
	--------------------------------------------------------------------*/
	var stats = new Stats();
	stats.setMode( 0 );
	doc.body.appendChild( stats.domElement );
	stats.domElement.style.position = "fixed";
	stats.domElement.style.right = "0";
	stats.domElement.style.bottom = "5px";


	/*オブジェクト
	--------------------------------------------------------------------*/

	/* @object paramMaster
	 * 描画処理のパラメータを管理する
	*/
	function ParamMaster(){

		this.length = 400;
		this.radius = 1.6;
		this.colorRange = 90;
		this.blinkExpantion = 1.3;
		this.blinkFPS = 2;
		this.blinkGain = 1;

		this.afterImg = 1;
		this.composition = "source-over";

		//塗りの色
		var s_r = (Math.random()*200)>>0;
		var s_g = (Math.random()*200)>>0;
		var s_b = (Math.random()*200)>>0;
		this.fillColor = "rgba("+s_r+", "+s_g+", "+s_b+",1)";
		this.strokeColor = "rgb("+s_r+", "+s_g+", "+s_b+")";

		//背景色
		var r = (Math.random()*20)>>0;
		var g = (Math.random()*20)>>0;
		var b = (Math.random()*30)>>0;
		var bgColor = "rgb("+r+", "+g+", "+b+")";
		this.bgColor = {r:r,g:g,b:b};
		this.bgColorObj = bgColor;

		canvas.style.backgroundColor = bgColor;

		//分岐フラグ
		this.flgStroke = true;
		this.flgFill = false;
		this.flgAfterImg = false;
		this.flgBlink = true;

		return false;
	}

	var param = new ParamMaster();
	var gui = new dat.GUI();

	var paramLength =  gui.add(param,"length",1,3000);
	var paramRadius = gui.add(param,"radius",0.5,4);
	var paramColorRange = gui.add(param,"colorRange",0,255);
	gui.add(param,"flgBlink");
	gui.add(param,"blinkExpantion",1,3);
	gui.add(param,"blinkFPS",1,20);
	gui.add(param,"blinkGain",1,3);
	gui.add(param,"flgAfterImg");
	var paramAfterImg = gui.add(param,"afterImg",0,1);
	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	var paramBGColor = gui.addColor(param,"bgColor");

	paramLength.onChange(function(val){
		param.length = val;
		sf_01.init(val);
	});
	paramRadius.onChange(function(val){
		param.radius = val;
		sf_01.init();
	});
	paramColorRange.onChange(function(val){
		param.colorRange = val;
		var ary = sf_01.ary;
		for(var i = 0,len = sf_01.length; i<len; i++){
			var rndColor = param.colorRange;
			var baseColor = 255 - rndColor;
			var s_r = (Math.random()*rndColor) + baseColor >>0;
			var s_g = (Math.random()*rndColor) + baseColor >>0;
			var s_b = (Math.random()*rndColor) + baseColor >>0;
			var s_rgb = "rgb("+s_r+", "+s_g+", "+s_b+")";
			ary[i].fillColor = s_rgb;
		}
	});
	paramBGColor.onChange(function(val){
		var r = val.r >> 0;
		var g = val.g >> 0;
		var b = val.b >> 0;
		var bgColor = "rgb("+r+", "+g+", "+b+")";
		canvas.style.backgroundColor = bgColor;
	});
	paramAfterImg.onChange(function(val){

	});


	/*object
	--------------------------------------------------------------------*/

	/* @object
	 * 星を一括管理するクラス 
	*/
	function StarField(_len){
		var len = _len;
		this.init(len);
		return false;
	};
	StarField.prototype = {
		length:300,
		width:0,
		heigth:0,
		c:10,
		ary:[],
		averageRadius:4,

		init:function(_len){

			var that = this;
			that.length = _len || param.length;
			that.ary = (function(){
				var ary = [];
				var n_averageRadius = param.radius;
				for (var i = 0,len = that.length; i < len; i++) {
					var x = Math.random()*n_iw >>0;
					var y = Math.random()*n_ih >>0;
					var r = organicAverage(n_averageRadius,2);
					var star = new StarChild(x,y,r);
					ary[i] = star;
				}
				return ary;
			}());

			return false;
		},
		update:function(){
			var ary = this.ary;
			var star;
			for (var i = 0,len = this.length; i < len; i++) {
				star = ary[i];
				star.update();
			}
			return false;
		}
	};

	/*
	@object
	*/
	function StarChild(_x,_y,_r){
		this.x = _x || this.x;
		this.y = _y || this.y;
		this.radius = _r || this.radius;
		this.init();
		return false;
	};
	StarChild.prototype = {
		x:0,
		y:0,
		radius:4,
		maxRadius:0,
		minRadius:0,
		fillColor:"#fff",
		blinkType:0,
		blinkFPS:0,
		blinkInterval:0,
		blinkVector:true,

		init:function(){

			this.nowRadius = this.radius;
			this.maxRadius = this.radius * param.blinkExpantion;
			this.minRadius = this.radius * (param.blinkExpantion - 1);
			
			var n_type = Math.random()*1*10 >> 0;
			if(n_type > 8) this.blinkType = 0;
			else if(n_type > 6) this.blinkType = 1;
			else this.blinkType = 2;
			this.blinkFPS = Math.random()*param.blinkFPS >> 0;
			this.blinkInterval = organicAverage(10,6) * 0.04;

			var rndColor = param.colorRange;
			var baseColor = 255 - rndColor;
			var s_r = (Math.random()*rndColor) + baseColor >>0;
			var s_g = (Math.random()*rndColor) + baseColor >>0;
			var s_b = (Math.random()*rndColor) + baseColor >>0;
			this.fillColor = "rgb("+s_r+", "+s_g+", "+s_b+")";

			return false;
		},
		
		update:function(){
			var c = ctx;
			var that = this;
			that.blink();
			c.fillStyle = that.fillColor;
			c.beginPath();
			c.arc(that.x,that.y,that.nowRadius,0,n_Angle,false);	
			c.fill();
			return false;
		},
		
		blink:function(){
			
			if(this.blinkCheck() === false) return false;
			if(this.blinkType === 0) this.blinkPettern();
			else if(this.blinkType === 1) this.blinkPettern_02();
			
			return false;
		},
		
		blinkPettern:function(){
			//常にランダムの値に移ろう
			this.maxRadius = this.radius * param.blinkExpantion;
			var deff = this.maxRadius - this.radius;
			var deff_02 = Math.random()*deff - (deff/2);
			this.nowRadius = this.radius + deff_02;
			if(this.nowRadius < 0) this.nowRadius = 0.05;
			
			return false;
		},
		blinkPettern_02:function(){
			//目標の値へ遷移する
			var n_radius = this.radius;
			this.maxRadius = n_radius * param.blinkExpantion;
			this.minRadius = n_radius - (this.maxRadius - n_radius);
			this.minRadius = (this.minRadius < 0)? 0.05 : this.minRadius;
			var n_purperse = (this.blinkVector === true) ? this.maxRadius : this.minRadius;
			this.nowRadius += (n_purperse - this.nowRadius) * (this.blinkInterval * param.blinkGain);
			var deff = Math.abs(n_purperse - this.nowRadius);
			if(deff < 0.05) this.blinkVector = !this.blinkVector;
			
			return false;
		},
		
		/* @method
		 * 点滅の実行条件を確認、判定結果を戻り値で返す
		 * @return flg{boolean}
		*/
		blinkCheck:function(){
			var flg = true;
			var that = this;
			if(param.flgBlink === false) flg = false;
			if(this.blinkFPS < param.blinkFPS){
				this.blinkFPS++;
				flg = false;
			}else this.blinkFPS = 0;

			return flg;
		}
	};
	
	//平均値算出
	var organicAverage = function(_val,_len){
		var num = 0;
		var val = _val;
		var len = _len;
		for(var i = 0; i < len; i++){
			num += Math.random()*val;
		}
		num = num / len;
		return num;
	};
	
	//グラデーション処理
	var radialGradient = function(){
		var size  = n_ih * 1.5;
		var x = n_iw >> 1;
		var y = n_ih + (size >> 2);
		var radialGradient = ctx.createRadialGradient(x,y,0,x,y,size);

		var p = param;
		var r = p.bgColor.r >> 0;
		var b = p.bgColor.b >> 0;
		var g = p.bgColor.g >> 0;
		var bgColor = "rgb("+r+", "+g+", "+b+")";

		radialGradient.addColorStop(0, 'rgb(36, 35, 35)');
		radialGradient.addColorStop(1, bgColor);
		ctx.fillStyle = radialGradient;
		return false;
	}
	

	/*function 生成処理
	--------------------------------------------------------------------*/
	var sf_01 = new StarField();



	/*function 描画処理
	--------------------------------------------------------------------*/

	//process ループ関数
	var loop = function(){
		stats.begin();
		
		var c = ctx;
		var p = param;
		
		c.globalCompositeOperation = p.composition;

		if(p.flgAfterImg === true){
			var alpha = p.afterImg;
			var r = p.bgColor.r >> 0;
			var b = p.bgColor.b >> 0;
			var g = p.bgColor.g >> 0;
			var bgColor = "rgb("+r+", "+g+", "+b+")";

			c.beginPath();
			c.globalAlpha = alpha;
			c.fillStyle = bgColor;
			c.rect(0,0,n_iw,n_ih);
			c.closePath();
			c.fill();

		}else c.clearRect(0,0,n_iw,n_ih);
		
		radialGradient();
		
		c.rect(0,0,n_iw,n_ih);
		c.fill();

		sf_01.update();
		
		win.requestAnimationFrame(loop);
		
		stats.end();
		return false;
	};


	/*object リサイズ用オブジェクト
	--------------------------------------------------------------------*/
	var Resizer = function(){};
	Resizer.prototype = {
		winCheck:function(){
			n_iw = win.innerWidth || doc.body.clientWidth;
			n_ih = win.innerHeight || doc.body.clientHeight;
			return false;
		},
		canvasResize:function(){
			canvas.width = n_iw;
			canvas.height = n_ih;
			return false;
		}
	};
	var resizer = new Resizer();


	/*event リサイズ実行
	--------------------------------------------------------------------*/
	var resizeFunc = function(){
		resizer.winCheck();
		resizer.canvasResize();
		return false;
	};


	/*event 処理分岐
	--------------------------------------------------------------------*/
	resizeFunc();
	win.addEventListener("resize",resizeFunc,false);
	win.requestAnimationFrame(loop);

	return false;
}


//SCRIPT END
window.addEventListener("load",init,false);