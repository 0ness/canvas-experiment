importScripts('LZWEncoder.js', 'NeuQuant.js', 'GIFEncoder.js');      /* imports three scripts */

var encoder = new GIFEncoder(),
	isFraming	= false,
	recStart = function(data){
		console.log("start worker");
		encoder.setRepeat(data.repeat);
		encoder.setDelay(data.delay);
		encoder.setSize(data.width, data.height);
		encoder.start();
	},
	recFrame = function(e){
		if(isFraming) return false;
//		isFraming = true;
//		console.log("finish worker");
		encoder.addFrame(e.data.data, true);
//		isFraming = false;
	},
	recFinish = function(){
		isFraming = true;
		encoder.finish();
		postMessage(encoder.stream().getData());
	};

self.addEventListener('message', function(e) {
	switch (e.data.cmd) {
		case 'start':
			recStart(e.data.data);
			break;
		case 'frame':
			recFrame(e);
			break;
		case 'finish':
			recFinish();
			break;
	}
});




/*
self.onmessage = function(event) {
  //console.log("message!");
  //alert("message");
  //self.postMessage(event.data);
  //return;
  var frame_index,
    frame_length,
    height, 
    width,
    delay,
    imageData; //get it from onmessage

  frame_index = event.data["frame_index"];
  frame_length = event.data["frame_length"];
  height = event.data["height"];
  width = event.data["width"];
  imageData = event.data["imageData"];
  delay = event.data["delay"];

  var encoder = new GIFEncoder(); //create a new GIFEncoder for every new job
  encoder.setRepeat(0); 	//0  -> loop forever
  //1+ -> loop n times then stop
  encoder.setQuality(1);
  encoder.setSize(width, height); 
  encoder.setDelay(delay);	//go to next frame every n milliseconds

  if(frame_index == 0)
  {

    encoder.start();
  }
  else
  {
    //alert();
    encoder.cont();
    encoder.setProperties(true, false); //started, firstFrame
  }

  encoder.addFrame(imageData, true);
  if(frame_length == frame_index)
  {
    encoder.finish();
  }
  self.postMessage({"frame_index":frame_index, "frame_data":encoder.stream().getData()}) //on the page, search for the GIF89a to see the frame_index
};*/