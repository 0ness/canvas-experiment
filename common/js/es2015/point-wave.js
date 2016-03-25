(function (window,document) {
	"use strict";
	
	
	

	/*共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	const canvas = document.getElementById("myCanvas"),
		  ctx	 = canvas.getContext("2d");

	var n_PI 	= Math.PI*2,
		n_Angle = n_PI<<1;

	var windowWidth = window.innerWidth || document.body.clientWidth,
		windowHeight = window.innerHeight || document.body.clientHeight;//ウィンドウ高さ

	var waveTime = 0;

	

	/*object Stats用オブジェクト
	--------------------------------------------------------------------*/
	var stats = new Stats();
	stats.setMode( 0 );
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "fixed";
	stats.domElement.style.right = "5px";
	stats.domElement.style.bottom = "5px";
	
	
	
	
	/*class
	--------------------------------------------------------------------*/
	//Dotルール生成
	class Geometry {
		constructor(){
			this.ary 			= [];
			this.composition 	= "xor";
			this.alpha			= 1;
			this.fillAlpha		= 0.9;
			this.size 			= 2;
			this.strokeWidth 	= 1;
			
			this.width			= windowWidth;
			this.height			= windowHeight;
			
			this.xLength 		= 100;
			this.yLength		= 20;
			this.xDistance		= this.width / this.xLength;
			this.yDistance		= this.hegiht / this.yLength;

			//波長
			this.waveHeight 	= 180;
			this.waveOffset 	= 0.1;
			this.waveSpd 		= 0;// 0.05;

			//視点
			this.cameraX		= 0;
			this.cameraY		= 500;
			this.fl				= 250;

			this.fillColor 		= this.addRgbColor();
			this.strokeColor 	= this.addRgbColor();
			this.bgColor 		= "#000";
			this.bgAlpha		= 1;
		}
		
		/**
		 * ポイント生成
		 */
		addPointSet(){
			var _fl 	= this.fl,
				_width 	= this.width;
			
			this.ary = [];
			for(let y=0; y<this.yLength; y++){
				this.ary[y] = [];

				var _pointY = y,
					_pointZ = y*20 + (this.yLength - y),
					_scale	= _fl / (_fl + _pointZ),
					_diffX	= (_width - _width * _scale) / 2,
					_diffX2 = (_width - windowWidth) / 2;
				
				for(let x=0; x<this.xLength+1; x++){
					var _scaleWidth 	= _scale*_width,
						_scaleDistance 	= _scaleWidth / this.xLength,
						_scaleMargin	= (_width - _scaleWidth) / 2,
						_pointX 		= x * _scaleDistance + _scaleMargin;
					this.ary[y][x] = new Point({
						x		: _pointX,
						y		: _pointY,
						z		: _pointZ,
						scale	: _scale
					});
				};
			}
		}
		
		addRgbColor(_alpha=0.9){
			var _r = (Math.random()*255)>>0,
				_g = (Math.random()*255)>>0,
				_b = (Math.random()*255)>>0;
			return "rgba("+_r+", "+_g+", "+_b+","+_alpha+")";
		}
		addBgColor(){
			var _max_01 = 200,
				_r = Math.floor(Math.random() * _max_01),
				_g = Math.floor(Math.random() * _max_01),
				_b = Math.floor(Math.random() * _max_01);
			return "rgb("+_r+", "+_g+", "+_b+")";
		}
		
		/**
		 * 下地作成
		 */
		baseDraw(){
			var _c = ctx;
			_c.globalAlpha = this.bgAlpha;
			_c.fillStyle 	= this.bgColor;
			_c.fillRect(0,0,windowWidth,windowHeight);
			_c.globalCompositeOperation = this.composition;

			_c.globalAlpha 	= 1;
			_c.fillStyle 	= _c.strokeStyle = this.fillColor;
			_c.lineWidth 	= this.strokeWidth;
		}
		
		/**
		 * 描画
		 */
		draw(){
			var _ary 	= this.ary,
				_c 		= ctx,
				_endAngle	= Math.PI/180,
				_dot,
				_yLength = _ary.length,
				_xLength = this.xLength+1;
			
			this.baseDraw();
			
			//x軸の描画
			for(var y=0; y<_yLength; y++){
				var _lineWidth = 1 - ( Math.abs(_yLength/2 - y) * 0.2);
				_c.lineWidth = (_lineWidth < 0.1)?0.1:_lineWidth;
				
				_dot = _ary[y][0];
				_dot.ny = this.waveMotion(_dot.x,_dot.z,_dot.y,waveTime)
				_c.beginPath();
				_c.moveTo(_dot.x,_dot.ny);
				for(var x=1; x<_xLength; x++){
					_dot = _ary[y][x];
					_dot.ny = this.waveMotion(_dot.x,_dot.z,_dot.y,waveTime)
					_c.lineTo(_dot.x,_dot.ny);
				}
				
				_c.stroke();
			}
			
			//y軸の描画
			for(var x=0; x<_xLength; x++){
				var _lineWidth = 1 - (Math.abs(_xLength/2 - x) * 0.2);
				_c.lineWidth = (_lineWidth < 0.1)?0.1:_lineWidth;

				_dot = _ary[0][x];
				_c.beginPath();
				_c.moveTo(_dot.x,_dot.ny);
				for(var y=1; y<_yLength; y++){
					_dot = _ary[y][x];
					_c.lineTo(_dot.x,_dot.ny);
				}
				_c.stroke();
			};
			waveTime ++;
		}
		
		/**
		 * 波の動き
		 * @param   {number} x x座標
		 * @param   {number} y y座標
		 * @param   {number} t モーションの時間
		 *　@returns {number} 次のy座標
		 */
		waveMotion(x, y,_adust, t) {
			var _height = this.waveHeight,
				_spd 	= 10,
				_offset = this.waveOffset,
				_time	= t * this.waveSpd,
				_calcY  = Math.sin( ( x / 20 ) * _offset + ( _time / _spd ) ) * Math.cos( ( y / 20 ) * _offset + ( _time / _spd ) ) * _height;
			return _calcY + _adust + this.cameraY;
		}
		
	}

	//各ポイント用
	class Point {
		constructor(_param){
			this.x 		= _param.x;
			this.y 		= _param.y;
			this.z 		= _param.z;
			this.ny		= 0;
			this.scale 	= _param.scale;
			this.angle 	= 0;
			this.size	= ((10 * this.scale) * 100 |0 ) /100;
		}
		draw(){
			var _c = ctx;
			_c.beginPath();
			_c.arc(this.x,this.y,this.size,0,n_Angle,false);
			_c.fill();
		}
	}
	
	var geometry = new Geometry();


	
	/*object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
	var GUI = new dat.GUI();
	GUI.remember(geometry);
//	GUI.add(dot, 'length',10,300).onChange(function(_val){
//		dot.length = _val|0;
//		dot.addPointSet();
//	});
	GUI.add(geometry,"cameraY",-1000,1000);
	GUI.add(geometry,"waveHeight",0,200);
	GUI.add(geometry,"waveOffset",0,1);
	GUI.add(geometry,"waveSpd",0,0.5);
	GUI.add(geometry,'strokeWidth',0,20);
	GUI.add(geometry,'composition',["xor","lighter","multiply","difference","source-over"]);
	GUI.addColor(geometry, 'fillColor');
	GUI.addColor(geometry, 'bgColor').onChange(function(_val) {
		canvas.style.backgroundColor = _val;
	});
	GUI.add(geometry,'bgAlpha',0,1);

	


	/*contents 処理
	--------------------------------------------------------------------*/

	//process 描画
	var loop = function(){
		stats.begin();
		geometry.draw();
		stats.end();
		window.requestAnimationFrame(loop);
	};
	

	
	
	/*object リサイズ用オブジェクト
	--------------------------------------------------------------------*/
	var resizeEvent = ()=>{
		windowWidth = window.innerWidth || document.body.clientWidth;
		windowHeight = window.innerHeight || document.body.clientHeight;
		canvas.width = windowWidth;
		canvas.height = windowHeight;
	};


	
	
	/*contents 開始
	--------------------------------------------------------------------*/
	canvas.style.backgroundColor = geometry.bgColor;
	window.addEventListener("resize",resizeEvent);
	resizeEvent();
	geometry.addPointSet();
	loop();

	
	
}(window,document));