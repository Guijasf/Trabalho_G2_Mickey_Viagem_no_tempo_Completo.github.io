import assert from 'node:assert/strict';
import { PROGRAMS } from '../data.js';
import { initialGame, gameReducer } from '../engine.js';
let checks=0;
const check=(fn)=>{fn();checks++;};
for(const p of PROGRAMS){
 check(()=>assert.equal(p.questions.length,30));
 const reading = {...p, questions:p.questions.map(q=>({...q,answer:null}))};
 let browse=initialGame(reading);
 check(()=>assert.equal(gameReducer(browse,{type:'ANSWER',choice:'A'}),browse));
 check(()=>assert.equal(gameReducer(browse,{type:'PREVIOUS'}),browse));
 for(let i=0;i<30;i++){
    browse=gameReducer(browse,{type:'NEXT'});
    check(()=>assert.equal(browse.score,0));
 }
 check(()=>assert.equal(browse.finished,true));
 const scored={...p,questions:p.questions.map((q,i)=>({...q,answer:['A','B','C','D'][i%4]}))};
 for(let miss=0;miss<=3;miss++){
    let s=initialGame(scored);
  for(let i=0;i<30;i++){
    const q=scored.questions[i];const wrong=['A','B','C','D'].filter(x=>x!==q.answer);
   check(()=>assert.equal(gameReducer(s,{type:'NEXT'}),s));
   for(let j=0;j<miss;j++){
    s=gameReducer(s,{type:'ANSWER',choice:wrong[j]});
    check(()=>assert.equal(gameReducer(s,{type:'ANSWER',choice:wrong[j]}),s));
   }
   if(miss<3)s=gameReducer(s,{type:'ANSWER',choice:q.answer});
   check(()=>assert.equal(gameReducer(s,{type:'ANSWER',choice:q.answer}),s));
   check(()=>assert.equal(s.history.length,i+1));
   s=gameReducer(s,{type:'NEXT'});
  }
  check(()=>assert.equal(s.score,miss===3?0:30*(3-miss)));
  check(()=>assert.equal(s.finished,true));
  check(()=>assert.equal(s.history.length,30));
  check(()=>assert.equal(gameReducer(s,{type:'NEXT'}),s));
  check(()=>assert.equal(gameReducer(s,{type:'ANSWER',choice:'A'}),s));
    check(()=>assert.deepEqual(gameReducer(s,{type:'START',program:scored}),initialGame(scored)));
 }
}
check(()=>assert.equal(new Set(PROGRAMS.flatMap(p=>p.questions.map(q=>q.id))).size,150));
check(()=>assert.deepEqual(PROGRAMS.map(p=>p.code),['151','152','153','154','155']));
check(()=>assert.ok(PROGRAMS.every(p=>p.questions.every(q=>q.answer===null || ['A','B','C','D'].includes(q.answer)))));
let s=initialGame({...PROGRAMS[0],questions:PROGRAMS[0].questions.map(q=>({...q,answer:'B'}))});
check(()=>assert.equal(gameReducer(s,{type:'ANSWER',choice:'X'}),s));
console.log(`${checks} verificações aprovadas: 5 programas, navegação sem gabarito, 90/60/30/0 pontos, repetição, avanço, reinício e encerramento.`);
