function Test(){
	"use strict";
	this.init();
};
Test.prototype = {
	init:function(){
		console.log("test");
	}
};
(function () {
	"use strict";
	var local = new Test();

}());


function Test(){
	"use strict";
	this.init();
};
Test.prototype = {
	init:function(){
		console.log("test");
	}
};
this.Test = this.Test || {};
