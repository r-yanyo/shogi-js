var SIZE = 32; //駒のサイズ
var WAKU = 34.5; //外枠から１個目までの長さ
var CWAKU = 5; //captureの間隔
var MARGIN = 15.5; //駒同士の間隔
var ADJUST = 0;
var INFINITE = 99999999;

var SENTE = true;
var GOTE = false;
var BOARD = 1;
var CAPTURE = 2;

var DAN = 9;
var SUJI = 9;

var EMPTY = 0;
var FU = 1;
var KY = 2;
var KE = 3;
var GI = 4;
var	HI = 5;
var KA = 6;
var KI = 7;
var OU = 8;
var PROMOTED = 8;
var TO = PROMOTED + FU;
var NY = PROMOTED + KY;
var NK = PROMOTED + KE;
var NG = PROMOTED + GI;
var RY = PROMOTED + HI;
var UM = PROMOTED + KA;
var ENEMY = 16;
var EFU = ENEMY + FU;
var EKY = ENEMY + KY;
var EKE = ENEMY + KE;
var EGI = ENEMY + GI;
var EKI = ENEMY + KI;
var EKA = ENEMY + KA;
var EHI = ENEMY + HI;
var EOU = ENEMY + OU;
var ETO = ENEMY + TO;
var ENY = ENEMY + NY;
var ENK = ENEMY + NK;
var ENG = ENEMY + NG;
var ERY = ENEMY + RY;
var EUM = ENEMY + UM;
var OUT = 10000;

var MAX_DEPTH = 3; //AIの最大思考深さ

var SENTE_FIELD = 7;
var GOTE_FIELD = 3;

var attack_cell; //駒の動ける範囲のcell
var selected_cell; //選択した駒

var phase; //0:通常状態　1:成の選択をしている状態 2:CPU思考
var cpuflag; //0:対人戦 1:CPU対戦

var pieces; //画像が入っている
var capture=[]; //手駒のそれぞれの枚数
var captureNum;
var senteCapture; //画像が入っている
var goteCapture;
var selectFlag;	//True or False
var bfrClickDan;
var bfrClickSuji;
var selectedPiece; //数字　FU KY 
var teban=SENTE; //true:先手　false:後手
var gyokuDan;
var gyokuSuji;
var e_gyokuDan;
var e_gyokuSuji;
var promoteFlag; //成り不成の選択
var pFlag=0; //false:成る可能性無し　true:成る可能性有り
var promoteDan;
var promoteSuji;

var board=[
	[OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT],
	[OUT,EKY,EKE,EGI,EKI,EOU,EKI,EGI,EKE,EKY,OUT],
	[OUT,0	,EHI,0	,0	,0	,0	,0	,EKA,0	,OUT],
	[OUT,EFU,EFU,EFU,EFU,EFU,EFU,EFU,EFU,EFU,OUT],
	[OUT,0	,0	,0	,0	,0	,0	,0	,0	,0	,OUT],
	[OUT,0	,0	,0	,0	,0	,0	,0	,0	,0	,OUT],
	[OUT,0	,0	,0	,0	,0	,0	,0	,0	,0	,OUT],
	[OUT,FU ,FU ,FU ,FU ,FU ,FU ,FU ,FU ,FU ,OUT],
	[OUT,0	,KA ,0	,0	,0	,0	,0	,HI ,0	,OUT],
	[OUT,KY ,KE ,GI ,KI ,OU ,KI ,GI ,KE ,KY ,OUT],
	[OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT,OUT],
];

var direction=[
	[0,-1],	//←
	[1,-1],	//←↓
	[1,0],  //↓
	[1,1], //→↓
	[0,1],	//→
	[-1,1],//→↑
	[-1,0], //↑
	[-1,-1], //←↑
	[-2,-1],//先手桂跳ね
	[-2,1],
	[2,-1],	//後手桂跳ね
	[2,1],
];

var moveRange=[
//←
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,0,2,0,1,1,1,1,1,1,2,1,1,
		 0,0,0,0,0,2,0,1,1,1,1,1,1,2,1,1
	],
//←↓
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,1,0,2,0,1,0,0,0,0,1,2,0,
		 0,0,0,0,1,0,2,1,1,1,1,1,1,1,2,1
	],
//↓
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,0,2,0,1,1,1,1,1,1,2,1,1,
		 0,1,2,0,1,2,0,1,1,1,1,1,1,2,1,1
	],
//→↓
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,1,0,2,0,1,0,0,0,0,1,2,0,
		 0,0,0,0,1,0,2,1,1,1,1,1,1,1,2,1
	],
//→
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,0,2,0,1,1,1,1,1,1,2,1,1,
		 0,0,0,0,0,2,0,1,1,1,1,1,1,2,1,1
	],
//→↑
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,1,0,2,1,1,1,1,1,1,1,2,1,
		 0,0,0,0,1,0,2,0,1,0,0,0,0,1,2,0
	],
//↑
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,1,2,0,1,2,0,1,1,1,1,1,1,2,1,1,
		 0,0,0,0,0,2,0,1,1,1,1,1,1,2,1,1
	],
//←↑
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,1,0,2,1,1,1,1,1,1,1,2,1,
		 0,0,0,0,1,0,2,0,1,0,0,0,0,1,2,0
	],
//先桂←
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
		 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
	],
//先桂→
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
		 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
	],
//後桂←
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		 0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0
	],
//後桂→
	[//  EM歩香桂銀飛角金玉と杏圭全竜馬金
		 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		 0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0
	],
];

var pieceValue=[
	//  歩  香  桂  銀    飛車  角   金   玉      と   杏  圭  全  　竜  馬   　金		王
	  0,100,400,450,800,1200,1000,900,99999999,900,800,800,750,1600,1500,750,99999999,
	//   歩   香    桂   銀    飛車  角    金     玉       と    杏   圭   全   　竜    馬   　金	　　王
	   -100,-400,-450,-800,-1200,-1000,-900,-99999999,-900,-800,-800,-750,-1600,-1500,-750,99999999
];

var captureValue=[
	[
	  //  歩   香   桂   銀   飛   角     金
	  0, 200, 550, 600, 900, 1600, 1200, 1000
	],
	[
	  //  歩    香    桂    銀     飛     角      金
	  0, -200, -550, -600, -900, -1600, -1200, -1000
	],
];

function evalMove(fd,fs,td,ts,fp,tp,etc,eval){ //f:from t:to d:dan s:suji p:piece etc: 0:none 1:promotion 2:capture
	this.fd=fd;
	this.fs=fs;
	this.td=td;
	this.ts=ts;
	this.fp=fp;
	this.tp=tp;
	this.etc=etc;
	this.eval=eval; //evaluation

	if(fd==undefined) this.fd=0;
	if(fs==undefined) this.fs=0;
	if(td==undefined) this.td=0;
	if(ts==undefined) this.ts=0;
	if(fp==undefined) this.fp=0;
	if(tp==undefined) this.tp=0;
	if(etc==undefined) this.etc=0;
	if(eval==undefined) this.eval=undefined;
}