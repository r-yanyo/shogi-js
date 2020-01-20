function AIthink(){
	var bestMoveSente=[],bestMoveGote=[]; //.eval 先手は高いほうがいい　後手は低いほうがいい
	var AI;
	var date=new Date();

	AI=negamax(teban,3); //奇数じゃないと、取れる駒をとらない（直せ）

	console.log(AI);
	if(AI.etc==1) board[AI.td][AI.ts]=AI.fp+PROMOTED;
	else if(AI.etc==0)	board[AI.td][AI.ts]=AI.fp;
	else if(AI.etc==2)  capture[teban==SENTE?0:1][AI.fp]--;
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

function negamax(turn,depth){

	if(depth==0){
		var temp=new evalMove(0,0,0,0,0,0,false,evaluate());
		return temp;
	}

	var tempPiece;
	var tempBefPiece;
	var value=new evalMove(0,0,0,0,0,0,false,-INFINITE);
	var max=new evalMove(0,0,0,0,0,0,false,-INFINITE);

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
							if(checkJudge()==false){
								value=negamax(!turn,depth-1);
								value.eval=-value.eval;
								if(value.eval>max.eval){
									value.fd=dan;
									value.fs=suji;
									value.td=toDan;
									value.ts=toSuji;
									value.fp=tempBefPiece;
									value.tp=tempPiece;
									value.etc=1;
									max=value;
								}
							}

							//不成の場合
							if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
								board[toDan][toSuji]=board[dan][suji]-PROMOTED;
								if(checkJudge()==false){
									value=negamax(!turn,depth-1);
									value.eval=-value.eval;
									if(value.eval>max.eval){
									value.fd=dan;
									value.fs=suji;
									value.td=toDan;
									value.ts=toSuji;
									value.fp=tempBefPiece;
									value.tp=tempPiece;
									value.etc=0;
									max=value;
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
								value=negamax(!turn,depth-1);
								value.eval=-value.eval;
								if(value.eval>=max.eval){
									value.fd=dan;
									value.fs=suji;
									value.td=toDan;
									value.ts=toSuji;
									value.fp=tempBefPiece;
									value.tp=tempPiece;
									value.etc=0;
									max=value;
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
										value=negamax(!turn,depth-1);
										value.eval=-value.eval;
										if(value.eval>max.eval){
											value.fd=dan;
											value.fs=suji;
											value.td=toDan;
											value.ts=toSuji;
											value.fp=tempBefPiece;
											value.tp=tempPiece;
											value.etc=1;
											max=value;
										}	
									}								

									//不成の場合
									if(cannotmoveJudge(toDan,tempBefPiece)==false){ //歩や桂馬が動けない場合を考慮
										board[toDan][toSuji]=board[toDan][toSuji]-PROMOTED;
										if(checkJudge()==false){
											value=negamax(!turn,depth-1);
											value.eval=-value.eval;
											if(value.eval>max.eval){
												value.fd=dan;
												value.fs=suji;
												value.td=toDan;
												value.ts=toSuji;
												value.fp=tempBefPiece;
												value.tp=tempPiece;
												value.etc=0;
												max=value;
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
										value=negamax(!turn,depth-1);
										value.eval=-value.eval;
										if(value.eval>max.eval){
											value.fd=dan;
											value.fs=suji;
											value.td=toDan;
											value.ts=toSuji;
											value.fp=tempBefPiece;
											value.tp=tempPiece;
											value.etc=0;
											max=value;
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

	/*//手駒を使う
		for(var k=0;k<=7;k++){
			if(capture[turn==true?0:1][k]!=0){
				for(var i=0;i<=DAN;i++){
					for(var j=0;j<=SUJI;j++){
						if(board[dan][suji]==EMPTY&&nihuJudge(suji,teban,selectedPiece)==false || cannotmoveJudge(dan,selectedPiece)==false){
							var tempPiece=board[dan][suji];
							if(turn==SENTE) board[dan][suji]=k;
							else if(turn==GOTE) board[dan][suji]=k+ENEMY;

							capture[turn==SENTE?0:1][k]--;

							if(checkJudge()==false){
								value=negamax(!turn,depth-1);
								value.eval=-value.eval;
								if(value.eval>max.eval){
									value.fd=0;
									value.fs=0;
									value.td=dan;
									value.ts=suji;
									value.fp=board[dan][suji]; //そのとき打った駒
									value.tp=EMPTY;
									value.etc=2;
									max=value;
								}
							}

							//駒を戻す
							capture[turn==SENTE?0:1][k]++;
							board[dan][suji]=tempPiece;

						}
					}
				}
			}
		}*/


	return max;
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
