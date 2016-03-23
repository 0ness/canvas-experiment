(function(window, document) {
    "use strict";


	
	
	/*Static Property
	--------------------------------------------------------------------*/
	var width 	= window.innerWidth,
		height 	= window.innerHeight;
	
	var pixels 		= [],
		particles 	= [];

	var canvasElm 	= document.getElementById("myCanvas"),
		ctx 		= canvasElm.getContext('2d');

	width = canvasElm.width;
	height= canvasElm.height;
	
	
	
	/*Private Method
	--------------------------------------------------------------------*/
	/**
	 * 値の下限と上限を設定し、それらを超えないように値を拘束する
	 * @param   {number} v  変数
	 * @param   {number} o1 下限の値
	 * @param   {number} o2 上限の値
	 *　@returns {number} 精査した戻り値
	 */
	var constrain = function(_val, _min, _max){
		if (_val < _min) _val = _min;
		else if (_val > _max) _val = _max;
		return _val;
	};

	/**
	 * 文字の縦書き処理
	 * @param {object} _context ctxオブジェクト
	 *　@param {string} text    文章
	 *　@param {number} x       x座標
	 *　@param {number} y       y座標
	 */
	var verticalTexts = function(_param) {
		var _c 				= ctx,
			_x 				= _param.x,
			_y				= _param.y,
			_displayOutline = _param.displayOutline,
			_letters 		= _param.text.split('\n'),
			_letterLength	= _letters.length,
			_letterWidth	= _c.measureText("あ").width,
			_yLineHeight 	= _letterWidth + _param.letterSpacing,
			_xLineHeight 	= _letterWidth + _param.lineHeight | 0,
			_angleBase 		= Math.PI / 180;
		
		for(var i=0; i<_letterLength; i++){
			var _elm = _letters[i];
			
			Array.prototype.forEach.call(_elm, function(ch, j) {
				var _letterX = _x-_xLineHeight*i,
					_letterY = _y+_yLineHeight*j,
					_randX	 = (Math.random()*2 - 1)|0,
					_randY	 = Math.random()*2|0,
					_randR	 = Math.random()*16 - 8,
					_randF	 = Math.random()*20-10 |0,
					_fontCenter= Member.fontSize / 2 | 0;
				
				_c.font = _randF+Member.fontSize + "px" + Member.fontFamily;
//				_c.save();
//				_c.translate(_letterX,_letterY);
//				_c.rotate(_randR* Math.PI / 180 );
//				_c.translate(-_letterX,-(_letterY));
				if (_displayOutline) _c.strokeText(ch,_letterX,_letterY);
				else _c.fillText(ch, _letterX , _letterY);
//				_c.restore();
			});
		};
		
		_c.font = Member.fontSize + "px" + Member.fontFamily;
	};



	
	/*Sub Class
	--------------------------------------------------------------------*/
	// このクラスは、描画およびそれらのほとんどの色のドットを移動するための責任があります。
    var Particle = function(_x, _y) {
		//Sub Class property
        this.x = _x;
        this.y = _y;
        this.r = 0;
        this.vx = 0;
        this.vy = 0;
		
		this.noiseScale 	= 500;
		this.noiseStrength	= Math.random()*10 - 5; 	// how turbulent is the flow? 流れはどのように乱流ですか？
		this.speed 			= 2; 	// how fast do particles move? どのように高速粒子が移動するのですか？
		this.growthSpeed 	= 1; 	// how fast do particles change size? どのように高速粒子のサイズを変更できますか？
		this.maxSize 		= 4; 	// how big can they get? 彼らはどのように大きな得ることができますか？
    },
        ParticleMember = Particle.prototype;

	//Sub Class Static Property
	ParticleMember.endAngle			= Math.PI * 2 | 0;

	
	//Sub Class method
    /**
     * 画素配列内の指定されたピクセルの色を返します
     * @param   {number} x x座標
     * @param   {number} y y座標
     * @returns {string} 色rgb値
     */
    ParticleMember.getColor = function(x, y) {
        var _base = (Math.floor(y) * width + Math.floor(x)) * 4,
			_pixels	= pixels,
			_c = {
				r: _pixels[_base + 0],
				g: _pixels[_base + 1],
				b: _pixels[_base + 2],
				a: _pixels[_base + 3]
			};
        return "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
    };

    /**
     * パーティクル単体のレンダリング処理
     */
    ParticleMember.render = function() {
		var _c			= this.getColor(this.x, this.y), // 私達はの上に座っているピクセルは何色ですか？
			_angle 		= noise(this.x / this.noiseScale, this.y / this.noiseScale) * this.noiseStrength, // どこに移動する必要がありますか？
			_onScreen	= this.x > 0 && this.x < width && this.y > 0 && this.y < height, // 我々は、画像の境界内にありますか？
			_isBlack	= _c != "rgb(255,255,255)" && _onScreen,
			_ctx		= ctx,
			_x 			= this.x,
			_y 			= this.y;

		// 我々は黒画素の上にあれば、成長します。そうでない場合、シュリンク。
        if (_isBlack) this.r += this.growthSpeed;
        else this.r -= this.growthSpeed;

		// この速度は、爆発の機能によって使用されます
        this.vx *= 0.5;
        this.vy *= 0.5;

		// 流れ場に基づいて、私たちの位置を変更し、私たちは、速度を爆発。
        this.x += Math.cos(_angle) * this.speed + this.vx;
        this.y += -Math.sin(_angle) * this.speed + this.vy;
		this.r = constrain(this.r,1,this.maxSize);

		// 私たちは小さなあれば、我々は黒画素を見つけるまで、周りに動かし続けます。
        if (this.r <= 1) {
            this.x = Math.random() * width | 0;
            this.y = Math.random() * height | 0;
            return;
        };

        // 円描画
		_ctx.globalAlpha = ((this.r / this.maxSize) * 100 |0 ) / 1000;
//		_ctx.globalAlpha = ((this.maxSize / (this.r*this.r)) * 100 |0 ) / 1000;
//		_ctx.globalAlpha= 1;
		
//		_ctx.lineWidth 	= 0.1;
//		_ctx.lineWidth = this.r;

		_ctx.fillRect(this.x, this.y,this.r,this.r);
		
//        _ctx.beginPath();
//        _ctx.arc(this.x, this.y, this.r, 0, this.endAngle, false);
//        _ctx.fill();
//		_ctx.moveTo(_x,_y);
//		_ctx.lineTo(this.x,this.y);
//        _ctx.stroke();
		
		this.noiseScale 	+= 0.001;
		this.noiseStrength 	+= (Math.random()*20 - 10) / 1000;
		this.maxSize 		+= (Math.random()*2 - 1);

    };
	
	
	
	
	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @class FuzzyText
     * @constructor
     */
	var FuzzyText = function(_param) {
		
		//public property
		this.message 		= _param.message;
		this.doTextWrite	= false;
		this.doVerticalText = false;
		this.doExplode		= false;
		this.displayOutline = false;
		this.bgColor		= "rgba(255,255,255,1)";

		
		if(_param.width){
			width = _param.width;
			canvasElm.setAttribute('width', width);
		}
		if(_param.height){ 
			height = _param.height;
			canvasElm.setAttribute('height', height);
		}
        ctx.font = _param.fontFamily || this.fontSize + "px" + this.fontFamily;

        // Instantiate some particles
        for (var i = 0; i < this.particleLength; i++) {
			particles[i] = new Particle(Math.random() * width, Math.random() * height);
        }
		
		var _self = this;
		canvasElm.addEventListener("mousedown",function(){
			this.bgColor 	= "rgba(255,255,255,"+ Math.random()*1 +")";
			_self.doExplode =  true;
		});
		canvasElm.addEventListener("mouseup",function(){
			this.bgColor 	= "rgba(255,255,255,1)";
			_self.doExplode =  false;
		});

		
		this.createBitmap(this.message);
    },
        Member = FuzzyText.prototype;
	
	
	
	
	/*Public static property
	--------------------------------------------------------------------*/
	Member.particleLength	= 3000;
	Member.fontSize			= 65;
	Member.fontFamily		= " Hiragino Mincho ProN, helvetica, arial, sans-serif";
	Member.textAscent 		= Member.fontSize + 35;
	Member.textOffsetLeft 	= 650;
	Member.letterSpacing	= 15;
	Member.lineHeight		= 45;
//	Member.colors 			= ["#666","#333","#ffe200","#f87300","#fff"];
	Member.colors 			= ["#666","#a8eeff","#ff27c5","#fff"];
	Member.bgAlpha			= 0.1;


	
	
	/*Public Method
	--------------------------------------------------------------------*/
	/**
	 * メッセージに基づいてピクセルのビットマップを作成
	 * メッセージプロパティを変更するたびに呼ばれる
	 * 白背景は色の値でパーティクルを操作する為の下地の処理
	 * @param {string} _msg メッセージテキスト
	 */
	Member.createBitmap = function(_msg) {
		var _c = ctx;
		_c.fillStyle = "#fff";
		_c.fillRect(0, 0, width, height);
		_c.fillStyle = "#000";
		
		this.createTextBitmap(_msg);
//		this.createImageBitmap();
	};
	
	/**
	 * 文字でビットマップの下地を作成
	 * @param {string} _msg 表記するメッセージ
	 */
	Member.createTextBitmap = function(_msg) {
		var _c = ctx,
			_textParam = {
				text:_msg,
				x:this.textOffsetLeft,
				y:this.textAscent,
				letterSpacing:this.letterSpacing,
				lineHeight:this.lineHeight,
				displayOutline:this.displayOutline
			};
		
		//ビットマップ文字のピクセルデータを取得
		verticalTexts(_textParam);
		pixels = _c.getImageData(0, 0, width, height).data;
		_c.fillStyle = "#fff";
		_c.clearRect(0, 0, width, height);

		//ベース文字を残す為の設定
		if(this.doTextWrite){
			verticalTexts(_textParam);
			_c.globalCompositeOperation = "multiply";
		}

//		_c.fillStyle = this.bgColor;
//		_c.fillRect(0,0,width,height);
//		_c.globalAlpha = 1;

//		this.loop();
		for(var i=0; i<500; i++) this.render();
			
	};
	
	/**
	 * 画像でビットマップの下地を作成
	 */
	Member.createImageBitmap = function(){
		var _self	= this,
			_c 		= ctx,
			_img 	= new Image();
		_c.fillStyle= "#fff";
		
		_img.src = "images/illust_grayscale_02.png";
		_img.src = "images/illust_grayscale.png";

		_img.onload = function(){
			_c.drawImage(_img,0,0);

			// ビットマップ文字のピクセルデータ
			var imageData = _c.getImageData(0, 0, width, height);
			pixels = imageData.data;
			
			_c.clearRect(0, 0, width, height);

			_c.fillStyle = _self.bgColor;
			_c.fillRect(0,0,width,height);
			_c.globalAlpha = 1;
			_c.globalCompositeOperation = "multiply";

			_c.beginPath();
			_c.moveTo(0,0);
			_self.loop();
//			for(var i=0; i<1500; i++) _self.loop();
//			_c.stroke();
		};
	};

	/**
	 * フレームごとに一度呼び出され、アニメーションを更新
	 */
	Member.render = function() {
		var _c = ctx,
			_particles	= particles,
			_colors		= this.colors;

		//パーティクル描画の下地処理
//		_c.globalCompositeOperation = "source-over";
		_c.fillStyle = this.bgColor;
//		_c.globalAlpha = this.bgAlpha;
//		_c.fillRect(0,0,width,height);
		if(this.doExplode){
			this.explode();
			_c.fillRect(0,0,width,height);
		}

		//アウトライン描画モード
//		if (this.displayOutline) {
//			_c.globalCompositeOperation = "source-over";
//			_c.strokeStyle 	= "#000";
//			_c.lineWidth 	= .5;
//			_c.strokeText(this.message, this.textOffsetLeft, this.textAscent);
//		};

		//パーティクルのレンダリング
		for (var i = 0; i < _particles.length; i++) {
			_c.fillStyle = _c.strokeStyle = _colors[i % _colors.length];
			_particles[i].render();
		}
	};

	/**
	 * アニメーションのループ
	 */
	Member.loop = function() {
		this.render();
		window.requestAnimationFrame(this.loop.bind(this));
	};
	
    /**
     * パーティクル拡散処理
     */
    Member.explode = function() {
        var _mag 		= Math.random() * 50,
			_pi 		= Math.PI * 2,
			_particles	= particles;
		
		for(var i = 0; i<_particles.length; i++){
			var _p 		= particles[i],
				_angle  = Math.random() * _pi;
			
			_p.vx = Math.cos(_angle) * _mag;
			_p.vy = Math.sin(_angle) * _mag;
		}
    };



    window.FuzzyText = FuzzyText;
}(window, document));