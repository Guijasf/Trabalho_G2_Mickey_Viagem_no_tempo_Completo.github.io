import {writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PROGRAMS} from '../pense-bem-mickey-viagem-no-tempo/data.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../entrega');
const rows=['programa;numero_no_programa;numero_do_livro;alternativa;status;pagina_impressa'];
for(const p of PROGRAMS)for(let i=0;i<p.questions.length;i++){
 const q=p.questions[i];
 rows.push([p.code,String(i+1).padStart(2,'0'),q.id,q.answer,q.answerStatus,q.printedPage].join(';'));
}
writeFileSync(resolve(root,'GABARITO_PROVISORIO.csv'),'\uFEFF'+rows.join('\n')+'\n');
console.log('entrega/GABARITO_PROVISORIO.csv atualizado. 18 respostas são hipóteses não verificadas.');
