import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {CONTENT,REVISAO_NOTAS} from '../content.js';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const visual=readFileSync(resolve(root,'visual-aids.js'),'utf8');
const app=readFileSync(resolve(root,'App.js'),'utf8');
const snack=readFileSync(resolve(root,'../Snack-App.js'),'utf8');
test('5 figuras complementares estão no projeto e no Snack',()=>{
  for(const id of [121,122,123,125,126]){
    assert.equal(CONTENT[id].answerStatus,'provisional');
    assert.equal(CONTENT[id].imageMissing,true);
    assert.ok(existsSync(resolve(root,`assets/figura-complementar-${id}.jpg`)));
    assert.match(visual,new RegExp(`figura-complementar-${id}\\.jpg`));
    assert.match(snack,new RegExp(`\\b${id}: \{ letter:`));
  }
  assert.match(snack,/data:image\/jpeg;base64,/);
});
test('o quiz inclui ilustrações originais disponíveis no livro',()=>{
  assert.match(app,/function BookVisualReference/);
  assert.match(app,/question\.visual/);
  assert.match(app,/function VisualQuestionIllustration/);
  assert.match(app,/resizeMode="contain"/);
  assert.doesNotMatch(app,/blurRadius=/);
});
test('99 e 120 continuam assinaladas como ambíguas',()=>{
  assert.match(REVISAO_NOTAS[99],/Ambiguidade/);
  assert.match(REVISAO_NOTAS[120],/Ambiguidade/);
});
