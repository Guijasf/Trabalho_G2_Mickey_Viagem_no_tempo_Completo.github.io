// Configurações puras e testáveis da UX. O legado é o padrão.
export const DEFAULT_CODE_GATE_ENABLED = true;
export const DEFAULT_GAME_MODE = 'book';
export const UI_VERSION = '2.3.0';
export function getProgramTheme(programCode,themeMap,defaultTheme){
  return themeMap[programCode] || defaultTheme;
}
export function getDestinationDescription(locked,code,questionCount){
  return locked ? 'Digite o código para desbloquear' : `${code} • ${questionCount} perguntas`;
}
