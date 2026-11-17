// Recupera imagens JÁ PUBLICADAS no repositório original para uma cópia local.
// O projeto funciona online sem cópia local; o download serve como backup.
// Para suporte offline, troque os URIs dos módulos pages.js/themes.js por require() locais.
import {mkdir,writeFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PAGE_NUMBERS} from '../pense-bem-mickey-viagem-no-tempo/pages.js';
const base='https://raw.githubusercontent.com/Guijasf/Trabalho_G2_Mickey_Viagem_no_tempo_Completo.github.io/main/pense-bem-mickey-viagem-no-tempo/assets/';
const target=resolve(dirname(fileURLToPath(import.meta.url)),'../pense-bem-mickey-viagem-no-tempo/assets');
const files=['cover.jpg','journey.png',...Array.from({length:5},(_,i)=>`era-${151+i}.png`),...PAGE_NUMBERS.map(n=>`page-${String(n).padStart(2,'0')}.jpg`)];
await mkdir(target,{recursive:true});
let failures=0;
for(const name of files){
  const destination=resolve(target,name);
  try{await access(destination);console.log(`Já existe: ${name}`);continue;}catch{}
  try{
    const response=await fetch(base+name);
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(!bytes.length)throw new Error('arquivo vazio');
    await writeFile(destination,bytes);
    console.log(`Recuperado: ${name} (${bytes.length} bytes)`);
  }catch(error){failures++;console.error(`Não foi possível recuperar ${name}: ${error.message}`);}
}
if(failures){console.error(`${failures} imagem(ns) não foram obtidas. Verifique rede e nome do repositório.`);process.exitCode=1;}
