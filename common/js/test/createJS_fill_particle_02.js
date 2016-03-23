


var canvas, stage, image, stats;
var particles;
var unit 	= 16,
	elm		= document.getElementById("myCanvas");

var winWidth 	= window.innerWidth || document.body.clientWidth,
	winHeight	= window.innerHeight || document.body.clientHeight;


console.log("test");

function init() {
	stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = "fixed";
	stats.domElement.style.right = "0px";
	stats.domElement.style.top = "0px";
	document.body.appendChild(stats.domElement);

	canvas = document.getElementById("myCanvas");

	stage = new createjs.SpriteStage(canvas);

	image = new Image();
	image.onload = loaded;
	image.src = "images/createJS/particle_simple_oba.png";

	stage.update();
	

	createjs.Ticker.setFPS(60);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	window.addEventListener("resize",Resize);
};

function loaded() {
	particles = [];
	for (var n = 0; n < unit; n++) emit();

	Update();
	stage.update();
	createjs.Ticker.addEventListener("tick", tick);
};

function tick(event) {
	for (var n = 0; n < unit; n++) emit();
	Update();
	stage.update();
	stats.update();
};

function emit() {
	var light = new createjs.Bitmap(image),
		scale 	= Math.random() * 0.5+ 0.08;

	light.regX	= image.width / 2;
	light.regY	= image.height / 2;
	light.scaleX= light.scaleY = scale;
	//	light.alpha	= 0.6;
	stage.addChild(light);

	var particle = {
		id		:0,
		light	:null,
		x		:0,
		y		:0,
		speed	:0,
		gravity	:0
	};

	particle.light 	= light;
	particle.x 		= Math.random() * canvas.width;
	particle.y 		= winHeight + Math.random() * 64;
	particle.spped 	= 0;
	particle.gravity= 0.05 + Math.random() * 0.02;
	particles.push(particle);
	particle.id 	= particles.length - 1;

	particle.light.x= particle.x;
	particle.light.y= particle.y;
};


/**
 * 繧｢繝・・繝・・繝亥・逅�
 */
var Update = function() {
	var max = particles.length;
	for (var n = 0; n < max; n++) {
		var particle = particles[n];
		if (particle) {
			particle.speed += particle.gravity;
			particle.y -= particle.speed;
			if (particle.y > -64) {
				particle.light.x = particle.x;
				particle.light.y = particle.y;
			} else {
				particles[particle.id] = null;
				stage.removeChild(particle.light);
				particle.light = null;
				particle = null;
			}
		}
	}
};


/**
	 * 繝ｪ繧ｵ繧､繧ｺ蜃ｦ逅�
	 */
var Resize  = function(){
	var _width 	= window.innerWidth || document.body.clientWidth,
		_height	= window.innerHeight || document.body.clientHeight;
	elm.width 	= _width;
	elm.height	= _height;
	winWidth 	= _width;
	winHeight 	= _height;
};

