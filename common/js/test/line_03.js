(function () {
	"use strict";

	
	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas = document.getElementById("myCanvas"),
		ctx = canvas.getContext("2d"),
		perlin = new SimplexNoise(),
		lib = new Planet();

	
	

	/*var 共通変数
	--------------------------------------------------------------------*/
	var n_iw = window.innerWidth || document.body.clientWidth,  //ウィンドウ幅
		n_ih = window.innerHeight || document.body.clientHeight,//ウィンドウ高さ
		n_PI = (Math.PI/180)*360,
		n_noiseRange = 0,
		n_noiseSeed = 0;




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
	function ParamMaster(){}
	ParamMaster.prototype = {
		//描画要素
		spd:4,
		lineWidth:1,
		bgAlpha:0.6,
		composition:"source-over",
		noiseRange:0.1,
		noiseLevel:50,
		radius:50,
		interval:10,
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
		flgAnim:true
	};
	var param = new ParamMaster();

	
	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI(),
//		paramLineWidth = gui.add(param, 'lineWidth',0.1,50),
		paramNoiseLevel = gui.add(param, 'noiseLevel',1,300),
		paramNoiseRange = gui.add(param, 'noiseRange',0,1),
		paramPointInterval = gui.add(param, 'interval',0.1,100);

	gui.add(param,"spd",0,20,false);
	gui.add(param,"radius",0,200,false);
	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.add(param, 'flgStroke',false);
//	gui.add(param, 'flgFill',false);
//	gui.add(param, 'flgBG',false);
//	gui.addColor(param, 'fillColor');
//	gui.addColor(param, 'strokeColor');
	gui.add(param, 'flgArc');
	gui.add(param, 'flgColor');
	gui.add(param, 'bgAlpha',0,1);
	gui.addColor(param, 'bgColor');
	var paramFlgAnim = gui.add(param, 'flgAnim',false);

	//数値の変更処理
//	paramLineWidth.onChange(function(val){
//		param.lineWidth = (val < 1)? val:val>>0;
//	});
	paramPointInterval.onChange(function(val){
//		param.interval = val>>0;
//		setup();
		wave.intervalReset();
	});
	paramNoiseLevel.onChange(function(val){
		param.noiseLevel = val>>0;
		setup();
	});
	paramNoiseRange.onChange(function(val){
		param.noiseRange = Math.round(val * 1000) / 1000;
		setup();
	});
	paramFlgAnim.onChange(function(val){
		loop();
	});

	
	/* @object WavePoint
	 * 波形描画ポイント
	*/
	function WavePoint(_x,_y,_angle){
		this.x = _x;
		this.y = _y;
		this.angle = _angle;
		this.color = lib.getRndRGB(0,30);
		
		var noise = Math.random()*10;
		this.radius = param.radius + noise;
	};
	WavePoint.prototype = {
		x:0,
		y:0,
		radius:0,
		angle:0,
		radian:0,
		color:"",
		PI:Math.PI/180,
		draw:function(){
			
			var	t = this,
				c = ctx,
				changeY = param.spd,
				y = n_ih>>1,
				noise = Math.random()*3,
				pointY = ((t.radius * Math.sin(t.radian)) + y) >> 0;

			c.strokeStyle = t.color;
			c.beginPath();
			
//			c.moveTo(t.x,pointY);
//			c.lineTo(t.x,pointY);
			c.arc(t.x,pointY,2,0,n_PI,false);
			
			t.radian = t.angle * t.PI;
			t.angle += changeY;
			
			var pointX = t.x + wave.interval;
			pointY = ((t.radius * Math.sin(t.radian)) + y) >> 0;
//			c.lineTo(pointX,pointY);
						
			c.stroke();
		},
		nextAngle:function(){
			var	t = this,
				changeY = param.spd,
				PI =  (Math.PI/180);
			t.radian = t.angle * PI;
			t.angle += changeY;
//			t.x += param.spd-1.5;
//			if(t.x > n_iw) t.x = - (t.x-n_iw);
		}
	};
	
	
	/* @object WaveForm
	 * 波形描画全体
	*/
	function WaveForm(){
		this.init();
	};
	WaveForm.prototype = {
		ary:[],
		length:0,
		x:0,
		y:n_ih >> 1,
		width:0,
		height:0,
		interval:0,
		radian:0,
		angle:0,
		color:"#fff",
		PI:Math.PI/180,
		noiseSeed:0.1,
		
		init:function(){
			this.interval = param.interval;
			this.length = ( window.innerWidth || document.body.clientWidth) >> 0;
			var i,
				len = this.length,
				ary = this.ary,
				h = window.innerHeight || document.body.clientHeight,
				y = h >> 1,
				point,
				pointY = 0,
				radiusY = param.radius,
				changeY = 15;

			
			for (i = 0; i < len; i++) {
				var noise = lib.abs( perlin.noise(this.noiseSeed,0) * param.noiseLevel );
				pointY = ((radiusY * Math.sin(this.radian)) + y) >> 0;
				this.radian = this.angle * this.PI;
				this.angle += changeY;
				ary[i] = new WavePoint(i*this.interval,pointY,this.angle);
				this.noiseSeed += 0.01;
			}
		},
		draw:function(){
			
			var i,
				len = this.length,
				ary = this.ary,
				c = ctx,
				h = window.innerHeight || document.body.clientHeight,
				y = h >> 1,
				radiusY = param.radius,
				changeY = param.spd;
			
			c.strokeStyle = "rgb(255,255,255)";
//			c.beginPath();
//			c.moveTo(this.x,ary[0].y);

			var p,
				p_02,
				pX = 0,
				pX_02 = 0,
				pY = 0,
				pY_02 = 0;
			
			for (i=0; i < len; i++) {
				//三角関数
//				pY = ((radiusY * Math.sin(this.radian)) + y) >> 0;
//				this.radian = this.angle * this.PI;
//				this.angle += changeY;
				
				if(i === len-1) break;
				
				p = ary[i];
				p_02 = ary[i+1];
//				p.draw();
				p.y += (pY - p.y) * 0.5;
				var noise = lib.abs( perlin.noise(this.noiseSeed,0) * param.noiseLevel );
//				console.log(noise);
//				var noise = noise(param.noiseRange);

				pX = p.x;
				pX_02 = p_02.x;
				pY = (((radiusY * Math.sin(p.radian)) + y) >> 0);
				pY_02 = (((radiusY * Math.sin(p_02.radian)) + y) >> 0);
				
				p.nextAngle();
//
				c.beginPath();
				if(param.flgColor === true) c.strokeStyle = p.color;
				if(param.flgStroke === true) {
					c.moveTo(pX,pY);
					c.lineTo(pX_02,pY_02);
				};
				if(param.flgArc === true) c.arc(pX,pY,2,0,n_PI,false);
				c.stroke();
				
				if(i === 0) console.log(p);
				
//				this.noiseSeed += 0.01;
			}
		},
		intervalReset:function(){
			var i,
				ary = this.ary,
				len = ary.length;
			
			for (i = 0; i < len; i++) {
				ary[i].x = i*param.interval;
			}
		}
	}
	


	/*flow CANVAS操作
	--------------------------------------------------------------------*/
	var wave = null;
	
	/* 初期化 */
	var setup = function(){
		wave = new WaveForm();
	};


	/* リセット */
	var resetup = function(){
		resize();
		setup();
	};


	/* ノイズ関数 */
	var noise = function(_seed){
		var num = ( perlin.noise(_seed,0) * param.noiseLevel ) >> 0;
		return num;
	};


	/* 描画 */
	var draw = function(){
		
		var c = ctx,
			p = param;

		c.fillStyle = p.bgColor;
		c.strokeStyle = p.strokeColor;
		c.globalAlpha = p.bgAlpha;
		c.globalCompositeOperation = p.composition;
		c.fillRect(0,0,n_iw,n_ih);

		c.globalAlpha = 1;
		c.globalCompositeOperation = p.composition;
		
		wave.draw();
//		angle += .05;
//
//		yPos = Math.cos(angle) * radius + offsetY;
//		ctx.fillStyle = "rgb(0,255,0)";
//		ctx.fillRect(xPos,yPos,5,5);
	};


	/* ループ関数 */
	var loop = function(){
		stats.begin();
		draw();
		stats.end();
//		if(param.flgAnim === true) window.requestAnimationFrame(loop);
	};


	/* リサイズ */
	var resize = function(){
		n_iw = window.innerWidth || document.body.clientWidth;
		n_ih = window.innerHeight || document.body.clientHeight;
		canvas.width = n_iw;
		canvas.height = n_ih;
	};




	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);

	setup();
	loop()
	
	return false;
}());
