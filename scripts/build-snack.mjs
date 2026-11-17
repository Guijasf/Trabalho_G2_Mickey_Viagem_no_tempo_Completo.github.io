// Gera um App.js único para colar diretamente em https://snack.expo.dev/.
// As imagens são consumidas por URL do repositório para evitar arquivo base64 de 18 MB.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=dirname(fileURLToPath(import.meta.url));
const root=resolve(dir,'../pense-bem-mickey-viagem-no-tempo');
const files=['content.js','data.js','engine.js','themes.js','pages.js','secret-codes.js'];
const parts=files.map(file=>{
  let source=readFileSync(resolve(root,file),'utf8');
  source=source.replace(/^import\s+.*?from\s+['"]\.\/.*?['"];?\s*$/gm,'');
  source=source.replace(/\bexport\s+(?=(const|function|class)\b)/g,'');
  return `// ----- ${file} -----\n`+source.trim();
});
let app=readFileSync(resolve(root,'App.js'),'utf8');
app=app.replace(/^import\s+.*?from\s+['"]\.\/.*?['"];?\s*$/gm,'');
app=app.replace(/export default function App\(/,'export default function App(');
const title='// Snack - Pense Bem Mickey Viagem no Tempo - 150 questões\n';
// ES imports devem ficar antes das declarações combinadas.
const reactImports=app.split('\n').filter(line=>/^import\s+.*?from\s+['"](react|react-native)['"]/.test(line));
app=app.split('\n').filter(line=>!reactImports.includes(line)).join('\n');
const full=title+reactImports.join('\n')+'\n\n'+parts.join('\n\n')+'\n\n// ----- App.js -----\n'+app;
writeFileSync(resolve(dir,'../Snack-App.js'),full);
writeFileSync(resolve(dir,'../entrega/Snack-App.js'),full);
console.log(`Snack-App.js gerado (${full.length} caracteres). Cole em snack.expo.dev e salve o projeto.`);
