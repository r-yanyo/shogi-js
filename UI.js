function menu(){
	$("<div>")
	.attr("id","player")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("font-family",'HG行書体')
	.css("top","50px")
	.css("left","0px")
	.css("background-color","#ffffff")
	.css("width","487")
	.html("vs 人間")
	.click(function(){
		cpuflag=0;
		removeMenu();
		loadingImages();
		showboard();
		showTeban();
	})
	.appendTo("#board");

	$("<div>")
	.attr("id","computer")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("font-family",'HG行書体')
	.css("top","150px")
	.css("left","0px")
	.css("background-color","#ffffff")
	.css("width","487")
	.html("vs CPU")
	.click(function(){
		cpuflag=1;
		removeMenu();
		loadingImages();
		showboard();
		showTeban();
	})
	.appendTo("#board");

	$("<div>")
	.attr("id","special")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("font-family",'HG行書体')
	.css("top","250px")
	.css("left","0px")
	.css("background-color","#ffffff")
	.css("width","487")
	.html("スペシャル")
	.click(function(){
		cpuflag=0;
		removeMenu();
		floadingImages();
		showboard();
		showTeban();
	})
	.appendTo("#board");

}

function appendMessageField(){

	//先手後手
	$("<div>")
	.attr("id","teban")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("top","0px")
	.css("left","0px")
	.css("background-color","#aaafff")
	.css("width","200")
	.appendTo("#message");

	//王手
	$("<div>")
	.attr("id","check")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("top","70px")
	.css("left","0px")
	.css("background-color","#aabfff")
	.css("width","200")
	.appendTo("#message");

	//成
	$("<div>")
	.attr("id","promoted")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("top","150px")
	.css("left","0px")
	.css("background-color","#baafff")
	.css("width","200")
	.click(function(){selectPromote(true);})
	.html("成")
	.appendTo("#message");

	//不成
	$("<div>")
	.attr("id","unpromoted")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("top","200px")
	.css("left","0px")
	.css("background-color","#baafff")
	.css("width","200")
	.click(function(){selectPromote(false);})
	.html("不成")
	.appendTo("#message");

	$("<div>")
	.attr("id","evaluation")
	.css("position","absolute")
	.css("font-size","200%")
	.css("text-align","center")
	.css("top","300px")
	.css("left","0px")
	.css("background-color","#baafff")
	.css("width","200")
	.appendTo("#message");

	//ダイアログを消す
	$("#teban").fadeOut(0);
	$("#check").fadeOut(0);
	$("#promoted").fadeOut(0);
	$("#unpromoted").fadeOut(0);

}

function showMoving(bfrClickDan,bfrClickSuji,dan,suji){
	removeSelected();
	$("#k"+bfrClickDan+bfrClickSuji)
		.css("z-index","100")
		.animate({
			left: (suji-1)*(SIZE+1+MARGIN)+WAKU+"px",
			top: (dan-1)*(SIZE+1+MARGIN)+WAKU+"px"
		},600,"swing",function(){
			$("#K"+bfrClickDan+bfrClickSuji)
			.css("z-index","30");
			showboard();
		});
}

function showTeban(){
	if(teban==SENTE){
		$("#teban")
		.fadeOut(500,function(){
			$("#teban")
			.fadeIn(500)
			.html("先手");});
	}
	else if(teban==GOTE){
		$("#teban")
		.fadeOut(500,function(){
			$("#teban")
			.fadeIn(500);
			if(cpuflag==1) $("#teban").html("後手<br>(思考中）");
			else		   $("#teban").html("後手");
		});
	}
}

function showPromote(){
		$("#promoted").fadeIn(500);
		$("#unpromoted").fadeIn(500);
}

function showEvaluation(){
		$("#evaluation")
		.html("評価値:"+evaluate(board))
		.fadeIn(500);
}

function selectPromote(ToF){
	if(ToF==true){
		pFlag=false;
		promoteDan=0;
		promoteSuji=0;
		$("#promoted").fadeOut(500);
		$("#unpromoted").fadeOut(500);
		showboard();
		if(cpuflag==0)	phase=0;
		else if(cpuflag==1){
			phase=2; //CPU戦
			setTimeout("AIthink()",1000);
		}
	}
	else if(ToF==false){
		board[promoteDan][promoteSuji]-=PROMOTED;
		pFlag=false;
		promoteDan=0;
		promoteSuji=0;
		$("#promoted").fadeOut(500);
		$("#unpromoted").fadeOut(500);
		showboard();
		if(cpuflag==0) phase=0;
		else if(cpuflag==1){
			phase=2; //CPU戦
			setTimeout("AIthink()",1000);
		}
	}
}

function showCheck(){
	if(checkJudge(teban)==true){
		$("#check")
		.fadeIn(500)
		.html("王手");
	}
	else{
		$("#check")
		.fadeOut(500)
		.html("");
	}
}

function removeMenu(){
	$("#test1").remove();
	$("#test2").remove();
}

function showboard(){
	//AIthink(); //デバッグ；
	showCheck();
	showEvaluation();
	var b=document.getElementById("board");
	while(b.firstChild){
		b.removeChild(b.firstChild)
	}
	for(var dan=1;dan<=DAN;dan++){
		for(var suji=1;suji<=DAN;suji++){
			var c=pieces[board[dan][suji]].cloneNode(true);
			c.id = "k"+dan+suji;
			c.style.left=(suji-1)*(SIZE+1+MARGIN)+WAKU+"px";
			c.style.top=(dan-1)*(SIZE+1+MARGIN)+WAKU+"px";
			b.appendChild(c);

			if(board[dan][suji] != EMPTY){	//boardに駒がある
				(function(){
					var _dan=dan, _suji=suji;
					c.onclick=function(){
						if(phase==0){
							if(teban==tebanJudge(board[_dan][_suji])) selectTeban(_dan,_suji);
							else			 selectEnemy(bfrClickDan,bfrClickSuji,_dan,_suji);
						}
					};
				})();
			}
			else if(board[dan][suji] == EMPTY){	//boardに駒がない
				(function(){
						var _dan=dan, _suji=suji;
						c.onclick=function(){
							if(phase==0){
							selectEmpty(bfrClickDan,bfrClickSuji,_dan,_suji);
						}
					}
				})();
			}
		}
	}
}

function showSelected(dan,suji){
	var b=document.getElementById("board");
	var s=selected_cell.cloneNode(true);
	s.style.left=(suji-1)*(SIZE+1+MARGIN)+WAKU-ADJUST+"px";
	s.style.top=(dan-1)*(SIZE+1+MARGIN)+WAKU-ADJUST+"px";
	(function(){
		var _dan=dan;
		var _suji=suji;
			s.onclick=function(){
			if(phase==0){
				for ( var k = b.childNodes.length-1; k >= 0; k-- ) {
					if( b.childNodes[k].id == "selected" )b.removeChild( b.childNodes[k] );
				}
				selectTeban(_dan,_suji);
			}
		}
	})();
	b.appendChild(s);
}

function removeSelected(){
	var b=document.getElementById("board");
	for ( var k = b.childNodes.length-1; k >= 0; k-- ) {
		if( b.childNodes[k].id == "selected" )b.removeChild( b.childNodes[k] );
	}
}

function showMoveRange(dan,suji,piece){
	var b=document.getElementById("board");

	for(var i=1;i<=DAN;i++){
		for(var j=1;j<=SUJI;j++){
			if(moveJudge(dan,suji,i,j,piece)==true){ //王手関係無く動けるところ
				var tempPiece=board[i][j];
				board[i][j]=piece;
				board[dan][suji]=EMPTY;
				if(checkJudge(teban)==false){ //動いたあと王手がかからないなら動ける
					board[dan][suji]=piece;
					board[i][j]=tempPiece;

					var ac=attack_cell.cloneNode(true);
					ac.style.left=(j-1)*(SIZE+1+MARGIN)+WAKU-ADJUST+"px";
					ac.style.top=(i-1)*(SIZE+1+MARGIN)+WAKU-ADJUST+"px";
					(function(){
						var _dan=i;
						var _suji=j;
						ac.onclick=function(){
							if(phase==0){
								for ( var k = b.childNodes.length-1; k >= 0; k-- ) {
									if( b.childNodes[k].id == "move" )b.removeChild( b.childNodes[k] );
								}
								if(board[_dan][_suji]==EMPTY) selectEmpty(bfrClickDan,bfrClickSuji,_dan,_suji);
								else selectEnemy(bfrClickDan,bfrClickSuji,_dan,_suji);
							}
						}
					})();
					b.appendChild(ac);
				}
				else if(checkJudge(teban)==true){	//王手が残るなら動けない
					board[dan][suji]=piece;
					board[i][j]=tempPiece;
				}
			}
		}
	}
}

function showCaptureSelected(capSelect,capTeban){
	if(capTeban==SENTE) var b=document.getElementById("sente-capture");
	else if(capTeban==GOTE) var b=document.getElementById("gote-capture");
	var s=selected_cell.cloneNode(true);
	if(capSelect<5){
		s.style.top=(capSelect-1)*(SIZE*1.2)+CWAKU+"px";
		s.style.left=CWAKU+"px";
	}
	else if(capSelect>=5){
		s.style.top=(capSelect-5)*(SIZE*1.2)+CWAKU+"px";
		s.style.left=2*SIZE+CWAKU+"px";
	}
	(function(){
		s.onclick=function(){
			if(phase==0){
				for ( var k = b.childNodes.length-1; k >= 0; k-- ) {
					if( b.childNodes[k].id == "selected" )b.removeChild( b.childNodes[k] );
				}
				selectCapture(capSelect,capTeban);
			}
		};
	})();
	b.appendChild(s);
}

function showSenteCapture(){
	var s=document.getElementById("sente-capture");
	while(s.firstChild){
		s.removeChild(s.firstChild);
	}
	for(var i=1;i<8;i++){
		if(capture[0][i]!=0){
			var d=senteCapture[i].cloneNode(true);
			d.style.top=(i-1)*18+"px";
			var t=document.getElementById("text").cloneNode(true);
			if(i<5){
				t.innerHTML="×"+capture[0][i];
				t.style.top=(i-1)*(SIZE*1.2)+CWAKU+"px";
				t.style.left=SIZE+CWAKU+"px";
				d.style.top=(i-1)*(SIZE*1.2)+CWAKU+"px";
				d.style.left=CWAKU+"px";
				s.appendChild(d);
				s.appendChild(t);
			}
			else if(i>=5){
				t.innerHTML="×"+capture[0][i];
				t.style.top=(i-5)*(SIZE*1.2)+CWAKU+"px";
				t.style.left=2*SIZE+SIZE+CWAKU+"px";
				d.style.top=(i-5)*(SIZE*1.2)+CWAKU+"px";
				d.style.left=2*SIZE+CWAKU+"px";
				s.appendChild(d);
				s.appendChild(t);
			}
		}
		if(capture[0][i] != 0){	//Captureに駒がある
				(function(){
					var _i=i;
					d.onclick=function(){
						if(phase==0){
							if(teban==SENTE){
								selectCapture(_i,SENTE);
							}
						}
					};
				})();
			}
	}
}



function showGoteCapture(){
	var s=document.getElementById("gote-capture");
	while(s.firstChild){
		s.removeChild(s.firstChild)
	}
	for(var i=1;i<8;i++){
		if(capture[1][i]!=0){
			var d=goteCapture[i].cloneNode(true);
			var t=document.getElementById("text").cloneNode(true);
			if(i<5){
				t.innerHTML="×"+capture[1][i];
				t.style.top=(i-1)*(SIZE*1.2)+CWAKU+"px";
				t.style.left=SIZE+CWAKU+"px";
				d.style.top=(i-1)*(SIZE*1.2)+CWAKU+"px";
				d.style.left=CWAKU+"px";
				s.appendChild(d);
				s.appendChild(t);
			}
			else if(i>=5){
				t.innerHTML="×"+capture[1][i];
				t.style.top=(i-5)*(SIZE*1.2)+CWAKU+"px";
				t.style.left=2*SIZE+SIZE+CWAKU+"px";
				d.style.top=(i-5)*(SIZE*1.2)+CWAKU+"px";
				d.style.left=2*SIZE+CWAKU+"px";
				s.appendChild(d);
				s.appendChild(t);			
			}
		}
		if(capture[1][i] != 0){	//Captureに駒がある
				(function(){
					var _i=i;
					d.onclick=function(){
						if(phase==0){
							if(teban==GOTE){
								selectCapture(_i,GOTE);
							}
						}
					};
				})();
			}
	}
}

function sound(){
	document.getElementById('utu').play();
}