import test from 'node:test';
import assert from 'node:assert/strict';
import {PROGRAMS,TOTAL_QUESTOES} from '../data.js';
import {CONTENT,GABARITO_PROVISORIO,QUESTOES_PROVISORIAS} from '../content.js';
import {PAGES} from '../pages.js';

test('150 perguntas distintas, 5 programas de 30 e gabarito jogável',()=>{
  const all=PROGRAMS.flatMap(p=>p.questions);
  assert.equal(PROGRAMS.length,5);
  assert.deepEqual(PROGRAMS.map(p=>p.code),['151','152','153','154','155']);
  assert.equal(TOTAL_QUESTOES,150);
  assert.equal(Object.keys(CONTENT).length,150);
  assert.deepEqual(all.map(q=>q.id),Array.from({length:150},(_,i)=>i+1));
  assert.ok(PROGRAMS.every(p=>p.questions.length===30));
  for(const q of all){
    assert.ok(q.prompt.length>10,q.id);
    assert.equal(q.options.length,4,q.id);
    assert.equal(new Set(q.options).size,4,q.id);
    assert.ok(['A','B','C','D'].includes(q.answer),`sem resposta na questão ${q.id}`);
    assert.ok(['interpreted','provisional'].includes(q.answerStatus),q.id);
    assert.ok(PAGES[q.page]?.uri.startsWith('https://'),q.id);
  }
});
test('18 hipóteses assinaladas separadamente, sem alegação de gabarito oficial',()=>{
  assert.equal(QUESTOES_PROVISORIAS.length,18);
  assert.equal(new Set(QUESTOES_PROVISORIAS).size,18);
  for(const id of QUESTOES_PROVISORIAS){
    assert.equal(CONTENT[id].answerStatus,'provisional');
    assert.equal(CONTENT[id].originalAnswer,null);
    assert.equal(CONTENT[id].answer,GABARITO_PROVISORIO[id]);
  }
  assert.equal(Object.values(CONTENT).filter(q=>q.answerStatus==='interpreted').length,132);
});
