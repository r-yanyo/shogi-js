function AIthink(){
	var bestMove=[];
	var AI;
	var date=new Date();

	var alpha=new evalMove();
	var beta=new evalMove();
	/*var evalBoard=[]
	for(var i=0;i<=10;i++){
		evalBoard[i]=[];
		for(var j=0;j<=10;j++){
			evalBoard[i][j]=board[i][j];
		}
	}*/
	alpha.eval=-INFINITE;
	beta.eval=INFINITE;

	AI=alphaBeta(board,0,alpha,beta,!teban); //深さ０　α=-∞　,β=∞　を指定 //逆の手番を渡す

	//console.log(AI);
	//AIが動かす
	//AI = bestMove[date.getTime()%bestMove.length];
	
	if(AI.prm==true) board[AI.td][AI.ts]=board[AI.fd][AI.fs]+PROMOTED;
	else if(AI.prm==false)	board[AI.td][AI.ts]=board[AI.fd][AI.fs];
	board[AI.fd][AI.fs]=EMPTY;
	if(AI.tp!=EMPTY){	//敵の駒を取ったら
		capture[teban==SENTE?0:1][(AI.tp& ~ENEMY& ~PROMOTED)]++;
		if(teban) showSenteCapture();
		else showGoteCapture();
	} 
	phase=0;
	teban=!teban;
	showMoving(AI.fd,AI.fs,AI.td,AI.ts);
	showTeban();
}

function alphaBeta(evalBoard,depth,alpha,beta,evalTeban){
	var tempPiece;
	var tempBefPiece;
	var newEval;	//evalMove型のオブジェクト
	evalTeban=!evalTeban;

	if(depth==MAX_DEPTH){
		tempOb=new evalMove(0,0,0,0,0,0,false,evaluate(evalBoard));	//オブジェクトで返すがevalのみ使用
		return	tempOb;
	} 
	depth++;

	var legalMoveBuf=makeLegalMoves();

}

function makeLegalMoves(){
	if(evalTeban==SENTE){
		for(var dan=1;dan<=DAN;dan++){
			for(var suji=1;suji<=SUJI;suji++){
					if(tebanJudge(evalBoard[dan][suji])!=SENTE) continue;
				for(var i=0;i<direction.length;i++){
					if(moveRange[i][evalBoard[dan][suji]]==1){
						var toDan=dan+direction[i][0];
						var toSuji=suji+direction[i][1];
						if((evalBoard[dan][suji]&ENEMY)==(evalBoard[toDan][toSuji]&ENEMY)&&evalBoard[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) continue; //continueで次の方向へ　//味方の駒だったら動けない
						else{	//仮想的に動かす
							if(promoteJudge(toDan,(evalBoard[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,evalBoard[dan][suji],dan)){	//成りの場合
								tempPiece=evalBoard[toDan][toSuji];
								tempBefPiece=evalBoard[dan][suji];
								evalBoard[toDan][toSuji]=evalBoard[dan][suji]+PROMOTED;
								evalBoard[dan][suji]=EMPTY;
								if(checkJudge()==false){
									newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
									if(alpha.eval<newEval.eval){
										alpha=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,true,newEval.eval);
									}
									if(alpha.eval >= beta.eval) return beta;	//枝刈り発生
								}

								//成れる駒の不成の場合
								if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
									evalBoard[toDan][toSuji]=eval[dan][suji]-PROMOTED;
									if(checkJudge()==false){
											newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
											if(alpha.eval<newEval.eval){
												alpha=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
											}
											if(alpha.eval >= beta.eval) return beta;	//枝刈り発生
									}	
								}

								//手を戻す
								evalBoard[toDan][toSuji]=tempPiece;
								evalBoard[dan][suji]=tempBefPiece;

							}
							else{	//不成
								tempPiece=evalBoard[toDan][toSuji];
								tempBefPiece=evalBoard[dan][suji];
								evalBoard[toDan][toSuji]=evalBoard[dan][suji];
								evalBoard[dan][suji]=EMPTY;
								if(checkJudge()==false){
									newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
									if(alpha.eval<newEval.eval){
										alpha=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
									}
									if(alpha >= beta) return beta;	//枝刈り発生
								}
								//手を戻す
								evalBoard[toDan][toSuji]=tempPiece;
								evalBoard[dan][suji]=tempBefPiece;
							}
						}
					}
					else if(moveRange[i][evalBoard[dan][suji]]==2){
							for(var j=1;j<9;j++){
								toDan=dan+direction[i][0]*j;
								toSuji=suji+direction[i][1]*j;
								if((evalBoard[dan][suji]&ENEMY)==(evalBoard[toDan][toSuji]&ENEMY)&&evalBoard[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) break;//breakして次の方向へ //味方の駒だったら動けない
								else{	//仮想的に動かす
									if(promoteJudge(toDan,(evalBoard[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,evalBoard[dan][suji],dan)){	//成りの場合
										tempPiece=evalBoard[toDan][toSuji];
										tempBefPiece=evalBoard[dan][suji];
										evalBoard[toDan][toSuji]=evalBoard[dan][suji]+PROMOTED;
										evalBoard[dan][suji]=EMPTY;
										if(checkJudge()==false){ //自玉が王手でないなら
											newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
											console.log(newval);
											if(alpha.eval<newEval.eval){
												alpha=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,true,newEval.eval);
											}
											if(alpha >= beta) return beta;	//枝刈り発生
										}									

										//成れる駒の不成の場合
										if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
											evalBoard[toDan][toSuji]=evalBoard[toDan][toSuji]-PROMOTED;
											if(checkJudge()==false){
												newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
												if(alpha.eval<newEval.eval){
													alpha=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
												}
												if(alpha >= beta) return beta;	//枝刈り発生
											}
										}

										//手を戻す
										evalBoard[toDan][toSuji]=tempPiece;
										evalBoard[dan][suji]=tempBefPiece;
									}
									else{	//不成の場合
										tempPiece=evalBoard[toDan][toSuji];
										tempBefPiece=evalBoard[dan][suji];
										evalBoard[toDan][toSuji]=evalBoard[dan][suji];
										evalBoard[dan][suji]=EMPTY;
										if(checkJudge()==false){
											newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
											if(alpha.eval<newEval.eval){
												alpha=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
											}
											if(alpha >= beta) return beta;	//枝刈り発生
										}

										//手を戻す
										evalBoard[toDan][toSuji]=tempPiece;
										evalBoard[dan][suji]=tempBefPiece;
									}
								}
								if((evalBoard[dan][suji]&ENEMY)!=(evalBoard[toDan][toSuji]&ENEMY)&&evalBoard[toDan][toSuji]!=EMPTY) break;　//動いた場所が敵の駒なら
							}
					}
				}
			}
		}
			return alpha;
	}
	else if(evalTeban==GOTE){
		for(var dan=1;dan<=DAN;dan++){
			for(var suji=1;suji<=SUJI;suji++) {
					if(tebanJudge(evalBoard[dan][suji])!=GOTE) continue;
				for(var i=0;i<direction.length;i++){
					if(moveRange[i][evalBoard[dan][suji]]==1){
						var toDan=dan+direction[i][0];
						var toSuji=suji+direction[i][1];
						if((evalBoard[dan][suji]&ENEMY)==(evalBoard[toDan][toSuji]&ENEMY)&&evalBoard[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) continue; //continueで次の方向へ　//味方の駒だったら動けない
						else{	//仮想的に動かす
							if(promoteJudge(toDan,(evalBoard[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,evalBoard[dan][suji],dan)){	//成りの場合
								tempPiece=evalBoard[toDan][toSuji];
								tempBefPiece=evalBoard[dan][suji];
								evalBoard[toDan][toSuji]=evalBoard[dan][suji]+PROMOTED;
								evalBoard[dan][suji]=EMPTY;
								if(checkJudge()==false){
									newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
									if(beta.eval>newEval.eval){
										beta=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,true,newEval.eval);
									}
									if(alpha.eval <= beta.eval) return alpha;	//枝刈り発生
								}

								//成れる駒の不成の場合
								if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
									evalBoard[toDan][toSuji]=eval[dan][suji]-PROMOTED;
									if(checkJudge()==false){
										newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
										if(beta.eval>newEval.eval){
											beta=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
										}
										if(alpha.eval <= beta.eval) return alpha;	//枝刈り発生
									}	
								}
								//手を戻す
								evalBoard[toDan][toSuji]=tempPiece;
								evalBoard[dan][suji]=tempBefPiece;
							}
							else{	//不成
								tempPiece=evalBoard[toDan][toSuji];
								tempBefPiece=evalBoard[dan][suji];
								evalBoard[toDan][toSuji]=evalBoard[dan][suji];
								evalBoard[dan][suji]=EMPTY;
								if(checkJudge()==false){
									newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
									if(beta.eval>newEval.eval){
										beta=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
									}
									if(alpha.eval <= beta.eval) return alpha;	//枝刈り発生
								}
								//手を戻す
								evalBoard[toDan][toSuji]=tempPiece;
								evalBoard[dan][suji]=tempBefPiece;
							}
						}
					}
					else if(moveRange[i][evalBoard[dan][suji]]==2){
							for(var j=1;j<9;j++){
								toDan=dan+direction[i][0]*j;
								toSuji=suji+direction[i][1]*j;
								if((evalBoard[dan][suji]&ENEMY)==(evalBoard[toDan][toSuji]&ENEMY)&&evalBoard[toDan][toSuji]!=EMPTY || toDan<1 || toDan>DAN || toSuji<1 || toSuji>SUJI) break;//breakして次の方向へ //味方の駒だったら動けない
								else{	//仮想的に動かす
									if(promoteJudge(toDan,(evalBoard[dan][suji]&ENEMY)==ENEMY?GOTE:SENTE,evalBoard[dan][suji],dan)){	//成りの場合
										tempPiece=evalBoard[toDan][toSuji];
										tempBefPiece=evalBoard[dan][suji];
										evalBoard[toDan][toSuji]=evalBoard[dan][suji]+PROMOTED;
										evalBoard[dan][suji]=EMPTY;
										if(checkJudge()==false){ //自玉が王手でないなら
											newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
											if(beta.eval>newEval.eval){
												beta=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,true,newEval.eval);
											}
											if(alpha.eval <= beta.eval) return alpha;	//枝刈り発生
										}								

										//成れる駒の不成の場合
										if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
												evalBoard[toDan][toSuji]=evalBoard[toDan][toSuji]-PROMOTED;
												if(checkJudge()==false){
													newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
													if(beta.eval>newEval.eval){
														beta=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
													}
													if(alpha.eval <= beta.eval) return alpha;	//枝刈り発生
											}
										}
										//手を戻す
										evalBoard[toDan][toSuji]=tempPiece;
										evalBoard[dan][suji]=tempBefPiece;
									}
									else{	//不成の場合
										tempPiece=evalBoard[toDan][toSuji];
										tempBefPiece=evalBoard[dan][suji];
										evalBoard[toDan][toSuji]=evalBoard[dan][suji];
										evalBoard[dan][suji]=EMPTY;
										console.log("OK");
										if(checkJudge()==false){
												newEval=alphaBeta(evalBoard,depth,alpha,beta,evalTeban);
												if(beta.eval>newEval.eval){
													beta=new evalMove(dan,suji,toDan,toSuji,tempBefPiece,tempPiece,false,newEval.eval);
												}
												if(alpha.eval <= beta.eval) return alpha;	//枝刈り発生
										}
										//手を戻す
										evalBoard[toDan][toSuji]=tempPiece;
										evalBoard[dan][suji]=tempBefPiece;
									}
								}
								if((evalBoard[dan][suji]&ENEMY)!=(evalBoard[toDan][toSuji]&ENEMY)&&evalBoard[toDan][toSuji]!=EMPTY) break;　//動いた場所が敵の駒なら
							}
					}
				}
			}
		}
		return beta;
	}
}

function evaluate(evalBoard)
{
	var eval=0;
	for(var dan=1;dan<=DAN;dan++){
		for(var suji=1;suji<=SUJI;suji++) {
			eval+=pieceValue[evalBoard[dan][suji]];
		}
	}
	for(var koma=1;koma<=7;koma++){
		eval+=captureValue[0][koma]*capture[0][koma];
		eval+=captureValue[1][koma]*capture[1][koma];
	}
	return eval;
}
