(function () {
	"use strict";






	/*const 共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window,
		doc = document,
		canvas = doc.getElementById("myCanvas"),
		ctx = canvas.getContext("2d");

	var s_r = (Math.random()*255)>>0,
		s_g = (Math.random()*255)>>0,
		s_b = (Math.random()*255)>>0,
		s_dotColor = "rgba("+s_r+", "+s_g+", "+s_b+",0.9)",
		s_ctxComposition = "xor";

	var n_Loop = 28,
		n_ObjLen = 60,
		n_PI = Math.PI*2,
		n_Angle = n_PI<<1,
		n_DisLimit = 50;


	/*var 共通変数　このJS内部でグローバルに使う変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth,
		n_ih = win.innerHeight || doc.body.clientHeight,
		aryObj = [];


	/*object Stats用オブジェクト
	--------------------------------------------------------------------*/
	var stats = new Stats();
	stats.setMode( 0 );
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "fixed";
	stats.domElement.style.right = "5px";
	stats.domElement.style.bottom = "5px";



	/*object Dotsオブジェクト
	--------------------------------------------------------------------*/

	var s_r = (Math.random()*255)>>0,
		s_g = (Math.random()*255)>>0,
		s_b = (Math.random()*255)>>0,
		max_01 = 200,
		r = Math.floor(Math.random()*max_01),
		g = Math.floor(Math.random()*max_01),
		b = Math.floor(Math.random()*max_01);
	
	var dots = {		
		dotLength:40,
		dotDisLimit:150,
		composition:"source-over",
		dotSpd:1.2,
		dotStartSpd:1.2,
		dotSize:1,
		dotStrokeWidth:1,
		dotAlpha:1,
		fillColor:"rgb("+s_r+", "+s_g+", "+s_b+")",
		strokeColor:"rgb("+s_r+", "+s_g+", "+s_b+")",
		bgColor:"rgb("+r+", "+g+", "+b+")",
		bgAlpha:1,
		isShowCore:false,
		isFill:false
	};


	/*object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
	var gui = new dat.GUI();
	gui.remember(dots);
	gui.add(dots, 'dotLength',10,300);
	gui.add(dots, 'dotDisLimit',2,500);
	gui.add(dots, 'dotSpd',0.2,10);
	gui.add(dots, 'dotSize',0.1,5);
	gui.add(dots, 'dotStrokeWidth',0,1);
	gui.add(dots, 'dotAlpha',0,1);
	gui.add(dots,'composition',["xor","lighter","multiply","difference","source-over"]);
	gui.addColor(dots, 'fillColor');
//	gui.addColor(dots, 'strokeColor');
	gui.add(dots, 'isShowCore');
	gui.add(dots, 'isFill');

	var bgChange = gui.addColor(dots, 'bgColor');
	bgChange.onChange(function(value) {
		canvas.style.backgroundColor = value;
	});
	gui.add(dots, 'bgAlpha',0,1);


	/*contents 処理
	--------------------------------------------------------------------*/

	//module 二点間の距離計算
	var pointDisCheck  = function(_p1,_p2){

		var p1 = _p1;
		var p2 = _p2;

		var a = 0;
		var b = 0;
		var d = 0;

		a = p1.x - p2.x;
		b = p1.y - p2.y;
		d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

		return d;
	};

	//object Pointオブジェクト
	var Point = function(){};
	Point.prototype = {
		x:0,
		y:0,
		nX:0,
		nY:0
	};

	//process オブジェクト作成 → 配列に格納
	var objSet = function(){

		aryObj = [];
		n_ObjLen = dots.dotLength>>0;

		for(var i=0; i<n_ObjLen; i++){

			var p = new Point();
			var spd = dots.dotStartSpd;
			var spdHarf = spd/2;

			p.x = (Math.random()*n_iw)>>0;
			p.y = (Math.random()*n_ih)>>0;
			p.nX = (Math.random()*spd)-spdHarf;
			p.nY = (Math.random()*spd)-spdHarf;
			aryObj[i] = p;
		}
	};

	//process 描画
	var draw = function(){
		stats.begin();

		var len = dots.dotLength>>0,
			c 	= ctx;

		if(n_ObjLen !== len) objSet();


		//基本の描画
		c.fillStyle = dots.bgColor;
		c.globalAlpha = dots.bgAlpha;
		c.fillRect(0,0,n_iw,n_ih);
//		c.globalCompositeOperation = dots.composition;
		c.globalAlpha = dots.dotAlpha;
		c.fillStyle = c.strokeStyle = dots.fillColor;
		c.lineWidth = dots.dotStrokeWidth;

		
		for(var i=0; i<n_ObjLen; i++){

			var o = aryObj[i];
			var x = o.x;
			var y = o.y;

			var limit = dots.dotDisLimit;
			var disLarge = limit;
//			var size = 1;

			//他のポイントとの距離確認
			for(var j=0; j<n_ObjLen; j++){
				if(j === i) continue;
				
				var o2 = aryObj[j],
					dis = pointDisCheck(o,o2),
					disX = (x + o2.x) >> 1,
					disY = (y + o2.y) >> 1;

				
				if(dis >= limit) continue;
				var arcSize = (dis*dots.dotSize *100|0)/100,
					alpha	= 1 - (dis / limit * 100 |0)/100;
				
//				c.globalAlpha = alpha;
				c.beginPath();
				c.arc(disX,disY,arcSize,0,n_Angle,false);
				c.closePath();
				if(dots.isFill) c.fill();
				else c.stroke();

//				if(disLarge >= limit) continue;
//				size = limit-disLarge;
//				size = size*dots.dotSize;
			}

			c.fillStyle = "#fff";
			c.globalAlpha = 1;
			if(dots.isShowCore) c.fillRect(x,y,2,2);


			x += o.nX*dots.dotSpd;
			y += o.nY*dots.dotSpd;

			if(x < 0) x = n_iw;
			else if(x > n_iw) x = 0;

			if(y < 0) y = n_ih;
			else if(y > n_ih) y = 0;

			o.x = x;
			o.y = y;
		}
		
		stats.end();
		win.requestAnimationFrame(draw);
	};


	//process canvasアニメ開始
	var canvasInit = function(){
		canvas.style.backgroundColor = dots.bgColor;
		objSet();
		setTimeout(draw,n_Loop);
	}();


	/*object リサイズ用オブジェクト
	--------------------------------------------------------------------*/
	var Resizer = function(){};
	Resizer.prototype = {
		winCheck:function(){
			n_iw = win.innerWidth || doc.body.clientWidth;
			n_ih = win.innerHeight || doc.body.clientHeight;
		},
		canvasResize:function(){
			canvas.width = n_iw;
			canvas.height = n_ih;
		}
	};
	var resizer = new Resizer();


	/*function リサイズ実行
	--------------------------------------------------------------------*/
	var resizeFunc = function(){
		resizer.winCheck();
		resizer.canvasResize();
	};


	/*contents 処理分岐
	--------------------------------------------------------------------*/
	resizeFunc();
	window.addEventListener("resize",resizeFunc);
	
}());
