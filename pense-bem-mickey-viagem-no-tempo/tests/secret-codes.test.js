import test from 'node:test';
import assert from 'node:assert/strict';
import {emptySecret,readSecret,SECRET_CODES} from '../secret-codes.js';
test('SHIFT + código ativa apenas tema',()=>{
  for(const [code,themeCode] of Object.entries(SECRET_CODES)){
    let state=readSecret(emptySecret(),{key:'Shift'},1).state;
    let result;
    for(let i=0;i<code.length;i++){
      result=readSecret(state,{key:code[i]},2+i);state=result.state;
    }
    assert.equal(result.matched,true);
    assert.equal(result.themeCode,themeCode);
  }
});
