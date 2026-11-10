import { CONTENT } from './content.js';
const SECTIONS = [
  { code: '151', title: 'O elo perdido', pages: [
    { page: 5, from: 1, to: 6, topic: 'O elo perdido' },
    { page: 6, from: 7, to: 12, topic: 'Cruzadas de peso' },
    { page: 7, from: 13, to: 18, topic: 'Você sabia?' },
    { page: 8, from: 19, to: 24, topic: 'Descobertas' },
    { page: 9, from: 25, to: 30, topic: 'Descobertas' },
  ] },
  { code: '152', title: 'Viagem pela história', pages: [
    { page: 11, from: 31, to: 37, topic: 'No Extremo Oriente' },
    { page: 12, from: 38, to: 43, topic: 'Os maiores' },
    { page: 13, from: 44, to: 50, topic: 'Voando alto' },
    { page: 14, from: 51, to: 56, topic: 'Carta enigmática' },
    { page: 15, from: 57, to: 60, topic: 'Quebra-cabeça' },
  ] },
  { code: '153', title: 'Inventos e civilizações', pages: [
    { page: 17, from: 61, to: 66, topic: 'Revolução Industrial' },
    { page: 18, from: 67, to: 73, topic: 'Inventos e inventores' },
    { page: 19, from: 74, to: 79, topic: 'Na Roma Antiga' },
    { page: 20, from: 80, to: 85, topic: 'Técnica e cultura' },
    { page: 21, from: 86, to: 90, topic: 'Mais cruzadas' },
  ] },
  { code: '154', title: 'Povos das Américas', pages: [
    { page: 23, from: 91, to: 97, topic: 'Erro de cálculo' },
    { page: 24, from: 98, to: 103, topic: 'O Império Inca' },
    { page: 25, from: 104, to: 110, topic: 'No México' },
    { page: 26, from: 111, to: 116, topic: 'Curiosidades' },
    { page: 27, from: 117, to: 120, topic: 'Identifique' },
  ] },
  { code: '155', title: 'Civilização egípcia', pages: [
    { page: 29, from: 121, to: 126, topic: 'Civilização egípcia' },
    { page: 30, from: 127, to: 133, topic: 'Às margens do Nilo' },
    { page: 31, from: 134, to: 139, topic: 'Forme as frases' },
    { page: 32, from: 140, to: 146, topic: 'Mais informações' },
    { page: 33, from: 147, to: 150, topic: 'O que é?' },
  ] },
];

export const PROGRAMS = SECTIONS.map(({ code, title, pages }) => ({
  code,
  title,
  questions: pages.flatMap(({ page, from, to, topic }) =>
    Array.from({ length: to - from + 1 }, (_, index) => ({
      id: from + index,
      ...CONTENT[from + index],
      page,
      printedPage: page - 2,
      topic,
    }))
  ),
}));
