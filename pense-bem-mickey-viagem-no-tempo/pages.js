const BOOK_IMAGE_ROOT='https://raw.githubusercontent.com/Guijasf/Trabalho_G2_Mickey_Viagem_no_tempo_Completo.github.io/main/pense-bem-mickey-viagem-no-tempo/assets/';
export const PAGE_NUMBERS=[5,6,7,8,9,11,12,13,14,15,17,18,19,20,21,23,24,25,26,27,29,30,31,32,33];
export const PAGES=Object.fromEntries(PAGE_NUMBERS.map(page=>[page,{uri:BOOK_IMAGE_ROOT+`page-${String(page).padStart(2,'0')}.jpg`} ]));
