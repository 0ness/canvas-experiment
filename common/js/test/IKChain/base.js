/*==============================================================================

サイト内部　機能・演出用

・基本の状態を維持する必要は無く、プロジェクトによってカスタマイズする
・機能実装→演出実装→最適化処理のフローで構築

==============================================================================*/


page.idCheck();

window.requestAnimationFrame = (function() {
return window.requestAnimationFrame ||
	 window.webkitRequestAnimationFrame;
}());


//SCRIPT START
function init(){


	/*const 紐の位置を格納したJSON
	--------------------------------------------------------------------*/
	const point01Json = [{"x":266,"y":392},{"x":266,"y":383},{"x":265,"y":373},{"x":265,"y":364},{"x":265,"y":355},{"x":264,"y":346},{"x":259,"y":339},{"x":252,"y":335},{"x":243,"y":334},{"x":234,"y":334},{"x":225,"y":334},{"x":215,"y":334},{"x":206,"y":334},{"x":196,"y":334},{"x":188,"y":335},{"x":181,"y":340},{"x":177,"y":347},{"x":176,"y":355},{"x":176,"y":365},{"x":176,"y":374},{"x":176,"y":384},{"x":176,"y":393},{"x":176,"y":402},{"x":177,"y":411},{"x":180,"y":418},{"x":187,"y":423},{"x":195,"y":425},{"x":205,"y":425},{"x":214,"y":425},{"x":223,"y":425},{"x":233,"y":425},{"x":242,"y":425},{"x":252,"y":425},{"x":261,"y":425},{"x":270,"y":425},{"x":280,"y":425},{"x":289,"y":425},{"x":299,"y":425},{"x":308,"y":425},{"x":317,"y":425},{"x":327,"y":425},{"x":335,"y":422},{"x":341,"y":417},{"x":344,"y":409},{"x":344,"y":400},{"x":344,"y":391},{"x":344,"y":381},{"x":344,"y":372},{"x":344,"y":362},{"x":344,"y":353},{"x":344,"y":344},{"x":344,"y":334},{"x":344,"y":325},{"x":344,"y":315},{"x":344,"y":306},{"x":344,"y":297},{"x":344,"y":287},{"x":344,"y":278},{"x":344,"y":268},{"x":345,"y":262},{"x":346,"y":256},{"x":350,"y":250},{"x":356,"y":246},{"x":365,"y":244},{"x":373,"y":244},{"x":381,"y":244},{"x":388,"y":244},{"x":396,"y":244},{"x":403,"y":244},{"x":413,"y":244},{"x":422,"y":244},{"x":432,"y":244},{"x":440,"y":243},{"x":445,"y":239},{"x":443,"y":233},{"x":438,"y":226},{"x":431,"y":219},{"x":425,"y":212},{"x":418,"y":205},{"x":412,"y":198},{"x":406,"y":191},{"x":399,"y":184},{"x":393,"y":177},{"x":387,"y":170},{"x":380,"y":163},{"x":374,"y":156},{"x":368,"y":147},{"x":364,"y":138},{"x":363,"y":128},{"x":362,"y":118},{"x":362,"y":108},{"x":362,"y":99},{"x":362,"y":90},{"x":362,"y":80},{"x":362,"y":71},{"x":362,"y":61},{"x":362,"y":52},{"x":362,"y":43},{"x":362,"y":33},{"x":362,"y":24},{"x":361,"y":15},{"x":357,"y":8},{"x":350,"y":3},{"x":342,"y":2},{"x":333,"y":2},{"x":323,"y":2},{"x":314,"y":2},{"x":306,"y":5},{"x":300,"y":10},{"x":297,"y":18},{"x":297,"y":27},{"x":297,"y":37},{"x":297,"y":46},{"x":296,"y":55},{"x":296,"y":58},{"x":293,"y":61},{"x":288,"y":61},{"x":280,"y":54},{"x":275,"y":48},{"x":268,"y":41},{"x":262,"y":34},{"x":255,"y":27},{"x":249,"y":20},{"x":243,"y":13},{"x":236,"y":6},{"x":230,"y":1},{"x":222,"y":0},{"x":214,"y":2},{"x":208,"y":8},{"x":201,"y":15},{"x":195,"y":22},{"x":188,"y":29},{"x":182,"y":36},{"x":176,"y":43},{"x":169,"y":49},{"x":163,"y":56},{"x":157,"y":63},{"x":150,"y":70},{"x":144,"y":77},{"x":138,"y":84},{"x":131,"y":91},{"x":125,"y":98},{"x":118,"y":105},{"x":112,"y":112},{"x":106,"y":119},{"x":99,"y":126},{"x":93,"y":132},{"x":87,"y":139},{"x":80,"y":146},{"x":74,"y":153},{"x":67,"y":160},{"x":61,"y":167},{"x":55,"y":174},{"x":48,"y":181},{"x":42,"y":188},{"x":36,"y":195},{"x":29,"y":202},{"x":23,"y":209},{"x":17,"y":216},{"x":10,"y":222},{"x":4,"y":229},{"x":0,"y":236},{"x":2,"y":242},{"x":9,"y":244},{"x":18,"y":244},{"x":28,"y":244},{"x":37,"y":244},{"x":46,"y":244},{"x":56,"y":244},{"x":65,"y":244},{"x":75,"y":244},{"x":84,"y":244},{"x":93,"y":244},{"x":103,"y":244},{"x":112,"y":244},{"x":122,"y":244},{"x":131,"y":244},{"x":140,"y":244},{"x":150,"y":244},{"x":159,"y":244},{"x":169,"y":244},{"x":178,"y":244},{"x":187,"y":244},{"x":197,"y":244},{"x":206,"y":244},{"x":216,"y":244},{"x":225,"y":244},{"x":234,"y":244},{"x":244,"y":244},{"x":253,"y":244},{"x":263,"y":244},{"x":272,"y":244},{"x":281,"y":244},{"x":291,"y":244},{"x":300,"y":244},{"x":309,"y":243},{"x":315,"y":238},{"x":319,"y":231},{"x":318,"y":223},{"x":313,"y":217},{"x":305,"y":213},{"x":297,"y":213},{"x":287,"y":213},{"x":278,"y":213},{"x":268,"y":213},{"x":259,"y":213},{"x":250,"y":213},{"x":240,"y":213},{"x":231,"y":213},{"x":221,"y":213},{"x":212,"y":213},{"x":203,"y":213},{"x":193,"y":213},{"x":184,"y":213},{"x":174,"y":213},{"x":165,"y":213},{"x":156,"y":213},{"x":146,"y":213},{"x":137,"y":213},{"x":127,"y":213},{"x":118,"y":213},{"x":108,"y":213},{"x":100,"y":214},{"x":92,"y":218},{"x":87,"y":224},{"x":86,"y":233},{"x":86,"y":242},{"x":86,"y":251},{"x":86,"y":261},{"x":86,"y":270},{"x":86,"y":279},{"x":86,"y":289},{"x":86,"y":298},{"x":86,"y":308},{"x":86,"y":317},{"x":86,"y":326},{"x":86,"y":336},{"x":86,"y":345},{"x":86,"y":355},{"x":86,"y":364},{"x":86,"y":373},{"x":86,"y":383},{"x":86,"y":392},{"x":86,"y":402},{"x":86,"y":411},{"x":90,"y":418},{"x":96,"y":423},{"x":105,"y":425},{"x":114,"y":425},{"x":123,"y":425},{"x":133,"y":425},{"x":142,"y":425}];
	const point02Json = [{"x":397.324463103771,"y":697.291969081666},{"x":394.843513968593,"y":695.136428831976},{"x":387.764364696292,"y":688.953445123453},{"x":376.632562486706,"y":679.168473516921},{"x":361.993654539676,"y":666.206969573198},{"x":344.393188055041,"y":650.494388853112},{"x":324.376710232643,"y":632.456186917482},{"x":302.489768272322,"y":612.51781932713},{"x":279.277909373919,"y":591.104741642882},{"x":255.286680737275,"y":568.642409425555},{"x":231.061629562229,"y":545.556278235975},{"x":207.148303048622,"y":522.271803634962},{"x":184.092248396296,"y":499.214441183341},{"x":162.43901280509,"y":476.809646441931},{"x":142.734143474845,"y":455.482874971555},{"x":125.523187605401,"y":435.659582333038},{"x":111.3516923966,"y":417.7652240872},{"x":99.5403849303584,"y":401.878455897494},{"x":88.1678311430778,"y":386.49929375354},{"x":77.2786360090222,"y":371.519278380222},{"x":66.9174045024565,"y":356.82995050242},{"x":57.1287415976431,"y":342.322850845015},{"x":47.9572522688477,"y":327.889520132888},{"x":39.4475414903345,"y":313.42149909092},{"x":31.6442142363667,"y":298.810328443992},{"x":24.5918754812092,"y":283.947548916984},{"x":18.335130199127,"y":268.724701234776},{"x":12.9185833643842,"y":253.03332612225},{"x":8.38683995124393,"y":236.764964304287},{"x":4.78450493397031,"y":219.811156505768},{"x":2.15618328683013,"y":202.063443451572},{"x":0.54647998408473,"y":183.413365866582},{"x":0,"y":163.752464475679},{"x":0.95778518399857,"y":147.788462012072},{"x":3.75637668019954,"y":132.107362091286},{"x":8.28362840491263,"y":116.812241980826},{"x":14.4273942744476,"y":102.006178948198},{"x":22.0755282051132,"y":87.7922502609099},{"x":31.1158841132192,"y":74.2735331864669},{"x":41.4363159150753,"y":61.5531049923766},{"x":52.9246775269912,"y":49.7340429461456},{"x":65.4688228652758,"y":38.9194243152788},{"x":78.9566058462378,"y":29.2123263672856},{"x":93.275880386188,"y":20.7158263696701},{"x":108.314500401435,"y":13.5330015899399},{"x":123.960319808288,"y":7.76692929560068},{"x":140.101192523058,"y":3.52068675416012},{"x":156.624972462052,"y":0.89735123312403},{"x":173.419513541581,"y":0},{"x":187.547533128552,"y":0.41869479457455},{"x":201.433612474841,"y":1.68389453856071},{"x":215.031316218295,"y":3.80927227235134},{"x":228.294208996762,"y":6.80850103633929},{"x":241.17585544809,"y":10.6952538709184},{"x":253.629820210129,"y":15.4832038164814},{"x":265.609667920724,"y":21.1860239134212},{"x":277.068963217725,"y":27.8173872021307},{"x":287.961270738981,"y":35.3909667230046},{"x":298.240155122337,"y":43.9204355164338},{"x":307.859181005644,"y":53.4194666228132},{"x":316.771913026749,"y":63.9017330825363},{"x":324.931915823499,"y":75.3809079359944},{"x":332.292754033745,"y":87.8706642235829},{"x":338.807992295333,"y":101.384674985693},{"x":344.43119524611,"y":115.936613262718},{"x":344.568650542216,"y":116.340614903584},{"x":344.957111161645,"y":117.491504888892},{"x":345.560719201066,"y":119.297610812712},{"x":346.343616757146,"y":121.667260269115},{"x":347.269945926554,"y":124.508780852168},{"x":348.303848805957,"y":127.730500155943},{"x":349.409467492025,"y":131.240745774508},{"x":350.550944081425,"y":134.947845301932},{"x":351.692420670825,"y":138.760126332286},{"x":353.831942236296,"y":146.333543278057},{"x":355.541168961784,"y":153.227617364377},{"x":356.144777001205,"y":156.190719820415},{"x":356.533237620633,"y":158.7089693438},{"x":356.670692916739,"y":160.6906935286},{"x":356.615326223391,"y":163.907819829627},{"x":356.452819783713,"y":166.835149282785},{"x":356.188564058256,"y":169.484029586954},{"x":355.82794950757,"y":171.865808441014},{"x":354.839205772715,"y":175.873452594333},{"x":354.221857509647,"y":177.522013291354},{"x":352.768160494979,"y":180.165350420523},{"x":351.058399232613,"y":182.012626522403},{"x":350.120970659917,"y":182.66611093531},{"x":348.107969934254,"y":183.489510979468},{"x":345.9467141719,"y":183.743803973955},{"x":343.785458409546,"y":183.489510979468},{"x":341.772457683884,"y":182.66611093531},{"x":340.835029111187,"y":182.012626522403},{"x":339.12526784882,"y":180.165350420523},{"x":338.363716080249,"y":178.948863333791},{"x":337.671570834154,"y":177.522013291354},{"x":337.054222571085,"y":175.873452594333},{"x":336.06547883623,"y":171.865808441014},{"x":335.704864285543,"y":169.484029586954},{"x":335.440608560086,"y":166.835149282785},{"x":335.278102120408,"y":163.907819829627},{"x":335.241645593784,"y":158.991398755873},{"x":335.386152462856,"y":155.514742008783},{"x":335.657853680052,"y":151.979066700332},{"x":336.038684006122,"y":148.438458079502},{"x":336.510578201815,"y":144.94700139528},{"x":336.775028863507,"y":143.236606669704},{"x":337.055471027885,"y":141.558781896649},{"x":337.970164988083,"y":136.788333853833},{"x":338.291991614149,"y":135.308395452089},{"x":338.793518968372,"y":133.32608028348},{"x":338.968518968372,"y":132.757330283481},{"x":340.368518968377,"y":128.207330283481},{"x":347.103853740078,"y":110.143410077023},{"x":353.795533125629,"y":96.3482547317344},{"x":361.432190254679,"y":83.4216430148999},{"x":369.952458256877,"y":71.3758536938049},{"x":379.294970261873,"y":60.2231655357346},{"x":389.398359399314,"y":49.9758573079716},{"x":400.201258798848,"y":40.6462077778024},{"x":411.642301590127,"y":32.2464957125121},{"x":423.660120902796,"y":24.7889998793853},{"x":436.193349866504,"y":18.2859990457064},{"x":449.180621610898,"y":12.7497719787616},{"x":462.56056926563,"y":8.1925974458336},{"x":476.271825960346,"y":4.62675421420863},{"x":490.253024824697,"y":2.06452105117205},{"x":504.442798988328,"y":0.51817672400739},{"x":518.77978158089,"y":0},{"x":535.71929241438,"y":0.80425852864028},{"x":552.079558443633,"y":3.16295938291842},{"x":567.789708306325,"y":6.9949904653713},{"x":582.778870640132,"y":12.2192396785367},{"x":596.976174082725,"y":18.7545949249507},{"x":610.310747271784,"y":26.5199441071509},{"x":622.711718844983,"y":35.4341751276743},{"x":634.108217439994,"y":45.4161758890577},{"x":644.429371694496,"y":56.3848342938381},{"x":653.604310246163,"y":68.2590382445533},{"x":661.562161732669,"y":80.95767564374},{"x":668.23205479169,"y":94.3996343939352},{"x":673.543118060901,"y":108.503802397676},{"x":677.424480177979,"y":123.189067557499},{"x":679.805269780596,"y":138.374317775941},{"x":680.614615506431,"y":153.978440955539},{"x":679.866879211475,"y":172.917681815728},{"x":677.6899568954,"y":191.607719596306},{"x":674.183278411396,"y":210.029552219972},{"x":669.446273612653,"y":228.164177609425},{"x":663.578372352362,"y":245.992593687363},{"x":656.679004483716,"y":263.495798376485},{"x":648.847599859901,"y":280.654789599492},{"x":640.18358833411,"y":297.45056527908},{"x":630.786399759532,"y":313.864123337951},{"x":620.755463989361,"y":329.876461698802},{"x":610.190210876783,"y":345.468578284333},{"x":599.19007027499,"y":360.621471017242},{"x":587.854472037174,"y":375.316137820229},{"x":576.282846016522,"y":389.533576615991},{"x":564.574622066228,"y":403.254785327229},{"x":552.829230039481,"y":416.460761876641},{"x":539.74702218689,"y":430.095290800588},{"x":523.401765767863,"y":445.965778721228},{"x":504.360162212362,"y":463.642327477976},{"x":483.188912950349,"y":482.695038910243},{"x":460.454719411786,"y":502.69401485744},{"x":436.724283026631,"y":523.20935715898},{"x":412.564305224849,"y":543.811167654275},{"x":388.541487436401,"y":564.069548182736},{"x":365.222531091249,"y":583.554600583776},{"x":343.174137619352,"y":601.836426696808},{"x":322.963008450673,"y":618.485128361243},{"x":305.155845015174,"y":633.070807416493},{"x":290.319348742816,"y":645.16356570197},{"x":279.02022106356,"y":654.333505057087},{"x":271.825163407368,"y":660.150727321255},{"x":269.300877204201,"y":662.185334333885}];


	/*const DOMイベント
	--------------------------------------------------------------------*/
	//オブジェクト
	const doc = document;
	const win = window;
	const main = doc.getElementById("wrapper");

	const maxSection = 8;
	const distanceCheck = 60;
	const s_pageDevice = page.device();
	const s_btnEvent = (s_pageDevice === "pc")? "click" : "touchstart";
	const s_tranEvent = (s_pageDevice === "android")? "webkitTransitionEnd" : "transitionend";

	
	/*const canvas用
	--------------------------------------------------------------------*/
	const canvas = doc.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const strStrokeColor = "#e0132f";
	const numCanvasWidth = 1536;
	const numCanvasHeight = 1500;

	const numAngle = 3.141592653589793<<1;
	const numLineWidth = 4;
	const numStrength = 0.895; // No springiness
	const numInterval = 2;
	const numSegment = 750;
	const numCoursePoint = 8;
	const numScrollStart = -2670;
	const numScrollEnd = -2610;
	const numFps_high = 40;
	const numFps_normal = 40;
	const numFps_low = 40;


	/*var DOMイベント
	--------------------------------------------------------------------*/
	var flgAnim = true;
	var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
	var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ


	/*var canvas用
	--------------------------------------------------------------------*/
	var numFps = numFps_normal;
	var numPointLen = 0;
	var strNowMode = "move";
	var strOldClass = "";
	var strNowClass = "";
	var flgTimer = true;

	var arrSegment = [];
	var aryPoint = [];
	var aryPoint_01 = [];
	var aryPoint_02 = [];
	var aryCourse = [];
	var aryScroll = [];

	var mousePoint = {x:0,y:0};
	var targetPoint = {x:0, y:0};
	var timerLoop = null;
	var timerEvent = null;
	var animID;


	/*var canvas用オブジェクト
	--------------------------------------------------------------------*/
	var chain   = null;
	var pointer = null;


	/*　オブジェクト：Location
	--------------------------------------------------------------------*/
	//座標オブジェクト
	function Location(){
		this.x = 0;		//つぶやき配列
		this.y = 0;		//つぶやき配列
		return false;
	};


	/*function セグメントをリーチさせる座標・コースを作成する
	--------------------------------------------------------------------*/
	var courseSet = function(){

		//始点と終点の取得
		var startPoint = targetPoint;
		var endPoint = aryPoint[0];

		//二点間の距離を分割
		var disX = (endPoint.x - startPoint.x)/ numCoursePoint;
		var disY = (endPoint.y - startPoint.y)/ numCoursePoint;

		//分散してルートの座標配列を作る
		var cx;
		var cy;
		var randX;
		for(var i=1,len = numCoursePoint+1; i<len; i++){
			var n = i-1;
			randX = Math.random()*50-25;
			if(i===numCoursePoint) randX = 0;
			cx = (startPoint.x+disX*i)+randX>>0;
			cy = (startPoint.y+disY*i)>>0;
			aryCourse[n] = {x:cx,y:cy};
		};

		return false;
	}


	/*object IKSegment(ポイント間の距離:Number,始点:object,終点:object)
	セグメントの各関節部分
	--------------------------------------------------------------------*/
	var IKSegment = function(interval, head, tail ) {
		this.number = 0;
		this.count = 0;
		this.mode = false;

		this.interval = interval;
		this.head = head || {x:-1, y:-1};
		this.tail = tail || {
			x:this.head.x + interval,
			y:this.head.y + interval
		};
	};
	IKSegment.prototype = {
		update:function() {
			var interval = this.interval;
			var head = this.head;
			var tail = this.tail;
			// Position derivitives
			var dx = head.x - tail.x;
			var dy = head.y - tail.y;
			var dist = Math.sqrt(dx*dx + dy*dy);
			var force = (0.5 - interval / dist * 0.5)*0.99;

			//force *= 0.99;
			var fx = force * dx;
			var fy = force * dy;

			tail.x += (fx * numStrength) * 2;
			tail.y += (fy * numStrength) * 2;
			head.x -= fx * (1-numStrength) * 2;
			head.y -= fy * (1-numStrength) * 2;

			return false;
		},
		update_02:function() {
			var interval = this.interval;
			var head = this.head;
			var tail = this.tail;
			var goal = aryPoint[this.count];


			head.x = goal.x;
			head.y = goal.y;

			var dx = head.x - tail.x;
			var dy = head.y - tail.y;
			var dist = Math.sqrt(dx*dx + dy*dy);
			var force = (0.5 - interval / dist * 0.5)*0.99;
			//force *= 0.99;

			var fx = force * dx;
			var fy = force * dy;

			tail.x += fx * (numStrength)<<1;
			tail.y += fy * (numStrength)<<1;

			return false;
		},
		countCheck:function(){
			var number = this.number;
			var limit = (numPointLen-1)-number;
			var count = this.count;


			var interval = this.interval;
			var goal = aryPoint[count];
			var head = this.head;
			var next = chain.links[number+1];

			//２点間の距離
			var x = head.x-goal.x;
			var y = head.y-goal.y;
			var distance= Math.sqrt(x*x+y*y);

			if(count > 0){
				if(next) next.mode = true;
			}
			if(this.mode === true && count === limit) return false;
			if(distance <= interval)　this.count++;

			return false;
		},
		moveUpdate:function(str){
			var interval = 0.5;
			var goal = aryCourse[this.count];
			var head = this.head;
			var tail = this.tail;

			head.x = goal.x;
			head.y = goal.y;

			var dx = head.x - tail.x;
			var dy = head.y - tail.y;
			var dist = Math.sqrt(dx*dx + dy*dy);
			var force = 0.5 - interval / dist * 0.5;

			force *= 0.99;

			var fx = force * dx;
			var fy = force * dy;

			tail.x += fx * numStrength * 2;
			tail.y += fy * numStrength * 2;

			if(this.count === numCoursePoint-1){
				numFps = numFps_normal;
				strNowMode = "illust";
				this.count = 0;
				return false;
			}

			//２点間の距離
			var x=head.x-goal.x;
			var y=head.y-goal.y;
			var distance= Math.sqrt(x*x+y*y);

			if(distance < interval)　this.count++;
			return false;
		},
		//method scrolll
		scroll:function(str){
			if(this.mode === true) return false;
			var num;
			var goal = aryPoint[this.number];
			var head = this.head;

			num = 0.1;

			head.x += (goal.x - head.x) * num;
			head.y += (goal.y - head.y) * num;

			//２点間の距離
			var x = head.x-goal.x;
			var y = head.y-goal.y;
			var distance= Math.sqrt(x*x+y*y);

			if(distance < 0.1){
				this.mode = true;
				head.x = head.x >>0;
				head.y = head.y >>0;
			};
			return false;
		}
	};


	/*object IKChain(関節数:Number,ポイント間の距離:Number)
	セグメントを統合しているグループ
	--------------------------------------------------------------------*/
	var IKChain = function( size, interval ) {

		this.links = new Array(size);
		var point = {x:0, y:0};

		for(var i = 0, n = this.links.length; i < n; ++i) {
			link = this.links[i] = new IKSegment(interval,point);
			link.number = i;
			point = link.tail;
		};
		return false;
	};
	IKChain.prototype = {
		update:function( target ) {
			var ary =  this.links;
			var link = ary[0];
			link.head= target;
			for(var i = 0; i < numPointLen; ++i) {
				link = ary[i];
				link.update();
			}
			return false;
		},
		update_02:function( target ) {
			var ary =  this.links;
			var link = ary[0];
			link.head = target;
			link.mode = true;
			for(var i = 0; i < numPointLen; ++i) {
				link = ary[i];
				if(link.mode === true) link.update_02();
				else link.update();
				link.countCheck();
			}
			return false;
		},
		//method silentUpdate
		silentUpdate:function() {
			var ary =  this.links;
			var aryPoints = aryPoint;
			var link = ary[0];
			var point;
			var len = numPointLen;
			var number = 0;

			for(var i = 0; i < len; ++i) {
				number = (len - 1) -i;
				link = ary[i];

				if(i === len-1){
					point = aryPoints[i-1];
				}else{
					point = aryPoints[i];
				}
				link.head.x = point.x;
				link.head.y = point.y;
			};

			targetPoint = aryPoints[0];
			draw();
			return false;
		},
		//method hiSpdUpdate
		hiSpdUpdate:function() {
			var ary =  this.links;
			var link = ary[0];
			var parentCount = 0;
			//link.head = targetPoint;
			link.mode = true;
			for(var i = 0; i < numPointLen; ++i) {
				link = ary[i];
				if(link.mode === true) link.update_02();
				else link.update();
				link.countCheck();
			};
			//02
			for(var i = 0; i < numPointLen; ++i) {
				link = ary[i];
				if(link.mode === true) link.update_02();
				else link.update();
				link.countCheck();
			};
			//03
			for(var i = 0; i < numPointLen; ++i) {
				link = ary[i];
				if(link.mode === true) link.update_02();
				else link.update();
				link.countCheck();
			};
			link = ary[numPointLen-1];
			if(link.mode === true){
				flgTimer = false;

				numFps = numFps_low;
				if(currentSection === 3) sec04_startEnd();
				else if(currentSection === 4) sec05_change();
			}
			return false;
		},
		moveUpdate:function( target ){
			var ary =  this.links;
			var link = ary[0];
			link.head = target;
			link.moveUpdate();
			for(var i = 1; i < numPointLen; ++i) {
				link = ary[i];
				link.update();
			}
			return false;
		},
		//method modeReset
		modeReset:function(){
			var ary =  this.links;
			var link;
			var len = numPointLen;

			for(var i = 0; i < len; ++i) {
				link = ary[i];
				link.count = 0;
				link.mode = false;
			};

			return false;
		}
	};


	/*　関数：円描画簡略（コンテキスト,x,y,半径,色）
	--------------------------------------------------------------------*/
	var circle = function(x,y,r,c) {
		ctx.beginPath();
		ctx.arc(x,y,r,0,Math.PI*2,false);
		ctx.closePath();
		if(c) {
			ctx.fillStyle = c;
			ctx.fill();
		} else {
			ctx.strokeStyle = '#000000';
			ctx.stroke();
		}
		return false;
	}


	/*function 線描画簡略（コンテキスト,始点x,始点y,終点x,終点y,半径,色）
	--------------------------------------------------------------------*/
	function line(x1,y1,x2,y2) {
		var p = _p;
		var p2 = _p2;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
		return false;
	};


	/*function 位置更新
	--------------------------------------------------------------------*/
	var update = function() {
		// 先頭目標値　Ease target towards mouse
		targetPoint.x = aryPoint[0].x;
		targetPoint.y = aryPoint[0].y;
		chain.update();
		return false;
	};
	//高速版
	var hiSpdUpdate = function(){
		targetPoint.x = aryPoint[0].x;
		targetPoint.y = aryPoint[0].y;
		chain.hiSpdUpdate();
		return false;
	};
	//移動版
	function moveUpdate(){
		targetPoint.x = aryCourse[0].x;
		targetPoint.y = aryCourse[0].y;
		chain.moveUpdate();
		return false;
	};
	var scrollUpdate = function(){
		targetPoint.x = aryPoint[0].x;
		targetPoint.y = aryPoint[0].y;
		chain.scrollUpdate();
		return false;
	};
	//変形版
	var transUpdate = function(){
		chain.transformUpdate();
		return false;
	};


	/*function canvas描画
	--------------------------------------------------------------------*/
	function draw() {
		var ary = chain.links;
		var link;
		var x1;
		var x2;
		var y1;
		var y2;
		var n = numPointLen-1;
		var c = ctx;
		circle(mousePoint.x, mousePoint.y, 5, 'rgba(255,0,0,0.5)');
		circle(targetPoint.x, targetPoint.y, 5, 'rgba(255,0,0,0.5)');
		c.beginPath();
		for(var i = 0; i < n; ++i) {
			link = ary[i];
			//circle(p1.x, p1.y, 1);
			//circle(p2.x, p2.y, 1);
			x1 = link.head.x;
			x2 = link.tail.x;
			y1 = link.head.y;
			y2 = link.tail.y;
			c.moveTo(x1,y1);
			c.lineTo(x2,y2);
		};
		c.stroke();
		
		requestAnimationFrame(draw);
		return false;
	};


	/*　関数：マウスイベント
	--------------------------------------------------------------------*/
		function mouseMoveHandler(e) {
			var rect = e.target.getBoundingClientRect();
			mousePoint.x = (e.clientX - rect.left)>>0;
			mousePoint.y = (e.clientY - rect.top)>>0;
		}


	/*function 描画ループ
	--------------------------------------------------------------------*/
//		function loop(){
//			//clearTimeout(timerLoop);
//			if(flgTimer === true) {
//				ctx.clearRect(0,250,numCanvasWidth,numCanvasHeight);
//
//				if(strNowMode === "illust") hiSpdUpdate();
//				else if(strNowMode === "move") moveUpdate();
//				else if(strNowMode === "scroll") scrollUpdate();
//				else transUpdate();
//
//				draw();
//
//				timerLoop = setTimeout(loop,numFps);
//			}
//			return false;
//		};
	function loop(){
		//clearTimeout(timerLoop);
		if(flgTimer === true) {

			var ary = chain.links;
			var link;
			var x1;
			var x2;
			var y1;
			var y2;
			var n = numPointLen-1;
			var c = ctx;
//			var flg = true;

			if(strNowMode === "illust") hiSpdUpdate();
			//else if(strNowMode === "move") moveUpdate();
			else if(strNowMode === "scroll") scrollUpdate();
			else transUpdate();

			c.clearRect(0,250,numCanvasWidth,numCanvasHeight);
			c.beginPath();
			for(var i = 0; i < n; ++i) {
				link = ary[i];
				x1 = link.head.x;
				x2 = link.tail.x;
				y1 = link.head.y;
				y2 = link.tail.y;
				c.moveTo(x1,y1);
				c.lineTo(x2,y2);
//				c.beginPath();
//				if(flg === true) c.strokeStyle = "#e0132f";
//				else c.strokeStyle = "#fc0";
//				c.moveTo(x1,y1);
//				c.lineTo(x2,y2);
//				c.stroke();
//				flg = !flg;
			};
			c.stroke();
			requestAnimationFrame(loop);
		}
		return false;
	};




	/*function JSON読み込み関連
	--------------------------------------------------------------------*/
	//ローカルJsonの取得
	function getJson(){
		//sec01
		var sec01 = function(){
			var json = point01Json;
			var px = 907;
			var py = 655;
			var len = json.length;

			for(var i = 0; i < len; i++) {
				var d = json[i];
				var p = new Location();
				p.x = (d.x+px);
				p.y = (d.y+py);
				aryPoint_01[i]=p;
			};
		}();

		//sec02
		var sec02 = function(){
			var json = point02Json;
			var px = 424;
			var py = 298;
			var len = json.length;

			for(var i = 0; i < len; i++) {
				var d = json[i];
				var p = new Location();
				p.x = (d.x+px);
				p.y = (d.y+py);
				aryPoint_02[i]=p;
			};
		}();

		return false;
	};

	
	/*function サイズチェック
	--------------------------------------------------------------------*/
	var sizeCheck = function(){
		n_iw = win.innerWidth || doc.body.clientWidth;
		n_ih = win.innerHeight || doc.body.clientHeight;
		canvas.width = n_iw-10;
		canvas.height = n_ih;
		return false;
	};

	
	/*function リサイズ実行
	--------------------------------------------------------------------*/
	var resizeFunc = function(){
		sizeCheck();
		return false;
	};
	
	
	/*　関数：開始
	--------------------------------------------------------------------*/
	var start = function() {

		getJson();
		

		//初期動作開始
		chain = new IKChain(numSegment,numInterval);

		ctx.strokeStyle = strStrokeColor;
		ctx.lineWidth = numLineWidth;
		ctx.lineCap = "round";

		resizeFunc();
		setTimeout(function(){win.addEventListener("resize",resizeFunc,false);},100);
		
		requestAnimationFrame(draw);

		return false;
	}();


	return false;
}


window.addEventListener("load",init,false);
//SCRIPT END