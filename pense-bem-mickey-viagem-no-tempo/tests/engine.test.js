import test from 'node:test';
import assert from 'node:assert/strict';
import {PROGRAMS} from '../data.js';
import {initialGame,gameReducer,POINTS,scoreSummary} from '../engine.js';

for(const program of PROGRAMS){
  test(`${program.code}: 3/2/1/0, 30 questões, 90 pontos`,()=>{
    for(let misses=0;misses<=3;misses++){
      let state=initialGame(program);
      for(const question of program.questions){
        const wrong=['A','B','C','D'].filter(letter=>letter!==question.answer);
        assert.equal(gameReducer(state,{type:'NEXT'}),state,'não permite pular pergunta');
        for(let j=0;j<misses;j++){
          state=gameReducer(state,{type:'ANSWER',choice:wrong[j]});
          const same=gameReducer(state,{type:'ANSWER',choice:wrong[j]});
          assert.equal(same,state,'não consome tentativa repetida');
        }
        if(misses<3)state=gameReducer(state,{type:'ANSWER',choice:question.answer});
        assert.equal(state.resolved,true);
        assert.equal(gameReducer(state,{type:'ANSWER',choice:question.answer}),state,'não soma novamente');
        state=gameReducer(state,{type:'NEXT'});
      }
      assert.equal(state.finished,true);
      assert.equal(state.history.length,30);
      assert.equal(state.score,misses===3?0:30*POINTS[misses+1]);
      assert.equal(scoreSummary(state).maxScore,90);
      assert.equal(gameReducer(state,{type:'NEXT'}),state,'partida encerrada');
    }
  });
}

test('reinício limpa histórico, pontuação e índice',()=>{
  const p=PROGRAMS[0];let s=initialGame(p);
  s=gameReducer(s,{type:'ANSWER',choice:p.questions[0].answer});
  s=gameReducer(s,{type:'NEXT'});
  assert.deepEqual(gameReducer(s,{type:'START',program:p}),initialGame(p));
});
