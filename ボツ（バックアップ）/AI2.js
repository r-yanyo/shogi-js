function AIthink(){
	var depth=DEPTH;	//value+1手先を読む
	var evalMoveBuf=[];
	var bestMoveSente=[],bestMoveGote=[]; //.eval 先手は高いほうがいい　後手は低いほうがいい
	var AI;
	var date=new Date();

	retval=INFINITE; //AIは後手なので
	retval_e=-INFINITE;
	newval=0;
	newval_e=0;
	legalMoves(depth,evalMoveBuf,!teban);
	bestMoveGote[0]=evalMoveBuf[0];

	for(var i=1;i<evalMoveBuf.length;i++){
			if(evalMoveBuf[i].eval<bestMoveGote[0].eval){
				bestMoveGote=[];
				bestMoveGote[0]=evalMoveBuf[i];
			}
			else if(evalMoveBuf[i].eval==bestMoveGote[0].eval) bestMoveGote.push(evalMoveBuf[i]);
	}
	console.log(bestMoveGote);
	AI = bestMoveGote[date.getTime()%bestMoveGote.length];
	if(AI.prm==true) board[AI.td][AI.ts]=board[AI.fd][AI.fs]+PROMOTED;
	else if(AI.prm==false)	board[AI.td][AI.ts]=board[AI.fd][AI.fs];
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

function legalMoves(depth,evalMoveBuf,evalTeban){
	var temp;
	var tempPiece;
	var tempBefPiece;
	evalTeban=!evalTeban;
	for(var dan=1;dan<=DAN;dan++){
		for(var suji=1;suji<=SUJI;suji++) {
				if(evalTeban!=tebanJudge(board[dan][suji])||board[dan][suji]==EMPTY) continue;
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
								if(depth==0){
									newval=evaluate();
								}
								else if(depth%2!=0){	//プレイヤーの動くとき
									newval_e=evaluate();
									if(newval_e>=retval_e){
										retval_e=newval_e;
										legalMoves(depth-1,evalMoveBuf,evalTeban);
									}
								}
								else if(depth==DEPTH){
										legalMoves(depth-1,evalMoveBuf,evalTeban);
										if(newval<=retval){
											retval=newval;
											temp=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,true,evaluate());
											evalMoveBuf.push(temp);
										} 
								}
							}

							//不成の場合
							if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
								board[toDan][toSuji]=board[dan][suji]-PROMOTED;
								if(checkJudge()==false){
									if(depth==0){
										newval=evaluate();
									}
									else if(depth%2!=0){	//プレイヤーの動くとき
										newval_e=evaluate();
										if(newval_e>=retval_e){
											retval_e=newval_e;
											legalMoves(depth-1,evalMoveBuf,evalTeban);
										}
									}
									else if(depth==DEPTH){
											legalMoves(depth-1,evalMoveBuf,evalTeban);
											if(newval<=retval){
												retval=newval;
												temp=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,evaluate());
												evalMoveBuf.push(temp);
											} 
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
								if(depth==0){
									newval=evaluate();
								}
								else if(depth%2!=0){	//プレイヤーの動くとき
									newval_e=evaluate();
									if(newval_e>=retval_e){
										retval_e=newval_e;
										legalMoves(depth-1,evalMoveBuf,evalTeban);
									}
								}
								else if(depth==DEPTH){
										legalMoves(depth-1,evalMoveBuf,evalTeban);
										if(newval<=retval){
											retval=newval;
											temp=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,evaluate());
											evalMoveBuf.push(temp);
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
										if(depth==0){
											newval=evaluate();
										}
										else if(depth%2!=0){	//プレイヤーの動くとき
											newval_e=evaluate();
											if(newval_e>=retval_e){
												retval_e=newval_e;
												legalMoves(depth-1,evalMoveBuf,evalTeban);
											}
										}
										else if(depth==DEPTH){
												legalMoves(depth-1,evalMoveBuf,evalTeban);
												if(newval<=retval){
													retval=newval;
													temp=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,true,evaluate());
													evalMoveBuf.push(temp);
												} 
										}
									}									

									//不成の場合
									if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
										board[toDan][toSuji]=board[toDan][toSuji]-PROMOTED;
										if(checkJudge()==false){
											if(depth==0){
												newval=evaluate();
											}
											else if(depth%2!=0){	//プレイヤーの動くとき
												newval_e=evaluate();
												if(newval_e>=retval_e){
													retval_e=newval_e;
													legalMoves(depth-1,evalMoveBuf,evalTeban);
												}
											}
											else if(depth==DEPTH){
													legalMoves(depth-1,evalMoveBuf,evalTeban);
													if(newval<=retval){
														retval=newval;
														temp=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,evaluate());
														evalMoveBuf.push(temp);
													} 
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
										if(depth==0){
											newval=evaluate();
										}
										else if(depth%2!=0){	//プレイヤーの動くとき
											newval_e=evaluate();
											if(newval_e>=retval_e){
												retval_e=newval_e;
												legalMoves(depth-1,evalMoveBuf,evalTeban);
											}
										}
										else if(depth==DEPTH){
												legalMoves(depth-1,evalMoveBuf,evalTeban);
												if(newval<=retval){
													retval=newval;
													temp=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,evaluate());
													evalMoveBuf.push(temp);
												} 
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
