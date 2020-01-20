function getOuPosi(){
	for(var i=1;i<=DAN;i++){
			for(j=1;j<=SUJI;j++){
				if(board[i][j]==OU){
					gyokuDan=i;
					gyokuSuji=j;
					break;
			}
		}
	}

	for(var i=1;i<=DAN;i++){
			for(j=1;j<=SUJI;j++){
				if(board[i][j]==EOU){
					e_gyokuDan=i;
					e_gyokuSuji=j;
					break;
			}
		}
	}
}

function nihuJudge(suji,teban,nihuPiece){ //trueなら二歩
	if(nihuPiece!=FU && nihuPiece!=EFU) return false;
	else if(teban==SENTE){
		for(var i=0;i<DAN;i++){
			if(board[i][suji]==FU) return true;
		}
	}
	else if(teban==GOTE){
		for(var i=0;i<DAN;i++){
			if(board[i][suji]==EFU) return true;
		}
	}
	return false;
}

function cannotmoveJudge(dan,movePiece){　//trueなら動けない
	if(movePiece==FU && dan==1) return true;
	else if(movePiece==KY && dan==1) return true;
	else if(movePiece==KE && (dan==1 || dan==2)) return true;
	else if(movePiece==EFU && dan==DAN) return true;
	else if(movePiece==EKY && dan==DAN) return true;
	else if(movePiece==EKE && (dan==DAN || dan==DAN-1)) return true;
	return false;
}

function promoteJudge(dan,teban,promotePiece,befDan){
	if((promotePiece& ~ENEMY)>=KI) return false;
	else if(teban==SENTE){
		if(dan<=GOTE_FIELD||befDan<=GOTE_FIELD) return true;
		else	   return false;
	}
	else if(teban==GOTE){
		if(dan>=SENTE_FIELD||befDan>=SENTE_FIELD){
					return true;
				}
		else	   return false;
	}
}

function moveJudge(fromDan,fromSuji,toDan,toSuji,movePiece){ //trueなら動ける
	if(movePiece==EMPTY) return false;
	for(var i=0;i<direction.length;i++){
		if(moveRange[i][movePiece]){
			if((board[fromDan][fromSuji]&ENEMY)==(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY) break; //味方の駒だったら動けない
			if(toDan==fromDan+direction[i][0]&&toSuji==fromSuji+direction[i][1]) return true;
			if(moveRange[i][movePiece]==2){
				for(var j=1;j<9;j++){
					var movedDan=fromDan+direction[i][0]*j;
					var movedSuji=fromSuji+direction[i][1]*j;
					if((board[fromDan][fromSuji]&ENEMY)==(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY) break; //味方の駒だったら
					if(toDan==movedDan&&toSuji==movedSuji) return true;
					if(board[movedDan][movedSuji]!=EMPTY) break;
				}
			}
		}
	}
}

function checkJudge(turn){ //trueなら王手がかかっている 自玉に対する王手を見る
	getOuPosi();
	if(turn==SENTE){
		for(var i=1;i<=DAN;i++){
			for(var j=1;j<=SUJI;j++){
				if((board[i][j]&ENEMY)==ENEMY && moveJudge(i,j,gyokuDan,gyokuSuji,board[i][j])==true) return true; //ENEMYの駒がgyokuをとれる
			}
		}
	}
	else if(turn==GOTE){
		for(var i=1;i<=DAN;i++){
			for(var j=1;j<=SUJI;j++){
				if((board[i][j]&ENEMY)==0 && board[i][j]!=EMPTY && moveJudge(i,j,e_gyokuDan,e_gyokuSuji,board[i][j])==true) return true;　//駒がe_gyokuをとれる
			}
		}
	}

	return false;
}

function selectTeban(dan,suji){
	if(selectFlag==0){	//選択されていない
		selectedPiece=board[dan][suji];
		bfrClickDan=dan;
		bfrClickSuji=suji;
		selectFlag=BOARD;
		showboard();
		showSelected(dan,suji);
		showMoveRange(bfrClickDan,bfrClickSuji,selectedPiece);
	}
	else if(selectFlag==BOARD){				//ボード上か手駒が選択されている
		selectedPiece=EMPTY;
		bfrClickDan=null;
		bfrClickSuji=null;
		selectFlag=0;
		showboard();
	}
	else if(selectFlag==CAPTURE){				//ボード上か手駒が選択されている
		selectedPiece=EMPTY;
		bfrClickDan=null;
		bfrClickSuji=null;
		selectFlag=0;
		if(teban==SENTE) showSenteCapture();
		else if(teban==GOTE) showGoteCapture();
	}
}

function selectEnemy(fromDan,fromSuji,dan,suji){
	if(selectFlag==0){	//選択されていない
		//何もしない
	}
	else if(selectFlag==BOARD&&moveJudge(fromDan,fromSuji,dan,suji,selectedPiece)){			//ボード上で選択されている
		var tempPiece=board[dan][suji];
		var tempBefPiece=board[fromDan][fromSuji];
		if(promoteJudge(dan,teban,selectedPiece,fromDan)){
			pFlag=true;
			board[dan][suji]=selectedPiece+PROMOTED;
			board[fromDan][fromSuji]=EMPTY;
		}
		else{
			board[dan][suji]=selectedPiece;
			board[fromDan][fromSuji]=EMPTY;
		}

		if(checkJudge(teban)==true){
			board[dan][suji]=tempPiece; //王手が残るなら動かさない
			board[fromDan][fromSuji]=tempBefPiece;
		}
		else{
			sound();
			capture[teban==SENTE?0:1][(tempPiece& ~ENEMY& ~PROMOTED)]++;
			board[fromDan][fromSuji]=EMPTY;
			showMoving(fromDan,fromSuji,dan,suji);
			bfrClickDan=bfrClickSuji=null;
			selectFlag=0;
			if(teban) showSenteCapture();
			else showGoteCapture();
			teban=!teban;
			showTeban();

			if(pFlag==true&& !cannotmoveJudge(dan,selectedPiece)){
				selectedPiece=EMPTY;
				phase=1;
				promoteDan=dan;
				promoteSuji=suji;
				showPromote();
			}
			else if(cpuflag==0)pFlag=false;
			else if(cpuflag==1){
				pFlag=false;
				phase=2;
				setTimeout("AIthink()",1000);
			}
		}
	}
	else if(selectFlag==BOARD&&!moveJudge(fromDan,fromSuji,dan,suji,selectedPiece)){	//動けないところをクリック
		selectedPiece=EMPTY;
		bfrClickDan=null;
		bfrClickSuji=null;
		selectFlag=0;
		showboard();
	}
	　else if(selectFlag==CAPTURE){	//手駒が選択されている
		selectedPiece=EMPTY;
		bfrClickDan=null;
		bfrClickSuji=null;
		selectFlag=0;
		if(teban==SENTE) showSenteCapture();
		else if(teban==GOTE) showGoteCapture();
	}
}

function selectCapture(_i,capTeban){
	if(capTeban==SENTE){
		if(selectFlag==CAPTURE){
			selectFlag=0;
			selectedPiece=EMPTY;
			showSenteCapture();
		}
		else if(selectFlag==BOARD){
			selectFlag=0;
			selectedPiece=EMPTY;
			showboard();
		}
		else{
			selectFlag=CAPTURE;
			selectedPiece=_i;
			showSenteCapture();
			showCaptureSelected(_i,SENTE);
		}
	}
	else if(capTeban==GOTE){
		if(selectFlag==CAPTURE){
			selectFlag=0;
			selectedPiece=EMPTY;
			showGoteCapture();
		}
		else if(selectFlag==BOARD){
			selectFlag=0;
			selectedPiece=EMPTY;
			showboard();
		}
		else{
			selectFlag=CAPTURE;
			selectedPiece=_i+ENEMY;
			showGoteCapture();
			showCaptureSelected(_i,GOTE);
		}
	}
}

function selectEmpty(fromDan,fromSuji,dan,suji){
	if(selectFlag==0){	//選択されていない
			//何もしない
		}
	else if(selectFlag==BOARD&&moveJudge(fromDan,fromSuji,dan,suji,selectedPiece)){		//ボード上で選択されている
		var tempPiece=board[dan][suji];
		var tempBefPiece=board[fromDan][fromSuji];
		if(promoteJudge(dan,teban,selectedPiece,fromDan)){	//成
			pFlag=true;
			board[dan][suji]=selectedPiece+PROMOTED;
			board[fromDan][fromSuji]=EMPTY;
		}
		else{
			board[dan][suji]=selectedPiece;			//不成
			board[fromDan][fromSuji]=EMPTY;
		}

		if(checkJudge(teban)==true){
			board[dan][suji]=tempPiece; //王手が残るなら動かさない
			board[fromDan][fromSuji]=tempBefPiece;
		}
		else{
			sound();
			board[fromDan][fromSuji]=EMPTY;
			showMoving(fromDan,fromSuji,dan,suji); //showboard含む
			bfrClickDan=bfrClickSuji=null;
			selectFlag=0;
			teban=!teban;
			showTeban();
			if(pFlag==true && !cannotmoveJudge(dan,selectedPiece)){	//成り選択画面へ
				selectedPiece=EMPTY;
				phase=1;
				promoteDan=dan;
				promoteSuji=suji;
				showPromote();
			}
			else if(cpuflag==0) pFlag=false;
			else if(cpuflag==1){
				pFlag=false;
				phase=2;
				setTimeout("AIthink()",1000);
			}
		}
	}
	else if(selectFlag==BOARD&&!moveJudge(fromDan,fromSuji,dan,suji,selectedPiece)){ //動けないところをクリック
		selectedPiece=EMPTY;
		bfrClickDan=null;
		bfrClickSuji=null;
		selectFlag=0;
		showboard();
	}
	else　if(selectFlag==CAPTURE){	//持ち駒が選択されている
		var tempPiece=board[dan][suji];
		if(nihuJudge(suji,teban,selectedPiece)==true || cannotmoveJudge(dan,selectedPiece)==true) board[dan][suji]=tempPiece;
		else{
				board[dan][suji]=selectedPiece;

			if(checkJudge(teban)==true) board[dan][suji]=tempPiece; //王手が残るなら動かさない
			else{
				sound();
				capture[teban==SENTE?0:1][selectedPiece& ~ENEMY]--;
				selectFlag=0;
				if(teban==true)showSenteCapture();
				else showGoteCapture();
				teban=!teban;
				showTeban();
				showboard();
				if(cpuflag==1){
					phase=2;
					setTimeout("AIthink()",1000);
				}
			}
		}
	}

}

function tebanJudge(koma){ //true:SENTE false:GOTE
	if(FU<=koma&&koma<=UM) return true;
	else if(ENEMY+FU<=koma&&koma<=ENEMY+UM) return false;
}