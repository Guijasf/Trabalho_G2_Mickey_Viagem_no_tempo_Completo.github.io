# Interface clássica do Pense Bem — AV2

## O que foi alterado na interface

A tela de respostas agora reproduz a organização visual do **Pense Bem** usado como referência na página 3 do enunciado:

- Carcaça bege, identificação TECTOY e visor digital preto com o código do programa e o número da questão (`151 → 01:` até `151 → 30:`).
- Visor separado para `Tentativa 1 de 3`, atualizado de acordo com as respostas erradas.
- Placar visível no corpo do aparelho (`PONTOS 0/90`).
- Teclas **A (vermelha), B (amarela), C (azul), D (verde)**, em grade 2 × 2, com retorno visual sobre as teclas usadas.
- Botão **Reiniciar Jogo**, que limpa imediatamente pontos, tentativa e posição do programa.
- Botão de **Próxima pergunta** apenas quando a pergunta termina (acerto ou 3 erros); na 30ª, o botão abre o resultado.

## Modos preservados

O **modo Livro** exibe a página digitalizada acima das teclas, com opção de ampliar. O **modo Quiz** apresenta a pergunta e as alternativas escritas antes das mesmas quatro teclas. Trocar de modo não altera tentativas nem pontuação.

As telas de seleção de épocas e os portais animados foram mantidos. A identidade clássica do aparelho é fixa mesmo quando muda a ambientação do jogo.

## Verificações

- `npm test`: testes de 5 programas, 150 perguntas, 3/2/1/0, reinício, visor e códigos secretos.
- `npm run check`: checagem de conteúdo e alertas de entrega.
- `npm run snack`: gera o arquivo único `Snack-App.js` com a interface nova.
- Sintaxe JSX de `App.js` e `Snack-App.js` analisada sem erros com o parser TypeScript.

**Limitação:** não foi possível instalar/rodar Expo Go/Android/iOS ou acessar uma publicação Snack no ambiente de preparação. Teste a interface real no dispositivo antes da apresentação.

## Gabarito

A alteração foi **visual**. As 132 respostas editoriais e as 18 hipóteses existentes no projeto **não foram homologadas nem substituídas**. O gabarito precisa de revisão humana no livro original. O PDF da pasta `entrega/` permanece um rascunho.
