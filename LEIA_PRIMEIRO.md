# Pense Bem — Disney: Viagem no Tempo

Projeto acadêmico em React Native / Expo com cinco programas (151–155), 30 questões por programa e duas formas de jogar. O programa 156 não integra esta seleção de cinco programas.

## Jogar

- **Modo livro:** consulte a página escaneada e responda pelos botões coloridos A/B/C/D.
- **Modo quiz:** leia o enunciado e as quatro alternativas diretamente na tela. Questões visuais mantêm a página original disponível.
- O modo livro recebe o nome da época (Homem das cavernas, Faraó etc.), por ser a forma antiga de jogar. O modo moderno se chama sempre Modo quiz. O botão mostra o modo para o qual você vai trocar. A troca de modo e de tema preserva pontos, tentativas e posição.
- Acertos valem 3, 2 ou 1 ponto. Após três erros, a resposta é revelada e a questão é encerrada.
- Voltar a Destinos permite continuar a partida atual. Escolher um cartão inicia uma nova partida. O progresso fica em memória: recarregar/fechar o aplicativo o apaga.
- Toque na página para abrir o zoom, de 100% a 300%.

## Temas e códigos

No navegador, pressione Shift e digite o código, mantendo ou soltando Shift. Há até seis segundos entre as teclas. Atalhos não são capturados dentro de campos de texto.

| Código | Programa | Época | Nome do modo livro |
| --- | --- | --- | --- |
| ELO | 151 | Pré-história | Homem das cavernas |
| HISTORIA | 152 | Extremo Oriente | Guardião da Muralha |
| INVENTOS | 153 | Era das invenções | Inventor |
| AMERICAS | 154 | Povos das Américas | Explorador dos Andes |
| EGITO | 155 | Egito Antigo | Faraó |
| ORIGINAL | Qualquer | Visual original | Segue o programa atual |

No celular, use **Épocas & ajuda** ou segure um cartão. Segurar o logotipo restaura o visual original. Os códigos alteram a ambientação; não mudam o programa de perguntas.

## Executar e verificar

Requer Node.js/npm e um ambiente compatível com as versões declaradas no package.json.

```bash
cd pense-bem-mickey-viagem-no-tempo
npm ci
npm start
```

Use `npm run web` para abrir a versão web. Para Expo Go, confirme que o aplicativo instalado suporta a versão de SDK deste projeto. A compilação web não comprova compatibilidade com Android/iOS.

```bash
npm test
npm run export:web
npm run snack
node ../scripts/build-snack.mjs --check
```

Os testes cobrem as regras 3/2/1/0, navegação, reinício, prevenção de pontos duplicados, integridade das 150 perguntas e reconhecimento dos códigos. A execução automatizada no navegador não pôde ser concluída neste ambiente (Chromium indisponível); não foi marcada como aprovada. O roteiro opcional `scripts/browser-smoke.cjs` percorre a interface com Playwright contra a versão web servida na porta 8765. Requer Playwright e Chromium instalados. Defina APP_URL para outra URL ou CHROMIUM_PATH para outro executável.

## Expo Snack

`Snack-App.js` é gerado automaticamente e inclui as imagens em base64 (tamanho indicado pelo comando de geração). Não edite esse arquivo diretamente: altere os módulos e rode `npm run snack`.

Para um projeto mais fácil de manter no Snack, importe os módulos e a pasta assets do diretório `pense-bem-mickey-viagem-no-tempo`, usando App.js como entrada. Configure as dependências conforme package.json, respeitando a versão de SDK oferecida pelo Snack. A versão de arquivo único é uma alternativa, mas seu tamanho pode dificultar a colagem. Teste, salve em sua conta e copie a URL real para o formulário. **Nenhum link de Snack foi publicado nesta revisão.**

## Gabarito e entrega

As 150 perguntas foram adaptadas das páginas fornecidas. **132 respostas são interpretações editoriais, não o gabarito oficial; 18 estão pendentes.** Questões pendentes não recebem pontos e não aceitam alternativas. O resultado informa o total possível somente das questões corrigíveis, em vez de fingir uma pontuação sobre 90.

Confira [docs/GABARITO_REVISAO.md](docs/GABARITO_REVISAO.md), que lista todas as respostas e as pendências. A figura da página do Egito está incompleta para cinco exercícios. Algumas afirmações do livro são antigas: o conteúdo reproduz o exercício, não uma revisão histórica moderna.

Antes da entrega:

1. Conferir as 150 respostas com o gabarito original e obter as figuras ausentes. Atualizar content.js e gerar novamente o Snack.
2. Testar no celular/Expo Go e no Snack publicado, inclusive perguntas visuais, modo livro, quiz, zoom e todos os códigos no navegador.
3. Preencher nomes/matrículas, confirmar a exclusividade do livro entre os grupos e transferir os dados para o formulário oficial da disciplina.
4. Salvar o formulário oficial em PDF, inserir a URL real do Snack e entregar pelo canal da disciplina. O enunciado consultado indica apresentação em 17/11/2026; confirme com o professor eventuais alterações.

O [guia em PDF](docs/Guia_G2_Viagem_no_Tempo.pdf) é um apoio de revisão, não substitui o formulário oficial e não está pronto para submissão. Documentos antigos de Hércules não correspondem a este livro.

## Organização

- App.js: telas e interação; engine.js: regras de jogo.
- content.js: textos, alternativas e respostas; data.js: programas e páginas.
- themes.js: paletas e imagens; secret-codes.js: reconhecimento dos códigos.
- pages.js e assets/page-*.jpg: páginas de consulta.
- assets/era-*.png e journey.png: seis imagens fornecidas pelo usuário com Mickey e a turma, exibidas inteiras, sem novos recortes. Não substituem imagens usadas pelos exercícios. Ver [créditos](docs/IMAGENS.md).

Material acadêmico sem vínculo oficial com Disney ou Tectoy.
