function AIthink(){
	var AI;
	var date=new Date();

	retMove=new evalMove(0,0,0,0,INFINITE);
	AI=minMax(3,!teban,0,0,0,0);
	console.log(AI);

	if(AI.tp!=EMPTY){
		capture[teban==SENTE?0:1][(AI.tp& ~ENEMY& ~PROMOTED)]++;
		if(teban) showSenteCapture();
		else showGoteCapture();
	}
	board[AI.fd][AI.fs]=EMPTY;
	phase=0;
	teban=!teban;
	showMoving(AI.fd,AI.fs,AI.td,AI.ts);
	showTeban();
}

function minMax(depth,eTeban,fd,fs,td,ts){
	var tempPiece;
	var tempBefPiece;

	if(depth==0){
		temp= new evalMove(fd,fs,td,ts,evaluate());
		return temp;
	}
	eTeban=!eTeban;
	for(var dan=1;dan<=DAN;dan++){
		for(var suji=1;suji<=SUJI;suji++) {
				if(eTeban!=tebanJudge(board[dan][suji])) continue;
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
							if(checkJudge()==false){
								if(eTeban==SENTE){
									newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
									if(newMove.eval>retMove.eval) retMove=newMove;
								}
								else if(eTeban==GOTE){
									newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
									if(newMove.eval<retMove.eval) retMove=newMove;
								}
							}

							//不成の場合
							if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
								board[toDan][toSuji]=board[dan][suji]-PROMOTED;
								if(checkJudge()==false){
									if(eTeban==SENTE){
										newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
										if(newMove.eval>retMove.eval) retMove=newMove;
									}
									else if(eTeban==GOTE){
										newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
										if(newMove.eval<retMove.eval) retMove=newMove;
									}
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
							if(checkJudge()==false){
								if(eTeban==SENTE){
									newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
									if(newMove.eval>retMove.eval) retMove=newMove;
								}
								else if(eTeban==GOTE){
									newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
									if(newMove.eval<retMove.eval){
										retMove=newMove;
									}
								}
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
									if(checkJudge()==false){ //自玉が王手でないなら
										if(eTeban==SENTE){
											newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
											if(newMove.eval>retMove.eval) retMove=newMove;
										}
										else if(eTeban==GOTE){
											newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
											if(newMove.eval<retMove.eval) retMove=newMove;
										}
									}									

									//不成の場合
									if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
										board[toDan][toSuji]=board[toDan][toSuji]-PROMOTED;
										if(checkJudge()==false){
											if(eTeban==SENTE){
												newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
												if(newMove.eval>retMove.eval) retMove=newMove;
											}
											else if(eTeban==GOTE){
												newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
												if(newMove.eval<retMove.eval) retMove=newMove;
											}
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
									if(checkJudge()==false){
										if(eTeban==SENTE){
											newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
											if(newMove.eval>retMove.eval) retMove=newMove;
										}
										else if(eTeban==GOTE){
											newMove=minMax(depth-1,eTeban,dan,suji,toDan,toSuji);
											if(newMove.eval<retMove.eval) retMove=newMove;
										}
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
	return retMove;
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
