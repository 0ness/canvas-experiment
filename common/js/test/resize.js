//SCRIPT START

function init(){
	
	
	/*const 定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	const win = window;
	const doc = document;
	const canvas = doc.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");
	

	/*var 変数
	--------------------------------------------------------------------*/
	//数値 
	var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
	var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ
	

	/*function サイズチェック
	--------------------------------------------------------------------*/
	var sizeCheck = function(){
		n_iw = win.innerWidth || doc.body.clientWidth;
		n_ih = win.innerHeight || doc.body.clientHeight;
		canvas.width = n_iw;
		canvas.height = n_ih;
		return false;
	};

	
	/*function 線描画
	--------------------------------------------------------------------*/
	var draw = function(){
		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = 10;
		ctx.clearRect(0,0,n_iw,n_ih);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(n_iw,n_ih);
		ctx.stroke();
		console.log(n_iw,n_ih);
		return false;
	};
	
	
	/*function リサイズ実行
	--------------------------------------------------------------------*/
	var resizeFunc = function(){
		sizeCheck();
		draw();
		return false;
	};
	
	
	/*contents 処理分岐
	--------------------------------------------------------------------*/
	resizeFunc();
	setTimeout(function(){win.addEventListener("resize",resizeFunc,false);},100);

	return false;
}



$(window).on("load",init);
//SCRIPT END