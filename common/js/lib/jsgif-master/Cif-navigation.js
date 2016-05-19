;(function(window, document) {
	"use strict";




	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @object Cif
	 */
	var Cif = function(_param){
		
		this.encoder	= new GIFEncoder();
		this.worker		= null;
		
		this.canvas		= document.getElementById(_param.id);
		this.ctx	 	= this.canvas.getContext("2d");
		this.playBtn	= null;
		this.stopBtn	= null;
		this.dlBtn		= null;
		this.imgElm		= null;
		
		this.frameIndex = 0;
		this.frameLen 	= 0;
		
		this.loopCount	= _param.loopCount || 0;
		this.fps		= _param.fps || 100;
		this.delay		= _param.delay || 100;
		this.doRecLoop	= false;

		this.init();
	},
		Member = Cif.prototype;
	
	Member.domElm 	= document.createElement('div');
	Member.doWorker = true;
	


	
	/*method
	--------------------------------------------------------------------*/
	Member.init = function() {
		if(!this.doWorker){
			this.encoder.setSize(this.canvas.width,this.canvas.height);
			this.encoder.setRepeat(this.loopCount); //auto-loop
			this.encoder.setDelay(this.delay);
		}else{
			this.worker		= new Worker('common/js/develop/animWorker.js');
		}
		this.createDomElements();
	};
	
	/**
	 * Dom element generation
	 */
	Member.createDomElements = function(){
		var _self		= this,
			_nav 		= this.domElm,
			_body		= document.getElementsByTagName("body")[0],
			_base 		= document.createElement("div"),
			_playBtn 	= document.createElement("div"),
			_stopBtn	= document.createElement("div"),
			_dlBtn		= document.createElement("a"),
			_image		= document.createElement("img");
		
		_base.id 	= "cif-base";
		_playBtn.id = "cif-nav__play-btn";
		_stopBtn.id = "cif-nav__stop-btn";
		_dlBtn.id 	= "cif-nav__dl-btn";
		_nav.id 	= 'cif-nav';
		_image.id 	= "cif-result";
		
		_playBtn.setAttribute("class","is-played");

		_nav.appendChild(_playBtn);
		_nav.appendChild(_stopBtn);
		_nav.appendChild(_dlBtn);
		_body.appendChild(_nav);
		_body.appendChild(_image);
				
		_playBtn.addEventListener("click",function(){
			if(_self.doWorker) _self.recStartWorker();
			else _self.recStart();
		});
		_stopBtn.addEventListener("click",function(){
			if(_self.doWorker) _self.recFinishWorker();
			else _self.recFinish();
		});
		
		this.playBtn= _playBtn;
		this.stopBtn= _stopBtn;
		this.dlBtn 	= _dlBtn;
		this.imgElm = _image;
	};
	
	/**
	 * Animated GIF recording start
	 */
	Member.recStart = function(){		
		this.imgElm.className = "";
		this.imgElm.src = "";

		this.playBtn.className = "";
		this.stopBtn.className += "is-played";
		this.dlBtn.className   = "";
		
		this.encoder.start();
		this.doRecLoop = true;
		this.recFrame();
	};
	
	/**
	 * Animated GIF recording start with Worker
	 */
	Member.recStartWorker = function(){
		this.imgElm.className = "";
		this.imgElm.src = "";

		this.playBtn.className = "";
		this.stopBtn.className += "is-played";
		this.dlBtn.className   = "";
		
		console.log("start");
		var _self = this,
			option = {
				delay:   this.delay,
				repeat:  0,  // infinite
				width:   _self.canvas.width,
				height:  _self.canvas.height
			};
		this.worker.postMessage({ cmd: 'start', data: option });
		
		this.doRecLoop = true;
		
		if(this.doWorker) this.recFrameWorker();
		else this.recFrame();
	};
	
	/**
	 * Animated GIF 1 frame recording
	 */
	Member.recFrame = function(){
		if(!this.doRecLoop) return false;
		this.encoder.addFrame(this.ctx,true);
		setTimeout(this.recFrame.bind(this),this.fps);
	};
	
	/**
	 * Animated GIF 1 frame recording with Worker
	 */
	Member.recFrameWorker = function(){
		if(!this.doRecLoop) return false;
		var _self = this;
		this.worker.postMessage({
			cmd: 'frame',
			data: _self.ctx.getImageData(0, 0, _self.canvas.width, _self.canvas.height).data
		});
		setTimeout(this.recFrameWorker.bind(this),this.fps);
	};
	
	/**
	 * Animated GIF recording end
	 */
	Member.recFinish = function(){
		var _self = this,
			_url = 'data:image/gif;base64,'+encode64(_self.encoder.stream().getData());
		this.doRecLoop = false;
		this.encoder.finish();
		this.recFinishCallback();
		console.log("finish");
	};
	
	/**
	 * Animated GIF recording end with Worker
	 */
	Member.recFinishWorker = function(){
		var _self = this,
			_callback = function(e){
				var _url = 'data:image/gif;base64,' + encode64(e.data);
				_self.recFinishCallback(_url);
				_self.worker.removeEventListener('message',_callback, false);
			};
		this.doRecLoop = false;
		this.worker.addEventListener('message',_callback, false);
		this.worker.postMessage({ cmd: 'finish' });
		console.log("finish");
	};
	
	/**
	 * Animated GIF recording end Callback
	 */
	Member.recFinishCallback = function(_url){
		console.log("finish callBack");
		
		this.imgElm.src = _url;
		this.imgElm.className += "is-displayed";

		this.dlBtn.href = _url;
		this.dlBtn.setAttribute("download","cif-generate.gif");

		this.playBtn.className += "is-played";
		this.stopBtn.className = "";
		this.dlBtn.className += "is-played";
		
		this.doRecLoop = false;
	};
	





	window.Cif = Cif;
})(window, document);
