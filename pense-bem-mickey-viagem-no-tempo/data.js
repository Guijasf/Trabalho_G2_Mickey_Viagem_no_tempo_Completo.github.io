import { CONTENT } from './content.js';

const SECTIONS = [
  { code: '151', title: 'O elo perdido', pages: [[5,1,6,'O elo perdido'],[6,7,12,'Cruzadas de peso'],[7,13,18,'Você sabia?'],[8,19,24,'Descobertas'],[9,25,30,'Descobertas']] },
  { code: '152', title: 'Viagem pela história', pages: [[11,31,37,'Extremo Oriente'],[12,38,43,'Os maiores'],[13,44,50,'Voando alto'],[14,51,56,'Carta enigmática'],[15,57,60,'Quebra-cabeça']] },
  { code: '153', title: 'Inventos e civilizações', pages: [[17,61,66,'Revolução Industrial'],[18,67,73,'Inventos e inventores'],[19,74,79,'Roma antiga'],[20,80,85,'Técnica e cultura'],[21,86,90,'Mais cruzadas']] },
  { code: '154', title: 'Povos das Américas', pages: [[23,91,97,'Erro de cálculo'],[24,98,103,'Império Inca'],[25,104,110,'México'],[26,111,116,'Curiosidades'],[27,117,120,'Identifique']] },
  { code: '155', title: 'Civilização egípcia', pages: [[29,121,126,'Civilização egípcia'],[30,127,133,'Às margens do Nilo'],[31,134,139,'Forme as frases'],[32,140,146,'Mais informações'],[33,147,150,'O que é?']] },
];

export const PROGRAMS = SECTIONS.map(({code,title,pages}) => ({
  code, title,
  questions: pages.flatMap(([page,first,last,topic]) =>
    Array.from({length:last-first+1},(_,i) => ({...CONTENT[first+i],page,printedPage:page-2,topic})))
}));
export const TOTAL_QUESTOES = PROGRAMS.reduce((sum,p) => sum+p.questions.length,0);
