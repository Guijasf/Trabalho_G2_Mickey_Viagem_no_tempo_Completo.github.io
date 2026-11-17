import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_CODE_GATE_ENABLED,DEFAULT_GAME_MODE,getProgramTheme,getDestinationDescription,UI_VERSION} from '../visual-config.js';
import {DEFAULT_THEME,THEMES} from '../themes.js';
import {PROGRAMS} from '../data.js';

test('o legado vem primeiro: acesso por código ligado e modo livro',()=>{
  assert.equal(DEFAULT_CODE_GATE_ENABLED,true);
  assert.equal(DEFAULT_GAME_MODE,'book');
  assert.equal(UI_VERSION,'2.4.0');
});

test('cinco temas realmente alteram o fundo, superfícies e contraste',()=>{
  assert.equal(Object.keys(THEMES).length,5);
  const backgrounds=new Set(),accents=new Set(),surfaces=new Set();
  for(const program of PROGRAMS){
    const era=getProgramTheme(program.code,THEMES,DEFAULT_THEME);
    assert.ok(era?.image?.uri);
    assert.notEqual(era.background,DEFAULT_THEME.background);
    assert.notEqual(era.surface,DEFAULT_THEME.surface);
    assert.notEqual(era.accent,DEFAULT_THEME.accent);
    for(const key of ['background','surface','ink','muted','accent','border','soft','hero','heroScrim']){
      assert.match(era[key],/^#[\da-fA-F]{6}(?:[\da-fA-F]{2})?$/);
    }
    backgrounds.add(era.background);accents.add(era.accent);surfaces.add(era.surface);
  }
  assert.equal(backgrounds.size,5);assert.equal(accents.size,5);assert.equal(surfaces.size,5);
});

test('o destino divulga código somente se acesso livre estiver ativo',()=>{
  assert.equal(getDestinationDescription(true,'151',30),'Digite o código para desbloquear');
  assert.equal(getDestinationDescription(false,'151',30),'151 • 30 perguntas');
});
