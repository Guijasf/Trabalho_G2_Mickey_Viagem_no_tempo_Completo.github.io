import assert from 'node:assert/strict';
import { SECRET_CODES, emptySecret, readSecret } from '../secret-codes.js';
for(const [code,themeCode] of Object.entries(SECRET_CODES)) {
  for(const text of [code,code.toLowerCase()]) {
    let r=readSecret(emptySecret(),{key:'Shift'},0);
    for(const [i,key] of [...text].entries()) r=readSecret(r.state,{key},100*(i+1));
    assert.equal(r.matched,true); assert.equal(r.themeCode,themeCode); assert.deepEqual(r.state,emptySecret());
  }
}
let armed=readSecret(emptySecret(),{key:'Shift'},0).state;
assert.equal(readSecret(armed,{key:'E'},6001).state.armed,false);
assert.equal(readSecret(armed,{key:'Escape'},1).state.armed,false);
assert.equal(readSecret(armed,{key:'E',editable:true},1).state.armed,false);
assert.equal(readSecret(armed,{key:'E',ctrlKey:true},1).state.armed,false);
assert.equal(readSecret(armed,{key:'E',repeat:true},1).state,armed);
assert.equal(readSecret(emptySecret(),{key:'E'},1).state.armed,false);
console.log('Códigos: seis temas/reset, maiúsculas, minúsculas, prazo, cancelamento e campos editáveis aprovados.');
