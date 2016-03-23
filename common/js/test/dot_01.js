"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document) {
	"use strict";

	/*共通定数　このJS内部でグローバルに使う定数
 --------------------------------------------------------------------*/

	var canvas = document.getElementById("myCanvas"),
	    ctx = canvas.getContext("2d");

	var n_PI = Math.PI * 2,
	    n_Angle = n_PI << 1;

	var windowWidth = window.innerWidth || document.body.clientWidth,
	    windowHeight = window.innerHeight || document.body.clientHeight; //ウィンドウ高さ

	/*object Stats用オブジェクト
 --------------------------------------------------------------------*/
	var stats = new Stats();
	stats.setMode(0);
	document.body.appendChild(stats.domElement);
	stats.domElement.style.position = "fixed";
	stats.domElement.style.right = "5px";
	stats.domElement.style.bottom = "5px";

	/*class
 --------------------------------------------------------------------*/
	//Dotルール生成

	var Dot = function () {
		function Dot() {
			_classCallCheck(this, Dot);

			this.ary = [];
			this.length = 80;
			this.distanceLimit = 50;
			this.composition = "source-over";
			this.spd = 1.2;
			this.startSpd = 1.2;
			this.alpha = 1;
			this.fillAlpha = 0.9;
			this.size = 2;
			this.strokeWidth = 1;
			this.fillColor = this.addRgbColor();
			this.strokeColor = this.addRgbColor();
			this.bgColor = this.addBgColor();
		}

		_createClass(Dot, [{
			key: "addRgbColor",
			value: function addRgbColor() {
				var _alpha = arguments.length <= 0 || arguments[0] === undefined ? 0.9 : arguments[0];

				var _r = Math.random() * 255 >> 0,
				    _g = Math.random() * 255 >> 0,
				    _b = Math.random() * 255 >> 0;
				return "rgba(" + _r + ", " + _g + ", " + _b + "," + _alpha + ")";
				//			return "rgba("+_r+", "+_g+", "+_b+")";
			}
		}, {
			key: "addBgColor",
			value: function addBgColor() {
				var _max_01 = 200,
				    _r = Math.floor(Math.random() * _max_01),
				    _g = Math.floor(Math.random() * _max_01),
				    _b = Math.floor(Math.random() * _max_01);
				return "rgb(" + _r + ", " + _g + ", " + _b + ")";
			}
		}, {
			key: "baseDraw",
			value: function baseDraw() {
				var _c = ctx;
				_c.fillStyle = this.bgColor;
				_c.fillRect(0, 0, windowWidth, windowHeight);
				_c.globalAlpha = this.alpha;
				//			_c.clearRect(0,0,windowWidth,windowHeight);
				_c.globalCompositeOperation = this.composition;
				_c.fillStyle = this.fillColor;
				_c.strokeStyle = this.strokeColor;
				_c.lineWidth = this.strokeWidth;
			}
		}, {
			key: "draw",
			value: function draw() {
				var _len = this.length,
				    _ary = this.ary;
				this.baseDraw();
				for (var i = 0; i < _len; i++) {
					var _point = _ary[i],
					    _limit = this.distanceLimit,
					    _shortRange = _limit,
					    _size = 1;

					//他のポイントとの距離確認
					for (var j = 0; j < _len; j++) {
						if (j === i) continue;
						var _dis = _point.getDistance(_ary[j]);
						if (_shortRange > _dis) _shortRange = _dis;
						if (_shortRange >= _limit) continue;
						_size = (_limit - _shortRange) * this.size;
					}
					_point.size = _size;
					_point.draw();
					_point.move(this.spd);
				}
			}
		}, {
			key: "addPointSet",
			value: function addPointSet() {
				this.length = this.length >> 0;
				this.ary = [];
				for (var i = 0; i < this.length; i++) {
					var _spd = dot.startSpd,
					    _spdHarf = _spd / 2,
					    _p = new Point({
						x: Math.random() * windowWidth >> 0,
						y: Math.random() * windowHeight >> 0,
						nx: Math.random() * _spd - _spdHarf,
						ny: Math.random() * _spd - _spdHarf
					});
					this.ary[i] = _p;
				}
			}
		}]);

		return Dot;
	}();

	//各ポイント用


	var Point = function () {
		function Point(_param) {
			_classCallCheck(this, Point);

			this.x = _param.x;
			this.y = _param.y;
			this.nx = _param.nx;
			this.ny = _param.ny;
			this.size = 1;
		}

		_createClass(Point, [{
			key: "move",
			value: function move(_accel) {
				var _start = -50,
				    _limitX = windowWidth + 50,
				    _limitY = windowHeight + 50;

				this.x += (this.nx * _accel * 10 | 0) / 10;
				this.y += (this.ny * _accel * 10 | 0) / 10;
				if (this.x < _start) this.x = _limitX;else if (this.x > _limitX) this.x = _start;
				if (this.y < _start) this.y = _limitY;else if (this.y > _limitY) this.y = _start;
			}
			/**
    * 二点間の距離計算
    * @param   {object} _otherPoint 比較する座標
    *　@returns {number} 距離
    */

		}, {
			key: "getDistance",
			value: function getDistance(_otherPoint) {
				var _a = this.x - _otherPoint.x,
				    _b = this.y - _otherPoint.y,
				    _d = Math.sqrt(Math.pow(_a, 2) + Math.pow(_b, 2));
				return _d;
			}
		}, {
			key: "draw",
			value: function draw() {
				var _c = ctx;
				_c.beginPath();
				_c.arc(this.x, this.y, this.size, 0, n_Angle, false);
				_c.fill();
				_c.stroke();
				_c.closePath();
			}
		}]);

		return Point;
	}();

	var dot = new Dot();

	/*object dat.GUI用オブジェクト
 --------------------------------------------------------------------*/
	var GUI = new dat.GUI();
	GUI.remember(dot);
	GUI.add(dot, 'length', 10, 300).onChange(function (_val) {
		dot.length = _val | 0;
		dot.addPointSet();
	});
	GUI.add(dot, 'distanceLimit', 2, 500);
	GUI.add(dot, 'spd', 0.2, 10);
	GUI.add(dot, 'alpha', 0, 1);
	GUI.add(dot, 'fillAlpha', 0, 1).onChange(function (_val) {});
	GUI.add(dot, 'size', 1, 8);
	GUI.add(dot, 'strokeWidth', 0, 20);
	GUI.add(dot, 'composition', ["xor", "lighter", "multiply", "difference", "source-over"]);
	GUI.addColor(dot, 'fillColor');
	GUI.addColor(dot, 'strokeColor');
	GUI.addColor(dot, 'bgColor').onChange(function (_val) {
		canvas.style.backgroundColor = _val;
	});

	/*contents 処理
 --------------------------------------------------------------------*/

	//process 描画
	var loop = function loop() {
		stats.begin();
		dot.draw();
		stats.end();
		window.requestAnimationFrame(loop);
	};

	/*object リサイズ用オブジェクト
 --------------------------------------------------------------------*/
	var resizeEvent = function resizeEvent() {
		windowWidth = window.innerWidth || document.body.clientWidth;
		windowHeight = window.innerHeight || document.body.clientHeight;
		canvas.width = windowWidth;
		canvas.height = windowHeight;
	};

	/*contents 開始
 --------------------------------------------------------------------*/
	canvas.style.backgroundColor = dot.bgColor;
	window.addEventListener("resize", resizeEvent);
	resizeEvent();
	dot.addPointSet();
	loop();
})(window, document);
//# sourceMappingURL=dot_01.js.map
