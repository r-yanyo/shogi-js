function AIthink(){
	var bestMoveSente=[],bestMoveGote=[]; //.eval 先手は高いほうがいい　後手は低いほうがいい
	var AI;
	var date=new Date();
	var bestMove=new Move(0,0,0,0,0,0,0);
	alphaBeta(teban,3,-INFINITE,INFINITE,bestMove);

	AI=bestMove;
	console.log(AI);
	if(AI.etc==1){
		board[AI.td][AI.ts]=AI.fp+PROMOTED;
		board[AI.fd][AI.fs]=EMPTY;
	}
	else if(AI.etc==0){
		board[AI.td][AI.ts]=AI.fp;
		board[AI.fd][AI.fs]=EMPTY;
	}
	else if(AI.etc==2){
		capture[teban==SENTE?0:1][AI.fp& ~ENEMY]--;
		board[AI.td][AI.ts]=AI.fp;
	}

	if(AI.tp!=EMPTY) capture[teban==SENTE?0:1][(AI.tp& ~ENEMY& ~PROMOTED)]++; //駒を取ったら

	if(teban) showSenteCapture();
	else showGoteCapture();

	phase=0;
	teban=!teban;
	if(AI.etc!=2)showMoving(AI.fd,AI.fs,AI.td,AI.ts);
	else	showboard();
	showTeban();
}

function alphaBeta(turn,depth,alpha,beta,bestMove){
	if(depth==0) return evaluate();

	var moves=makeMove(turn);
	bestMove.fd=0;
	bestMove.fs=0;
	bestMove.td=0;
	bestMove.ts=0;
	bestMove.fp=0;
	bestMove.tp=0;
	bestMove.etc=0;

	var retval=-INFINITE;

	var childMove=new Move(0,0,0,0,0,0,0);
	for(var i=moves.length-1;i>=0;i--){ //発表用に逆順にした
		moves[i].doMove(turn);
		var newval=-alphaBeta(!turn,depth-1,-beta,-Math.max(retval,alpha),childMove);
		moves[i].undoMove(turn);
		if(newval>retval){
			retval=newval;
			bestMove.fd=moves[i].fd;
			bestMove.fs=moves[i].fs;
			bestMove.td=moves[i].td;
			bestMove.ts=moves[i].ts;
			bestMove.fp=moves[i].fp;
			bestMove.tp=moves[i].tp;
			bestMove.etc=moves[i].etc;
		}
		if(retval>=beta) return retval;
	}
	return retval;

}

function see(turn,alpha,beta,trDan,trSuji,first){	//未完成
	var retval=evaluate();
	if(retval>beta) return retval;
	if(first==true) var moves=makeMove(turn);
	else			var moves=makeMoveTarget(turn,trDan,trSuji);

	for(var i=0;i<moves.length; i++){
		if(moves[i].tp==EMPTY) continue;
		if(first==true){
			trDan=moves[i].td;	//targetDan
			trSuji=moves[i].ts;	//targetSuji
		}
		if(trDan==3&&trSuji==8&&first==false)console.log(moves);
		moves[i].doMove(turn);
		var newval=-see(!turn,-beta,-Math.max(retval,alpha),trDan,trSuji,false);
		moves[i].undoMove(turn);
		if(newval>retval) retval=newval;
		if(retval>=beta) return retval;
	}
	return retval;
}

function Qsearch(turn,alpha,beta){
	var retval=evaluate();
	if(retval>beta) return retval;
	var moves=makeMove(turn);
	//それぞれの指し手を評価
	var value=[];
	for(i=0;i<moves.length;i++) value[i]=(moves[i].tp& ~ENEMY& ~PROMOTED)-(moves[i].fp& ~ENEMY& ~PROMOTED);
	//評価順にソート
	for(i=0;i<moves.length-1;i++){
		var max=value[i];
		var maxid=i;
		for(j=i+1;j<moves.length;j++){
			if(value[j]>max){
				max=value[j];
				maxid=j;
			}
		}
		var temp=value[i];
		value[i]=value[maxid];
		value[maxid]=temp;

		temp=moves[i];
		moves[i]=moves[maxid];
		moves[maxid]=temp;
	}

	for(var i=0;i<moves.length; i++){
		if(moves[0]==undefined) return -INFINITE;
		if(moves[i].tp==EMPTY) continue;
		if(board[3][8]==RY) console.log(moves[i]);
		moves[i].doMove(turn);
		var newval=-Qsearch(!turn,-beta,-Math.max(retval,alpha));
		moves[i].undoMove(turn);
		if(newval>retval) retval=newval;
		if(retval>=beta) return retval;
	}
	return retval;
}

function makeMove(turn){
	var tempPiece;
	var tempBefPiece;
	var moveBuf=[];
	var num=0;
	//将棋盤の駒を動かす
	for(var dan=1;dan<=DAN;dan++){
		for(var suji=1;suji<=SUJI;suji++) {
			if(turn!=tebanJudge(board[dan][suji])) continue;
			for(var i=0;i<direction.length;i++){
				if(moveRange[i][board[dan][suji]]==1){
					var toDan=dan+direction[i][0];
					var toSuji=suji+direction[i][1];
					if((board[dan][suji]&ENEMY)==(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) continue; //continueで次の方向へ　//味方の駒だったら動けない
					else{	//仮想的に動かす
						if(promoteJudge(toDan,(board[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,board[dan][suji],dan)){
							//成りの場合
							tempPiece=board[toDan][toSuji];	//進むところにある駒
							tempBefPiece=board[dan][suji];	//動く駒
							board[toDan][toSuji]=board[dan][suji]+PROMOTED;
							board[dan][suji]=EMPTY;
							if(checkJudge(turn)==false){
								moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,1);
								num++;
							}

							//不成の場合
							if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
								board[toDan][toSuji]=board[dan][suji]-PROMOTED;
								if(checkJudge(turn)==false){
									moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
									num++;
								}
							}

							//駒を戻す
							board[dan][suji]=tempBefPiece;
							board[toDan][toSuji]=tempPiece;
						}
						else{
							tempPiece=board[toDan][toSuji];	//進むところにある駒
							tempBefPiece=board[dan][suji];	//動く駒
							board[toDan][toSuji]=board[dan][suji];
							board[dan][suji]=EMPTY;
							if(checkJudge(turn)==false){
								moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
								num++;
							}

							//駒を戻す
							board[dan][suji]=tempBefPiece;
							board[toDan][toSuji]=tempPiece;
							}
					}
				}
				else if(moveRange[i][board[dan][suji]]==2){
						for(var j=1;j<9;j++){
							toDan=dan+direction[i][0]*j;
							toSuji=suji+direction[i][1]*j;
							if((board[dan][suji]&ENEMY)==(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) break;//breakして次の方向へ //味方の駒だったら動けない
							else{	//仮想的に動かす
								if(promoteJudge(toDan,(board[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,board[dan][suji],dan)){
									//成りの場合
									tempPiece=board[toDan][toSuji];	//進むところにある駒
									tempBefPiece=board[dan][suji];	//動く駒
									board[toDan][toSuji]=board[dan][suji]+PROMOTED;
									board[dan][suji]=EMPTY;
									if(checkJudge(turn)==false){ //自玉が王手でないなら
										moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,1);
										num++;
									}								

									//不成の場合
									if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
										board[toDan][toSuji]=board[toDan][toSuji]-PROMOTED;
										if(checkJudge(turn)==false){
											moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
											num++;
										}
									}

									//駒を戻す
									board[dan][suji]=tempBefPiece;
									board[toDan][toSuji]=tempPiece;
								}
								else{
									tempPiece=board[toDan][toSuji];	//進むところにある駒
									tempBefPiece=board[dan][suji];	//動く駒
									board[toDan][toSuji]=board[dan][suji];
									board[dan][suji]=EMPTY;
									if(checkJudge(turn)==false){
										moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
										num++;
									}
									
									//駒を戻す
									board[dan][suji]=tempBefPiece;
									board[toDan][toSuji]=tempPiece;
								}
							}
							if((board[dan][suji]&ENEMY)!=(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY) break;　//動いた場所が敵の駒なら
						}
					}
			}
		}
	}

	//手駒を使う
		if(turn==SENTE) var flag=0;
		else			var flag=1;
		for(var k=FU;k<=KI;k++){
			if(capture[flag][k]!=0){
				 capPiece=turn?k:(k+ENEMY);
				for(var dan=0;dan<=DAN;dan++){
					for(var suji=0;suji<=SUJI;suji++){
						if(board[dan][suji]==EMPTY&&nihuJudge(suji,turn,capPiece)==false && cannotmoveJudge(dan,capPiece)==false){
							board[dan][suji]=capPiece;
							capture[flag][k]--;

							if(checkJudge(turn)==false){
								moveBuf[num]=new Move(0,0,dan,suji,capPiece,EMPTY,2);
								num++;
							}
							//駒を戻す
							capture[flag][k]++;
							board[dan][suji]=EMPTY;

						}
					}
				}
			}
		}
		return moveBuf;
}

function makeMoveTarget(turn,trDan,trSuji){
	var tempPiece;
	var tempBefPiece;
	var moveBuf=[];
	var num=0;
	//将棋盤の駒を動かす
	for(var dan=1;dan<=DAN;dan++){
		for(var suji=1;suji<=SUJI;suji++) {
			if(turn!=tebanJudge(board[dan][suji])) continue;
			for(var i=0;i<direction.length;i++){
				if(moveRange[i][board[dan][suji]]==1){
					var toDan=dan+direction[i][0];
					var toSuji=suji+direction[i][1];
					if(toDan!=trDan||toSuji!=trSuji) continue;
					if((board[dan][suji]&ENEMY)==(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) continue; //continueで次の方向へ　//味方の駒だったら動けない
					else{	//仮想的に動かす
						if(promoteJudge(toDan,(board[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,board[dan][suji],dan)){
							//成りの場合
							tempPiece=board[toDan][toSuji];	//進むところにある駒
							tempBefPiece=board[dan][suji];	//動く駒
							board[toDan][toSuji]=board[dan][suji]+PROMOTED;
							board[dan][suji]=EMPTY;
							if(checkJudge(turn)==false){
								moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,1);
								num++;
							}

							//不成の場合
							if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
								board[toDan][toSuji]=board[dan][suji]-PROMOTED;
								if(checkJudge(turn)==false){
									moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
									num++;
								}
							}

							//駒を戻す
							board[dan][suji]=tempBefPiece;
							board[toDan][toSuji]=tempPiece;
						}
						else{
							tempPiece=board[toDan][toSuji];	//進むところにある駒
							tempBefPiece=board[dan][suji];	//動く駒
							board[toDan][toSuji]=board[dan][suji];
							board[dan][suji]=EMPTY;
							if(checkJudge(turn)==false){
								moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
								num++;
							}

							//駒を戻す
							board[dan][suji]=tempBefPiece;
							board[toDan][toSuji]=tempPiece;
							}
					}
				}
				else if(moveRange[i][board[dan][suji]]==2){
						for(var j=1;j<9;j++){
							toDan=dan+direction[i][0]*j;
							toSuji=suji+direction[i][1]*j;
							if(toDan!=trDan||toSuji!=trSuji) continue;
							if((board[dan][suji]&ENEMY)==(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) break;//breakして次の方向へ //味方の駒だったら動けない
							else{	//仮想的に動かす
								if(promoteJudge(toDan,(board[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,board[dan][suji],dan)){
									//成りの場合
									tempPiece=board[toDan][toSuji];	//進むところにある駒
									tempBefPiece=board[dan][suji];	//動く駒
									board[toDan][toSuji]=board[dan][suji]+PROMOTED;
									board[dan][suji]=EMPTY;
									if(checkJudge(turn)==false){ //自玉が王手でないなら
										moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,1);
										num++;
									}								

									//不成の場合
									if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
										board[toDan][toSuji]=board[toDan][toSuji]-PROMOTED;
										if(checkJudge(turn)==false){
											moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
											num++;
										}
									}

									//駒を戻す
									board[dan][suji]=tempBefPiece;
									board[toDan][toSuji]=tempPiece;
								}
								else{
									tempPiece=board[toDan][toSuji];	//進むところにある駒
									tempBefPiece=board[dan][suji];	//動く駒
									board[toDan][toSuji]=board[dan][suji];
									board[dan][suji]=EMPTY;
									if(checkJudge(turn)==false){
										moveBuf[num]=new Move(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,0);
										num++;
									}
									
									//駒を戻す
									board[dan][suji]=tempBefPiece;
									board[toDan][toSuji]=tempPiece;
								}
							}
							if((board[dan][suji]&ENEMY)!=(board[toDan][toSuji]&ENEMY)&&board[toDan][toSuji]!=EMPTY) break;　//動いた場所が敵の駒なら
						}
					}
			}
		}
	}
		return moveBuf;
}

function evaluate()
{
	var eval=0;
	for(var dan=1;dan<=DAN;dan++){
		for(var suji=1;suji<=SUJI;suji++) {
			eval+=pieceValue[board[dan][suji]];
		}
	}
	for(var koma=1;koma<=7;koma++){
		eval+=captureValue[0][koma]*capture[0][koma];
		eval+=captureValue[1][koma]*capture[1][koma];
	}
	return eval;
}