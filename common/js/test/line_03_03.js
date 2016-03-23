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
//		paramNoiseLevel = gui.add(param, 'noiseLevel',1,300),
//		paramNoiseRange = gui.add(param, 'noiseRange',0,0.1);
		paramPointInterval = gui.add(param, 'interval',0,100);

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
		param.interval = val>>0;
		setup();
	});
	//	paramNoiseLevel.onChange(function(val){
//		param.noiseLevel = val>>0;
//		setup();
//	});
//	paramNoiseRange.onChange(function(val){
//		param.noiseRange = Math.round(val * 1000) / 1000;
//		setup();
//	});
	paramFlgAnim.onChange(function(val){
		loop();
	});

	
	/* @object WavePoint
	 * 波形描画ポイント
	*/
	function WavePoint(_x,_y,_angle,_c,_flg){
		this.x = _x;
		this.y = _y;
		this.angle = _angle;
//		this.color = lib.getRndRGB(0,30);
		this.color = _c;
		this.flg = _flg;
	};
	WavePoint.prototype = {
		x:0,
		y:0,
		ex:0,
		ey:0,
		angle:0,
		radian:0,
		move:0,
		spd:1,
		limit:param.radius,
		color:"",
		vector:true,
		draw:function(){
			
			var	t = this,
				c = ctx,
				PI =  (Math.PI/180),
				y = n_ih>>1,
//				noise = Math.random()*3,
				pointY = t.y + y;
						
			c.strokeStyle = t.color;
			c.beginPath();
//			c.moveTo(t.x,pointY);
			c.arc(t.x,t.y,2,0,n_PI,false);
			c.stroke();

			if(t.vector === true) t.y += t.spd;
			else t.y -= t.spd;
			
			var abs = lib.abs(t.y - y);
			if(abs >= t.limit){
				t.vector = !t.vector;
			}
		},
		nextAngle:function(){
			var	t = this,
				changeY = param.spd,
				PI =  (Math.PI/180);
			t.radian = t.angle * PI;
			t.angle += changeY;
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
		
		init:function(){
			this.interval = param.interval;
			this.length =( window.innerWidth || document.body.clientWidth) / this.interval >> 0;
			var i,
				len = this.length,
				ary = this.ary,
				h = window.innerHeight || document.body.clientHeight,
				y = h >> 1,
				point,
				pointY = 0,
				radiusY = param.radius,
				changeY = 15,
				PI =  (Math.PI/180);

			for (i = 0; i < len; i++) {
				var sr = Math.sin(this.radian),
					c = "#0099cc",
					flg = true;
				
				pointY = ((radiusY * sr) + y) >> 0;
				this.radian = this.angle * PI;
				console.log(this.angle);
				if(this.angle < 100 && this.angle > -80) c = "#ff0000",flg = false;
				ary[i] = new WavePoint(i*this.interval,pointY,this.angle,c,flg);
				
				this.angle += changeY;
				if(this.angle > 180) this.angle -= 360;
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
				changeY = param.spd,
				PI =  (Math.PI/180);
			
			c.strokeStyle = "rgb(255,255,255)";
//			c.beginPath();
//			c.moveTo(this.x,ary[0].y);

			var point,
				point_02,
				pointY = 0,
				pointY_02 = 0;
			
			for (i=0; i < len; i++) {
				//三角関数
//				pointY = ((radiusY * Math.sin(this.radian)) + y) >> 0;
//				this.radian = this.angle * PI;
//				this.angle += changeY;
				
				if(i === len-1) break;
				
				point = ary[i];
				point_02 = ary[i+1];
//				point.draw();
//				point.y += (pointY - point.y) * 0.5;
//				var noise = Math.random()*2,

//				pointY = ((radiusY * Math.sin(point.radian)) + y) >> 0;
//				pointY_02 = ((radiusY * Math.sin(point_02.radian)) + y) >> 0;
//				point.nextAngle();
				
				point.draw();

//				c.beginPath();
//				if(param.flgColor === true) c.strokeStyle = point.color;
//				if(param.flgStroke === true) {
//					c.moveTo(point.x,pointY);
//					c.lineTo(point_02.x,pointY_02);
//				};
//				if(param.flgArc === true) c.arc(point.x,pointY,2,0,n_PI,false);
//				c.stroke();
				
			}
//			c.lineTo(n_iw,y);
//			c.stroke();
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
		if(param.flgAnim === true) window.requestAnimationFrame(loop);
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
