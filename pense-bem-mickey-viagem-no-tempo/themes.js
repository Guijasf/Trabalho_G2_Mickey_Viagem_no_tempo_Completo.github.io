// Imagens do próprio repositório original, mantidas por referência.
// `npm run recuperar:imagens` cria uma cópia local para preservar o acervo.
const ROOT='https://raw.githubusercontent.com/Guijasf/Trabalho_G2_Mickey_Viagem_no_tempo_Completo.github.io/main/pense-bem-mickey-viagem-no-tempo/assets/';
export const DEFAULT_THEME={
  name:'Viagem no Tempo',mode:'Homem das cavernas',image:{uri:ROOT+'journey.png'},
  background:'#F8F6EE',surface:'#FFFFFF',ink:'#132C2A',muted:'#4D6762',accent:'#147D62',soft:'#E5F3E9',border:'#C9DCD4',portal:'#20CA88',
};
export const THEMES={
  '151':{...DEFAULT_THEME,name:'Pré-história',mode:'Homem das cavernas',image:{uri:ROOT+'era-151.png'},accent:'#86623B',soft:'#F1E8D4',portal:'#3AE28F'},
  '152':{...DEFAULT_THEME,name:'Extremo Oriente',mode:'Guardião da Muralha',image:{uri:ROOT+'era-152.png'},accent:'#AB4F3C',soft:'#F7E7DF',portal:'#4BE9B4'},
  '153':{...DEFAULT_THEME,name:'Era das invenções',mode:'Inventor',image:{uri:ROOT+'era-153.png'},accent:'#7150AB',soft:'#EEE9FA',portal:'#40EDC6'},
  '154':{...DEFAULT_THEME,name:'Povos das Américas',mode:'Explorador dos Andes',image:{uri:ROOT+'era-154.png'},accent:'#B96829',soft:'#F9EBDD',portal:'#29C989'},
  '155':{...DEFAULT_THEME,name:'Egito Antigo',mode:'Faraó',image:{uri:ROOT+'era-155.png'},accent:'#96781E',soft:'#F9F1CE',portal:'#5CEDB5'},
};
