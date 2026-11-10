// Optional browser check: npm install --no-save playwright, then run against exported web app.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { mkdirSync } = require('node:fs');
const { resolve } = require('node:path');
(async () => {
  const { PROGRAMS } = await import('../pense-bem-mickey-viagem-no-tempo/data.js');
  const dir=process.env.QA_DIR || '/tmp/pense-bem-qa'; mkdirSync(dir,{recursive:true});
  const browser=await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
  const p=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[]; p.on('pageerror',e=>errors.push(e.message));
  await p.goto(process.env.APP_URL || 'http://127.0.0.1:8765');
  await p.getByText('Escolha seu destino').waitFor();
  await p.screenshot({path:resolve(dir,'home.png'),fullPage:true});
  await p.getByRole('button',{name:'Abrir programa 151: O elo perdido',exact:true}).click();
  await p.getByRole('button',{name:'Trocar modo de jogo',exact:true}).click();
  await p.getByRole('button',{name:'A: Idade Média',exact:true}).click();
  await p.getByText('Ainda não. Você tem 2 tentativas.').waitFor();
  await p.getByRole('button',{name:'Trocar modo de jogo',exact:true}).click();
  await p.getByRole('button',{name:'Trocar modo de jogo',exact:true}).click();
  await p.getByText('2 tentativas restantes · até 2 pontos').waitFor();
  for (const [code,name] of [['ELO','Homem das cavernas'],['HISTORIA','Guardião da Muralha'],['INVENTOS','Inventor'],['AMERICAS','Explorador dos Andes'],['EGITO','Faraó']]) {
    await p.keyboard.press('Shift'); await p.keyboard.type(code);
    await p.getByText('Modo quiz',{exact:true}).waitFor();
    await p.getByRole('button',{name:'Trocar modo de jogo',exact:true}).click();
    await p.getByText(`Modo ${name} · livro`,{exact:true}).waitFor();
    await p.getByRole('button',{name:'Trocar modo de jogo',exact:true}).click();
    await p.getByText('2 tentativas restantes · até 2 pontos').waitFor();
  }
  await p.getByRole('button',{name:'C: Pré-História',exact:true}).click();
  await p.getByText('2 / 87 pontos',{exact:true}).waitFor();
  await p.screenshot({path:resolve(dir,'quiz-desktop.png'),fullPage:true});
  await p.getByRole('button',{name:'Próxima questão →',exact:true}).click();
  await p.setViewportSize({width:390,height:844});
  await p.screenshot({path:resolve(dir,'quiz-mobile.png'),fullPage:true});
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),'no horizontal overflow');
  await p.getByRole('button',{name:'Consultar página original',exact:true}).click();
  await p.getByRole('button',{name:'Aumentar ampliação',exact:true}).click();
  await p.getByText('150%',{exact:true}).waitFor();
  await p.getByRole('button',{name:'Fechar página',exact:true}).click();
  await p.getByRole('button',{name:'Abrir ajuda e escolher época',exact:true}).click();
  await p.getByRole('button',{name:'Extremo Oriente · HISTORIA',exact:true}).click();
  await p.getByText('← Modo Guardião da Muralha',{exact:true}).waitFor();
  await p.keyboard.press('Shift'); await p.keyboard.type('ORIGINAL');
  await p.getByText('← Modo Homem das cavernas',{exact:true}).waitFor();
  await p.getByRole('button',{name:'‹ Destinos',exact:true}).click();
  await p.getByRole('button',{name:'Continuar programa 151 · questão 2',exact:true}).click();
  await p.getByText('2 / 87 pontos',{exact:true}).waitFor();
  await p.getByRole('button',{name:'‹ Destinos',exact:true}).click();
  for(const program of PROGRAMS) {
    await p.getByRole('button',{name:`Abrir programa ${program.code}: ${program.title}`,exact:true}).click();
    for(const [index,q] of program.questions.entries()) {
      await p.getByText(`QUESTÃO ${index+1} DE 30`,{exact:true}).waitFor();
      if(q.answer) await p.getByRole('button',{name:`${q.answer}: ${q.options['ABCD'.indexOf(q.answer)]}`,exact:true}).click();
      else assert.ok(await p.getByRole('button',{name:`A: ${q.options[0]}`,exact:true}).isDisabled());
      const next=index===29?'Ver resultado →':q.answer?'Próxima questão →':'Continuar sem pontuar →';
      await p.getByRole('button',{name:next,exact:true}).click();
    }
    await p.getByText('EXPEDIÇÃO CONCLUÍDA',{exact:true}).waitFor();
    const count=program.questions.filter(q=>q.answer).length;
    await p.getByText(`${count} acertos em ${count} questões corrigidas.`,{exact:true}).waitFor();
    await p.getByRole('button',{name:'Recomeçar programa',exact:true}).click();
    await p.getByText(`0 / ${count*3} pontos`,{exact:true}).waitFor();
    await p.getByRole('button',{name:'‹ Destinos',exact:true}).click();
  }
  assert.deepEqual(errors,[]);
  console.log('Browser: 150 questions, 5 results/restarts, modes, themes, score/attempt preservation, pending questions, mobile layout, help and zoom passed; no runtime errors.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
