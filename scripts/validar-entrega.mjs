import {PROGRAMS} from '../pense-bem-mickey-viagem-no-tempo/data.js';
import {QUESTOES_PROVISORIAS} from '../pense-bem-mickey-viagem-no-tempo/content.js';
console.log('VERIFICAÇÃO DA ENTREGA');
console.log(`Programas: ${PROGRAMS.map(p=>p.code).join(', ')}; perguntas: ${PROGRAMS.reduce((sum,p)=>sum+p.questions.length,0)}.`);
console.log(`ALERTA: ${QUESTOES_PROVISORIAS.length} hipóteses ainda requerem gabarito original; as outras 132 também precisam de conferência.`);
console.log('ALERTA: falta a URL real do Snack salva na conta do grupo e o teste no dispositivo.');
console.log('ALERTA: preencher RA/matrículas e confirmar livro exclusivo e apresentação.');
