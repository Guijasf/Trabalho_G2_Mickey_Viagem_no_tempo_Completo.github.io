import test from 'node:test';
import assert from 'node:assert/strict';
import {PROGRAMS} from '../data.js';
import {normalizeProgramCode,resolveProgramCode} from '../program-access.js';

test('normalização de código aceita somente três dígitos',()=>{
  assert.equal(normalizeProgramCode(' 1a5-4 '),'154');
  assert.equal(normalizeProgramCode('151888'),'151');
  assert.equal(normalizeProgramCode(''), '');
});

test('cada um dos cinco códigos desbloqueia exatamente seu programa',()=>{
  for (const p of PROGRAMS){
    const {program,error}=resolveProgramCode(PROGRAMS,p.code);
    assert.equal(program,p);
    assert.equal(error,null);
    assert.equal(program.questions.length,30);
  }
});

test('códigos vazios, desconhecidos, curtos e incorretos são rejeitados',()=>{
  for (const bad of ['', '1', '15', '156', '999', 'ABC', '1511', '15A', null]) {
    const {program,error}=resolveProgramCode(PROGRAMS,bad);
    assert.equal(program,null,`código inválido ${bad}`);
    assert.ok(error);
  }
});

test('espaços externos podem ser ignorados, mas não números no meio',()=>{
  assert.equal(resolveProgramCode(PROGRAMS,' 154 ').program.code,'154');
  assert.equal(resolveProgramCode(PROGRAMS,'1 54').program,null);
});
