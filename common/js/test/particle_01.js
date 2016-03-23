/*==============================================================================

	サイト内部　機能・演出用

	・基本の状態を維持する必要は無く、プロジェクトによってカスタマイズする
	・機能実装→演出実装→最適化処理のフローで構築

==============================================================================*/




//SCRIPT START

(function () {
	"use strict";



	/*const 共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window;
	var doc = document;
	var canvas = doc.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	var pages = new PageInfo();
	var lib = new Library();

	var $main = $(doc.getElementById("main"));
	var $ancherTag = (s_pageUA === "webkit") ? $("body"):$("html");

	var s_pageUA = pages.UA();            //ユーザーエージェント保持
	var s_pageID = pages.ID();		      //ページID
	var s_pageMobile = pages.mobile();    //モバイル判定
	var s_pageClass = pages.Category();

	var n_Loop = 28;
	var n_ObjLen = 60;
	var n_PI = Math.PI*2;
	var n_Angle = n_PI<<1;
	var n_DisLimit = 50;
	var n_mx = null;
	var n_my = null;
	var n_pi = Math.PI*2
	var n_devide = 0;
	var n_updateRadius = 0;

	var f_Move = false;

	var aryParticle = [];


	/*var 共通変数　このJS内部でグローバルに使う変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
	var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ

	var aryObj = [];


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
	stats.domElement.style.right = "10px";
	stats.domElement.style.bottom = "10px";



	/*object Particleオブジェクト
	--------------------------------------------------------------------*/
	var Particle = function(){
		return false;
	}

	Particle.prototype = {
		x:null,
		y:null,
		vx:0,
		vy:0,
		radius:0,
		color:null,
		isRemove:false,

		//生成
		create:function(){

			var rx = ctl.createX;
			var ry = ctl.createY;
			var rx2 = rx >> 1;
			var ry2 = (-ry >> 1);

			this.vx = Math.random()*rx - rx2;
			this.vy = Math.random()*ry - ry2;
			this.radius = Math.random()*ctl.createRadius + 5;
			var r = (Math.random()*155 + 100) >> 0;
			var g = (Math.random()*155 + 100) >> 0;
			var b = (Math.random()*155 + 100) >> 0;
			this.color = "rgb(" + r + "," + g + "," + b + ")";

			return false;
		},

		//更新
		update:function(){
			
			var t = this;
			var spd = ctl.spd;
			var vx = t.vx * spd;
			var vy = t.vy * spd;

			t.vy += ctl.gravity * spd;
			t.x += vx;
			t.y += vy;
			t.radius -= (0 + t.radius) * ctl.updateRadius * spd;
//				t.radius *= ctl.updateRadius;

			//パーティクルが画面の外に出たとき削除フラグを立てる
			if(t.x < 0 || t.x > n_iw || t.y < -100 ||　t.y > n_ih || t.radius < 0.4){
				this.isRemove = true;
			}

			return false;
		},

		draw:function(){
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.radius,0,n_pi,false);

			if(ctl.flgFill === true){
				ctx.fillStyle = this.color;
				ctx.fill();
			}

			if(ctl.flgStroke === true){
				ctx.strokeStyle =this.color;
				ctx.stroke();
			} 

			return false;
		}

	}




	/*object Particle設定オブジェクト
	--------------------------------------------------------------------*/
	function ParticleControler(){

		var r = (Math.random()*155) >> 0;
		var g = (Math.random()*155) >> 0;
		var b = (Math.random()*155) >> 0;
		this.bgColor = "rgb(" + r + "," + g + "," + b + ")";

		return false;
	};
	ParticleControler.prototype = {
		createX:6,
		createY:-6,
		createRadius:20, 
		gravity:0.4,
		updateRadius:0.02, 
		composition:"lighter",
		spd:1,
		createItv:0,
		bgAlpha:1,
		flgFill:true,
		flgStroke:false,
		flgFade:false,
		flgMovingDraw:false
	};
	var ctl = new ParticleControler();


	/*object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
	var gui = new dat.GUI();		
	var DatParam = function(){};
	var param = new DatParam();

	gui.remember(ctl);
//		gui.add(dots, 'dotLength',10,300);
//		gui.add(dots, 'dotDisLimit',2,500);
	gui.add(ctl, 'createX',-30,30);
	gui.add(ctl, 'createY',-30,0);
	gui.add(ctl, 'createRadius',5,40);
	var changeCreItv = gui.add(ctl, 'createItv',0,5).step(1);
	gui.add(ctl, 'updateRadius',0.005,0.2);
	gui.add(ctl, 'gravity',-1,1);
	gui.add(ctl, 'spd',0,1.2);
	gui.add(ctl, 'bgAlpha',0,1);
	gui.add(ctl, 'flgFill',true);
	gui.add(ctl, 'flgStroke',false);
	gui.add(ctl, 'flgFade',false);
	gui.add(ctl, 'flgMovingDraw',false);
	gui.add(ctl,'composition',["lighter","multiply","difference","xor","source-over"]);
	var changeBG = gui.addColor(ctl, 'bgColor');

	changeCreItv.onChange(function() {
		n_devide = 0;
		return false;
	});
	changeBG.onChange(function(value) {
		canvas.style.backgroundColor = value;
		return false;
	});


	/*contents 処理
	--------------------------------------------------------------------*/

	//process オブジェクト生成
	var add = function(){
		if(n_mx === null || n_my === null) return false;

		if(n_devide !== ctl.createItv){
			n_devide += 1;
			return false;
		}else n_devide = 0;

		var p = new Particle();
		p.x = n_mx;
		p.y = n_my;
		p.create();
		aryParticle.push(p);

		return false;
	}

	//process オブジェクト更新
	var update = function(){
		var list = [];
		var len = aryParticle.length;
		var ary = aryParticle;
		
		for(var i = 0; i<len; i++){
			var p = ary[i];
			p.update();
			//削除フラグが立っていなければ配列に格納
			if(p.isRemove === false) list.push(p);
		}
		//配列の入れ替え
		ary = list;

		return false;
	};

	//process オブジェクト描画
	var draw = function(){
		ctx.save();
		ctx.globalCompositeOperation = ctl.composition;

		var len = aryParticle.length;
		for(var i=0; i<len; i++){
			aryParticle[i].draw();
		}

		ctx.restore();

		return false;
	};

	//process ループ関数
	var loop = function(){
		stats.begin();

		ctx.fillStyle = ctl.bgColor;
		ctx.globalAlpha = ctl.bgAlpha;

		if(ctl.flgFade === true){
			ctx.rect(0,0,n_iw,n_ih);
			ctx.fill();
		}else ctx.clearRect(0,0,n_iw,n_ih);

		if(ctl.flgMovingDraw === false) add();
		update();
		draw();

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
		},
		allResize:function(){
			n_iw = win.innerWidth || doc.body.clientWidth;
			n_ih = win.innerHeight || doc.body.clientHeight;
			canvas.width = n_iw;
			canvas.height = n_ih;
			return false;
		}
	};
	var resizer = new Resizer();


	/*function マウス位置
	--------------------------------------------------------------------*/
	var updateMousePos = function(e){
		var rect = e.target.getBoundingClientRect();
		n_mx = e.clientX - rect.left;
		n_my = e.clientY - rect.top;
		if(ctl.flgMovingDraw === true) add();
		return false;
	}

	var resetMousePos = function(e){
		n_mx = null;
		n_my = null;
		return false;
	}

	var particleCleanOn = function(){
		n_updateRadius = ctl.updateRadius;
		ctl.updateRadius = 0.5;
		return false;
	}

	var particleCleanOff = function(){
		ctl.updateRadius = n_updateRadius;
		return false;
	}


	/*contents 処理分岐
	--------------------------------------------------------------------*/
	//process canvasアニメ開始
	var canvasInit = function(){

		resizer.allResize();

		canvas.addEventListener("mousemove",updateMousePos,false);
		canvas.addEventListener("mouseout",resetMousePos,false);			
		canvas.addEventListener("mousedown",particleCleanOn,false);			
		canvas.addEventListener("mouseup",particleCleanOff,false);			
		win.addEventListener("resize",resizer.allResize);
		win.requestAnimationFrame(loop);

		canvas.style.backgroundColor = ctl.bgColor;

		return false;
	}();

        return false;
}());
//SCRIPT END