function init(){


	/*============================================================
	全体共通　変数
	============================================================*/

	var win = window;
	var doc = document;

	//const ページ情報
	var p = page;
	var s_pageUA = p.UA();
	var s_pageVER = p.VER();

	// DOM
	var myCanvas = doc.getElementById("myCanvas");

	// 変数
	var n_scr = 0;
	var n_iw = win.innerWidth || doc.body.clientWidth;
	var n_ih = win.innerHeight || doc.body.clientHeight;
	

	/*============================================================
	オノマトッター　CANVAS
	============================================================*/
	//function canvas 処理開始関数
	function fractalContent(){

		//数値・配列
		var winW = 0;
		var winH = 0;


		/*============================================================
		CANVAS描画処理
		============================================================*/
		// createjsオブジェクト
		var canvas = myCanvas;
		var stage = new createjs.Stage(canvas);
		var tween = createjs.Tween;
		var tick = createjs.Ticker;
		var ease = createjs.Ease;
		var shadow;
		var queue;

		var onomaZone = new createjs.Container();	//フラクタル用エリア

		// canvasサイズ
		var n_canvasWidth = 0;	//幅
		var n_canvasHeight = 0;	//高さ
		var n_halfWidth = 0;

		// フォント関連
		var arr_fonts = ['A1 Mincho','ソフトゴシック R','Ryumin Light KL',"Pokkru-B","Haruhi Gakuen","中ゴシックBBB"];
		var arr_colors = ["#4dccd7"];
		var indexNumber = arr_fonts.length * Math.random() >> 0;    // フォント配列用　番号

		var flgWin = (navigator.platform.indexOf("Win") != -1)? true : false;
		var balloonfont = (flgWin === true)? "'メイリオ'" : "'Hiragino Kaku Gothic Pro'";
		var fY = 0;
		if(flgWin === true){
			if(s_pageUA === "webkit"){
				fY = 12;
				if(indexNumber < 2) fY = 2;
			}
		}

		// 流動型配列オブジェクト関連
		var poolParticle = [];
		var poolTextField = [];
		var arrOnoma = ["test","test"];
		var n_TextField = 0;

		var flgAmount = true;
		var flgPlayd = true;

		//オノマトペの単語数
		var onoLen = 390;

		var n_snm = 8;

	
		/*object リサイズ用オブジェクト
		--------------------------------------------------------------------*/
		var Resizer = function(){};
		Resizer.prototype = {
			winCheck:function(){
				numWidth = win.innerWidth || doc.body.clientWidth;
				numHeight = win.innerHeight || doc.body.clientHeight;
				return false;
			},
			canvasResize:function(){
				myCanvas.width = numWidth;
				myCanvas.height = numHeight;
				mousePoint = {x:numWidth/2,y:numHeight/2};
				return false;
			}
		};
		var resizer = new Resizer();

		
		/*function リサイズ実行
		--------------------------------------------------------------------*/
		var resizeFunc = function(){
			resizer.winCheck();
			resizer.canvasResize();
			endFractal();
			return false;
		};
		
		
		/*初期化関数　ローディング処理
		--------------------------------------------------------------------*/
		// コンテンツ初期化関数：canvasの取得、Stageオブジェクトの設定
		var initContent = function() {
			//$canvas.show();
			sortBox = [];
			stage.enableMouseOver();
			queue = [];
			resetContent();
			alert(0);
		};

		//function canvasリセット関数
		var resetContent = function() {
			tick.removeEventListener("tick", handleTick);

			winW = win.innerWidth;
			winH = win.innerHeight;

			// 最初のオブジェクトが領域を設定する
			n_canvasWidth = winW;
			n_canvasHeight = (winH > 600) ?  winH-70-14 : 530;

			n_halfWidth = n_canvasWidth>>1;
			myCanvas.width = n_canvasWidth;
			myCanvas.height = n_canvasHeight;

			queue = [new createjs.Rectangle(0,0,n_canvasWidth, n_canvasHeight)];
			n_TextField = 1;

			poolParticle = [];
			poolTextField = [];
			n_TextField = 0;

			//タイマー部分
			onomaZone.removeAllChildren();

			//ロゴ用マスク
			stage.removeAllChildren();
			stage.addChild(onomaZone);
			stage.clear();
			stage.update();

			//Stageのイベント指定
			tick.setFPS(30);
			tick.useRAF = true;
			tick.addEventListener("tick", handleTick);
			stage.enableMouseOver(n_snm);

			return false;
		}


		/*フラクタル処理の完了時のリセット処理
		--------------------------------------------------------------------*/
		var changeTimeOut = function(){
			queue = [new createjs.Rectangle(0,0,n_canvasWidth, n_canvasHeight)];
			poolParticle = [];
			poolTextField = [];
			n_TextField = 0;

			//オブジェクトのremove、配列の初期化
			onomaZone.removeAllChildren();
			return false;
		}


		/*function Tickerオブジェクトのリスナー関数
		--------------------------------------------------------------------*/
		var handleTick = function() {
			var i = 0;
			var n = 0;
			var minSize = 8;
			var qlen = queue.length;

			if(qlen > 0) {
				var rect = queue.pop();//Rectangleオブジェクト代入
				if (rect.width > minSize && rect.height > minSize) fillRegion(rect);
				if(qlen > 1) {
					var rect2 = queue.pop();//Rectangleオブジェクト代入
					if (rect2.width > minSize && rect2.height > minSize)  fillRegion(rect2);
				}
			}

			stage.update();

			return false;
		}


		/*function テキストエリア描画・アニメーション
		--------------------------------------------------------------------*/
		function fillRegion(region) {
			var q = queue;
			var len = q.length;
			var arr = arrOnoma;

			// region引数の変数
			var r = region;
			var rW = r.width;
			var rH = r.height;

			//TextFieldオブジェクト生成
			var tf = new TextField();
			var tfCont = tf.container;  //TextFieldオブジェクト内のContainerを代入
			var word = arr[0];
			tf.textSet(word);

			var tW = tf.width;
			var tH = tf.height;

			//Regionによって比率を変更させる
			//var amount = arr[n_TextField].n_amount;

			var average = Math.random()*1;
//			if(amount > 70000) average = 0.56;
//			else if(amount > 60000) average = 0.54;
//				else if(amount > 50000) average = 0.53;
//					else if(amount > 40000) average = 0.51;
//						else if(amount > 30000) average = 0.5;
//							else if(amount > 20000) average = 0.5;
//								else if(amount > 10000) average = 0.5;
//									else average = 0.5;


			// オブジェクトのサイズ（文字サイズ）の比率をコントロール
			if(word.length === 3){
				average = average -0.01;
				var s = rW / tW * average;
				if (tH * s > rH) s = rH / tH;
			}else if(word.length > 3){
//					var s = rW / tW * (rnd + average);
				average = average -0.02;
				var s = rW / tW * average;
				if (tH * s > rH) s = rH / tH;
			}else{
				average = average +0.1;
//					var s = rH / tH * (rnd + average);
				var s = rH / tH * average;
				if (tW * s > rW) s = rW / tW;
			}

			//オブジェクトをコンテンツの比率にあわせる
			tfCont.scaleX = tfCont.scaleY = s;
			var bW  = tW*s;
			var bH = tH*s;
			var rX = r.x;
			var rY = r.y;

			// tf.txt.lineHeight = 1;

			tf.border(s);
			tf.width = bW;
			tf.height = bH;

			var size= (bW*bH)>>0;
			if(size > 3500) tf.addEvent();


			var num = rndArray();
			var len2 = len+1;

			if(num === 1){
				tfCont.x = rX;
				tfCont.y = rY;
				q[len] = new createjs.Rectangle(rX + bW, rY, rW - bW, bH);
				q[len2] = new createjs.Rectangle(rX, rY + bH, rW, rH - bH);
			}else if(num === 2){
				tfCont.x = rX;
				tfCont.y = (rY + rH) - bH;
				q[len] = new createjs.Rectangle(rX + bW, (rY + rH) - bH, rW - bW, bH);
				q[len2] = new createjs.Rectangle(rX, rY, rW, rH - bH);
			}else if(num === 3){
				tfCont.x = (rX + rW) - bW;
				tfCont.y = rY;
				q[len] = new createjs.Rectangle(rX, rY, rW - bW, bH);
				q[len2] = new createjs.Rectangle(rX, rY + bH, rW, rH - bH);
			}else{
				tfCont.x = (rX + rW) - bW;
				tfCont.y = (rY + rH) - bH;
				q[len] = new createjs.Rectangle(rX, (rY + rH) - bH, rW - bW, bH);
				q[len2] = new createjs.Rectangle(rX, rY, rW, rH - bH);
			}

			tfCont.y += bH;
			tfCont.alpha = 0;

			var dly = 500*num;
			var spd = (size > 100) ? 160:0;

			onomaZone.addChild(tfCont);
			tween.get(tfCont).to({alpha:1},spd, ease.linear);
			n_TextField++;

			return false;
		}

		//getter　配列を引数で取得して、格納している要素をランダムに取り出す
		function rndArray(ary){
			var arr = [1, 2, 3, 4];
			var len = 4;
			var num = arr[Math.floor(len * Math.random())];
			return num;
		}

		//getter　配列を引数で取得して、格納している要素をランダムに取り出す
		function rndNum(ary){
			var num = (ary.length * Math.random())>>0;
			return num;
		}


		/*切替時終了関数
		--------------------------------------------------------------------*/
		function endFractal(){
			tick.removeEventListener("tick", handleTick);

			queue = null;
			poolParticle = null;
			poolTextField = null;
			arrOnoma = null;

			//タイマー部分
			stage.removeAllChildren();
			onomaZone.removeAllChildren();

			stage.clear();
			stage.update();
			
			setTimeout(resetContent,10);


			return false;
		}



		/*============================================================
		//object TextFieldオブジェクト
		============================================================*/
		function TextField(){

			var that = this;
			that.size = {w:0,h:0};

			// Cotainerクラス
			that.container = new createjs.Container();
			that.container.x = 0;
			that.container.y = 0;

			// Textクラス
//                that.txt =  new createjs.Text();
			var txt =  new createjs.Text();
//                txt.name = "text";
			txt.textAlign = "start";
			txt.textBaseline = "bottom";
			txt.mouseEnabled = false;
			this.txt = txt;

			// Shapeクラス
			that.rect = new createjs.Shape();
			that.number = n_TextField;

			that.rectOver = new createjs.Shape();
			that.rectOver.mouseEnabled = false;
			that.rectOver.shadow = shadow;
			// that.txtOver;
			that.overCont = new createjs.Container();
			return false;
		};


		/*TextFieldプロトタイプ
		--------------------------------------------------------------------*/
		TextField.prototype = {
			textSet:function(text){
				var that = this;
				var txt = that.txt;
				var font = arr_fonts[indexNumber];
				var _style = "72px '"+font+"'";
				var bound;

				txt.text = text;
				txt.font = _style;
				txt.color = "#2ba3de";
				txt.lineHeight = 72;
				bound = txt.getBounds();
				that.width = bound.width;
				that.height = bound.height;
				return false;
			},
//                bg:function(bg){
//                    this.rect = cjs.rect(0,0,this.txt.getMeasuredWidth(),this.txt.getMeasuredHeight(),bg);
//                    this.container.addChild(this.rect);
//                    this.container.addChild(this.txt);
//                    return false;
//                },
			border:function(s){

				var that = this;
				var w = that.width;
				var h = that.height;
				var word = that.txt.text;
				var wlen = word.length;
				var dis = w/wlen;
				var size = 1/s;
				var size2 = size/3;
				var bgColor = "#fff";
				var borderColor = "rgba(7,151,222,0.5)";

				var _cont = that.container;
				var _rect = that.rect;
				var _txt = that.txt;
				var _overCont = that.overCont;
				var _rectOver = that.rectOver;
				var _txtOver = that.txtOver;

				// 背景Shape
				var g = _rect.graphics;
				var g2 = that.rectOver.graphics;

				g.beginFill(bgColor).beginStroke(borderColor).setStrokeStyle(size).drawRect(0,-h,w,h).setStrokeStyle(size2).beginStroke("#2eafef");
				g2.beginFill("#2ba3de").drawRect(0,-h,w,h).setStrokeStyle(size2).beginStroke("#4ec5fe");

				for(var i=1; i<wlen; i++){
					var distance = dis*i;
					g.moveTo(distance,-h).lineTo(distance,0);
					g2.moveTo(distance,-h).lineTo(distance,0);
				}
				g.closePath().endFill();
				g2.closePath().endFill();


//                    _rectOver.shadow = shadow;

				_txt.y = fY;

				//ロールオーバーText
				_txtOver = _txt.clone();
				_txtOver.color = "#fff";

				_overCont.alpha= 0;
				_overCont.addChild(_rectOver);
				_overCont.addChild(_txtOver);

				_cont.addChild(_rect);
				_cont.addChild(_txt);
				_cont.addChild(_overCont);

//                    _rect.cache(this.container.x,this.container.y,w,h);

//                     _txt.cache(0,-h,w,h,s);
				return false;
			},
			mouseOverEvent:function(){
				return false;
			},
			mouseOutEvent:function(){
				return false;
			},
			addEvent:function(){
				var mouseOverHandler = function(e){
				}
				var mouseOutHandler = function(e){
				}
				return false;
			}
		};
		
		initContent();

		win.addEventListener("resize",resizeFunc,false);


		return false;
	};
	
	
	fractalContent();
	

	return false;
};

if(window.addEventListener) window.addEventListener("load", init, false);
else window.attachEvent("onload", init);
