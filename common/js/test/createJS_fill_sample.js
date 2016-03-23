var project;
(function(project) {

    var Main = function(_param) {
        var _this = this;

        this.canvas = document.getElementById("myCanvas");
        this.canvas.width = this.stageWidth = window.innerWidth;
        this.canvas.height = this.stageHeight = window.innerHeight;

        this.particleLength = 180;
        this.particleColor = "";
        this.particleEndPoint = 400;
        this.particleLimitScale = 0;
        this.isParticleRotate = false;

        this.stage = new createjs.SpriteStage(this.canvas);
        this.spriteImg = new Image();
        this.spriteImgSrc = "";


        this.Resize();
        this.SetCategoryColor(_param.category);
        this.TypeSelect(_param.type);

        this.spriteImg.onload = function() {
            return _this.HandleLoaded();
        };
        this.spriteImg.src = this.spriteImgSrc;
    },
        Member = Main.prototype;


    Main.Init = function(_param) {
        new Main(_param);
    };

    Member.HandleLoaded = function() {
        var _this = this,
            _data = {
                images: [this.spriteImg],
                frames: {
                    width: 400,
                    height: 400,
                    regX: 200,
                    regY: 200
                }
            };

        this.spriteSheet = new createjs.SpriteSheet(_data);
        this.spriteContainer = new createjs.SpriteContainer(this.spriteSheet);
        this.stage.addChild(this.spriteContainer);

        // Color
        var _color = this.HexToRgb(this.particleColor),
            _r = _color.red,
            _g = _color.green,
            _b = _color.blue;
        this.particleFilter = new createjs.ColorFilter(_r, _g, _b, 1);
        this.spriteContainer.filters = [this.particleFilter];

        this.particles = [];
        for (var n = 0; n < this.particleLength; n++) this.Emit();
        this.Tick();
        window.addEventListener("resize", _this.Resize.bind(_this));
    };

    /**
     * HEX値からRGB値に変換
     * @param   {String} _hex 変換したいHEX値
     * @returns {Object} 返還後の戻りRGB値
     */
    Member.HexToRgb = function(_hex) {
        // source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        // Expand shorthand form (e.g."03F") to full form (e.g."0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        _hex = _hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
        return {
            red: parseInt(result[1], 16) / 255,
            green: parseInt(result[2], 16) / 255,
            blue: parseInt(result[3], 16) / 255
        };
    };

    /**
     * カテゴリーの色を取得
     * @param   {String} _category カテゴリ名
     */
    Member.SetCategoryColor = function(_category) {
        console.log("category");
        var _color = "";
        if (_category === "development") _color = "#269acc";
        else if (_category === "electronics") _color = "#bf8ab0";
        else if (_category === "global") _color = "#145698";
        else if (_category === "living") _color = "#82bb8f";
        else if (_category === "infomation") _color = "#e7b759";
        this.particleColor = _color;
    };

    /**
     * パーティクルの種類を指定
     * @param {String} _type 種類を指定する為の文字列、無い場合はランダムになる
     */
    Member.TypeSelect = function(_type) {
        console.log("typeSelect");
        if (!_type) {
            var _types = ["arc", "square", "triangle"],
                _type = _types[Math.floor(Math.random() * _types.length)];
        }
        if (_type === "arc") {
            this.particleLimitScale = 0.78;
            this.spriteImgSrc = "images/createJS/particle_simple.png";
        } else if (_type === "square") {
            this.particleLimitScale = 0.78;
            this.spriteImgSrc = "images/createJS/particle_square.png";
            if (Math.random() * 10 > 5) this.isParticleRotate = true;
        } else if (_type === "triangle") {
            this.particleLimitScale = 0.88;
            this.spriteImgSrc = "images/createJS/particle_tri.png";
            this.isParticleRotate = true;
        }
    };

    /**
     * HEX値からRGB値に変換
     * @param   {String} _hex 変換したいHEX値
     * @returns {Object} 返還後の戻りRGB値
     */
    Member.HexToRgb = function(_hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
			_hex = _hex.replace(shorthandRegex, function(m, r, g, b) {
            	return r + r + g + g + b + b;
        	}),
			result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
		
        return {
            red: parseInt(result[1], 16) / 255,
            green: parseInt(result[2], 16) / 255,
            blue: parseInt(result[3], 16) / 255
        };
    };

    /**
     * アニメーション処理
     */
    Member.Tick = function() {
        var _this 		= this,
			_particles	= this.particles,
            _length 	= this.particleLength,
            _particle;

        for (var i = 0; i < _length; i++) {
			_particle = _particles[i];
            _particle.sprite.rotation += _particle.rotSpeed;
            _particle.speed += _particle.gravity;
            _particle.y 	-= _particle.speed;
            _particle.sprite.y = _particle.y;

            if (_particle.y > -this.particleEndPoint) continue;
            _particle.y = _particle.sprite.y = this.stageHeight + 200;
            _particle.speed = (_particle.speed * 0.5 * 10 | 0) / 10;
        }

        this.stage.update();
        window.requestAnimationFrame(_this.Tick.bind(_this));
    };

    /**
     * パーティクル生成
     */
    Member.Emit = function() {
        var _sprite = new createjs.Sprite(this.spriteSheet),
            _id = this.particles.length - 1,
            _particle = {
                id: _id,
                sprite: null,
                x: Math.random() * this.stageWidth | 0,
                y: this.stageHeight + (_id * 20) | 0,
                speed: 0,
                gravity: ((Math.random() * 0.1) * 100 | 0) / 100,
                rotSpeed: ((Math.random() * 4 - 2) * 10 | 0) / 10
            },
            _scale = (((Math.random() * 0.01 * _id) * 100 | 0) / 100);

        _sprite.stop();
        _sprite.x = _particle.x;
        _sprite.y = _particle.y;
        _sprite.scaleX = _sprite.scaleY = (_scale > this.particleLimitScale) ? this.particleLimitScale : _scale;
        _sprite.rotation = Math.random() * 360;
        _particle.sprite = _sprite;

        this.particles.push(_particle);
        this.spriteContainer.addChild(_sprite);
    };

    /**
     * リサイズ処理
     */
    Member.Resize = function() {
        var _width = window.innerWidth || document.body.clientWidth,
            _height = window.innerHeight || document.body.clientHeight,
            _canvas = this.canvas;
        _canvas.width = this.stageWidth = _width;
        _canvas.height = this.stageHeight = _height;
    };

	
	
	
    project.Main = Main;
})(project || (project = {}));



window.addEventListener("load", function() {
    var categories = ["development", "electronics", "global", "living", "infomation"];
    project.Main.Init({
        category: categories[Math.floor(Math.random() * categories.length)]
    });
});
//# sourceMappingURL=Main.js.map