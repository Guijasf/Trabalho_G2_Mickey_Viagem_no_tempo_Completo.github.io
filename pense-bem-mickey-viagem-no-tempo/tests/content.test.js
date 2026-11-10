import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { PROGRAMS } from '../data.js';
import { CONTENT } from '../content.js';
import { initialGame, gameReducer } from '../engine.js';
const questions = PROGRAMS.flatMap(p => p.questions);
assert.equal(Object.keys(CONTENT).length,150);
assert.deepEqual(questions.map(q=>q.id),Array.from({length:150},(_,i)=>i+1));
for (const q of questions) {
  assert.ok(q.prompt?.length > 10,`enunciado ${q.id}`);
  assert.equal(q.options.length,4,`alternativas ${q.id}`);
  assert.equal(new Set(q.options).size,4,`alternativas distintas ${q.id}`);
  assert.ok(existsSync(new URL(`../assets/page-${String(q.page).padStart(2,'0')}.jpg`,import.meta.url)));
  assert.equal(q.answerStatus,q.answer == null ? 'pending' : 'interpreted');
}
for (const p of PROGRAMS) {
  let game=initialGame(p);
  for (const q of p.questions) {
    assert.equal(game.program.questions[game.index].id,q.id);
    if (q.answer) game=gameReducer(game,{type:'ANSWER',choice:q.answer});
    else assert.equal(gameReducer(game,{type:'ANSWER',choice:'A'}),game);
    game=gameReducer(game,{type:'NEXT'});
  }
  assert.ok(game.finished);
  assert.equal(game.score,p.questions.filter(q=>q.answer).length*3);
  assert.equal(new Set(game.history.map(h=>h.id)).size,game.history.length);
}
// Regression: scored -> pending -> previous must not reopen and score again.
const mixed={questions:[{id:1,answer:'A'},{id:2,answer:null},{id:3,answer:null}]};
let g=initialGame(mixed); g=gameReducer(g,{type:'ANSWER',choice:'A'}); g=gameReducer(g,{type:'NEXT'});
assert.equal(gameReducer(g,{type:'PREVIOUS'}),g);
g=gameReducer(g,{type:'NEXT'}); g=gameReducer(g,{type:'PREVIOUS'}); assert.equal(g.index,1); assert.equal(g.score,3);
console.log(`Conteúdo validado: ${questions.length} perguntas; ${questions.filter(q=>q.answer).length} respostas interpretadas; ${questions.filter(q=>!q.answer).length} pendentes. Fluxos mistos aprovados.`);
