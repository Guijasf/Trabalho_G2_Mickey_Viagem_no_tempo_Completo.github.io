// Cada época tem uma identidade completa: fundo, cartão, contraste, luz e arte.
// As imagens históricas permanecem intactas: o recorte é apenas de apresentação.
const ROOT='https://raw.githubusercontent.com/Guijasf/Trabalho_G2_Mickey_Viagem_no_tempo_Completo.github.io/main/pense-bem-mickey-viagem-no-tempo/assets/';
const base={
  name:'Viagem no Tempo',mode:'Homem das cavernas',image:{uri:ROOT+'journey.png'},
  background:'#071D25',surface:'#122C35',ink:'#F6FAF7',muted:'#BED2CE',accent:'#3DE6B2',
  soft:'#194047',border:'#32616A',portal:'#3DE6B2',hero:'#0B3742',heroScrim:'#081E25C9',
  highlight:'#D6FFEC',tag:'#21464D',statusBar:'#071D25',
};
export const DEFAULT_THEME=base;
export const THEMES={
  '151':{
    ...base,name:'Pré-história',mode:'Homem das cavernas',image:{uri:ROOT+'era-151.png'},
    background:'#211810',surface:'#36271B',ink:'#FFF3DF',muted:'#E3C9A7',accent:'#FFB35D',
    soft:'#503521',border:'#825735',portal:'#62E3A4',hero:'#56311E',heroScrim:'#23140CD9',
    highlight:'#FFE3A8',tag:'#5B3A20',statusBar:'#211810',
  },
  '152':{
    ...base,name:'Extremo Oriente',mode:'Guardião da Muralha',image:{uri:ROOT+'era-152.png'},
    background:'#211219',surface:'#361D2A',ink:'#FFF0F0',muted:'#E8BFC9',accent:'#FF8074',
    soft:'#502736',border:'#834053',portal:'#60E3C5',hero:'#592334',heroScrim:'#210E19D9',
    highlight:'#FFD1C2',tag:'#5E2A38',statusBar:'#211219',
  },
  '153':{
    ...base,name:'Era das invenções',mode:'Inventor',image:{uri:ROOT+'era-153.png'},
    background:'#111B2A',surface:'#1C3043',ink:'#F0F9FF',muted:'#BBDAE9',accent:'#7FD9FF',
    soft:'#25445C',border:'#466D8E',portal:'#55FFCF',hero:'#153B53',heroScrim:'#0A1C2FD9',
    highlight:'#DBF6FF',tag:'#294D64',statusBar:'#111B2A',
  },
  '154':{
    ...base,name:'Povos das Américas',mode:'Explorador dos Andes',image:{uri:ROOT+'era-154.png'},
    background:'#0E241B',surface:'#193D2B',ink:'#F5FFE8',muted:'#C5E7BD',accent:'#E9C76D',
    soft:'#2A5537',border:'#567D50',portal:'#6DF6AE',hero:'#24543A',heroScrim:'#0B271CD9',
    highlight:'#F8E8B3',tag:'#3D6340',statusBar:'#0E241B',
  },
  '155':{
    ...base,name:'Egito Antigo',mode:'Faraó',image:{uri:ROOT+'era-155.png'},
    background:'#0E2034',surface:'#192F4B',ink:'#FFF6E0',muted:'#D9D1BD',accent:'#F5C95A',
    soft:'#304361',border:'#6F6682',portal:'#65F0CE',hero:'#14395D',heroScrim:'#0B1D35D9',
    highlight:'#FFE8A2',tag:'#344B69',statusBar:'#0E2034',
  },
};
