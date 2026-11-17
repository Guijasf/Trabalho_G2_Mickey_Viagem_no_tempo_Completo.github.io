# Pense Bem — Mickey: Viagem no Tempo | AV2 Mobile

**Versão 2.0 — projeto em React Native / Expo, com 5 programas e 150 questões.**

O trabalho foi revisado em função das regras fornecidas pelo professor Jota Pê (AV2 de Desenvolvimento Mobile, 17/11/2026). O documento original está em `entrega/ENUNCIADO_ORIGINAL.pdf`.

## O que está implementado

- 5 programas do livro **Pense Bem — Disney: Viagem no Tempo**, identificados como **151, 152, 153, 154 e 155**.
- **30 perguntas por programa** e **quatro alternativas A/B/C/D**, ligadas às teclas vermelho, amarelo, azul e verde.
- **Até 3 tentativas**; pontuação **3 pontos** na primeira, **2** na segunda, **1** na terceira, **0** após 3 erros.
- Exibição do resultado final, **pontuação máxima 90**, histórico e reinício.
- Modo **Livro** (páginas digitalizadas) e modo **Quiz** (enunciados e alternativas), com troca sem perder progresso.
- Portal animado de viagem no tempo, códigos secretos SHIFT + ELO/HISTORIA/INVENTOS/AMERICAS/EGITO/ORIGINAL, e opção de pular animação.
- Layout responsivo e componentes do React Native (Android, iOS e Web). **Android e iOS NÃO foram executados/validados neste ambiente.**

## Atenção — não é entrega pronta

**Nenhuma das 150 respostas é gabarito oficial recebido do professor.** Destas, 132 são interpretações anteriores do livro e **18 são hipóteses adicionais** para permitir que todas as perguntas sejam jogadas. As hipóteses estão sinalizadas na aplicação, no CSV e no PDF. Questões **121, 122, 123, 125 e 126** dependem de figuras que não aparecem completas na digitalização disponível. Nunca apresentar como gabarito oficial sem conferir o exemplar original.

**O PDF `entrega/FORMULARIO_RASCUNHO_REVISAR.pdf` não deve ser entregue sem revisão.** Falta matrícula/RA dos participantes, eventual outro integrante, confirmação de livro único entre grupos e URL real do Snack. O GitHub Pages não substitui o link Snack.

## Como instalar e testar

É necessário Node.js compatível com Expo SDK 58 (Node 22.13+ é recomendado).

```bash
cd pense-bem-mickey-viagem-no-tempo
npm install
npm test
npm start
```

Para ver no navegador: `npm run web`. Para exportar versão Web: `npm run export:web` (pasta `dist`). Para abrir no celular, use Expo Go compatível com o SDK 58 e teste um dos QR codes gerados pelo Expo.

Comandos extras:

```bash
npm run gabarito             # atualiza entrega/GABARITO_PROVISORIO.csv
npm run snack                # atualiza Snack-App.js (arquivo único)
npm run recuperar:imagens   # faz backup local das imagens do repositório anterior
npm run check                # valida o banco de questões e testes
```

## Passar para Expo Snack (obrigatório para o professor)

1. Abra [snack.expo.dev](https://snack.expo.dev/).
2. Apague o exemplo da entrada `App.js` e cole todo o conteúdo de `Snack-App.js`, na raiz deste pacote.
3. Selecione **Expo SDK 58** ou a versão compatível oferecida. O código usa bibliotecas padrão React Native, sem bibliotecas extras.
4. Teste os programas 151–155, incluindo uma pergunta visual; depois escolha **Save** no Snack autenticado na sua conta.
5. Copie a URL real do Snack e coloque na entrega do Google Classroom.

**O Snack ainda não foi publicado nem testado ao vivo por esta revisão.** As imagens são carregadas a partir dos arquivos já existentes no repositório original, via URL pública. É necessário acesso à rede para vê-las. Se o repositório for excluído ou os arquivos forem renomeados, elas deixarão de aparecer.

## Subir para o GitHub sem perder as imagens

Se você tem o clone original no PC, extraia este ZIP em uma pasta temporária e **copie os arquivos por cima do repositório original**, aceitando substituir arquivos com o mesmo nome. **Não apague a pasta `pense-bem-mickey-viagem-no-tempo/assets` que já existe no GitHub** nem a pasta `docs` antiga. Após conferir:

```bash
git status
git add .
git commit -m "Ajusta Pense Bem AV2: 150 perguntas, pontuacao, Snack e gabarito provisório"
git push origin main
```

Antes do commit, abra `entrega/` e revise se quer ou não versionar a folha de respostas provisória. **Nenhum commit foi criado por este pacote.**

Se você começar do zero, `npm run recuperar:imagens` baixa o acervo gráfico remoto para `assets/`, desde que os links originais continuem disponíveis. O aplicativo funciona com as URLs remotas sem essa cópia.

## Organização

```text
pense-bem-mickey-viagem-no-tempo/
  App.js               # Interface e portal animado React Native
  content.js           # 150 questões e 18 hipóteses marcadas
  data.js              # Programas, páginas e numeração do livro
  engine.js            # Regras 3/2/1/0, tentativas e placar
  pages.js             # URLs das páginas digitalizadas
  themes.js            # Épocas e artes
  secret-codes.js      # Easter eggs pelo Shift
  app.json             # Configuração Expo
  index.js             # Entrada React Native
  package.json         # Dependências e tarefas
  tests/               # Testes automáticos
scripts/               # Geração Snack/gabarito/PDF/recuperação de imagens
entrega/               # Enunciado, gabarito CSV, formulário rascunho
Snack-App.js           # Arquivo único para o Snack
```

**Alterações em relação ao projeto anterior:** removido bloqueio das questões sem resposta, padronizado limite de 90 pontos, hipóteses explicitamente marcadas, gabarito exportável para a planilha do formulário, `Snack-App.js` reduzido (sem base64), e testes adicionais. Conteúdo do livro continua sendo adaptação, não transcrição garantida.
