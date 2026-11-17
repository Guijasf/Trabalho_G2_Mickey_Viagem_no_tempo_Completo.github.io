# Revisão de gabarito — AV2 Mobile

Este documento separa as **132 respostas já interpretadas** das **18 hipóteses adicionadas para permitir partidas completas**.

**Não existe confirmação do gabarito oficial**, inclusive das 132 respostas anteriores. É necessário validar o livro com o professor antes da entrega.

## Questões que exigem revisão prioritária

| Programa | Nº original | Letra provisória | Por que precisa de revisão |
|---|---|---|---|
| 151 | 30 | C | Resposta entre moradias históricas ambígua |
| 152 | 32 | D | Rio Azul esperado pelo livro ainda não conferido |
| 152 | 36 | A | Afirmação antiga sobre varíola pode ser historicamente incorreta |
| 152 | 37 | B | Formulação do livro sobre habitantes |
| 152 | 40 | D | Número de quilômetros desatualizado/ambíguo |
| 152 | 49 | A | Materiais previstos para a estação Freedom |
| 152 | 54 | C | Interpretação da carta sobre Marte |
| 153 | 62 | A | Critério da revolução industrial |
| 153 | 64 | B | Referência ao escoamento da produção |
| 153 | 73 | B | Data e invenção mecânica parecem ambíguas |
| 153 | 83 | D | Frase esperada sobre arquitetura de Roma |
| 154 | 99 | B | Estafetas / mensageiros podem ser equivalentes |
| 154 | 120 | D | Identificação por imagem precisa confirmação |
| 155 | 121 | B | Figura A ausente na digitalização |
| 155 | 122 | D | Figura B ausente na digitalização |
| 155 | 123 | A | Figura C ausente na digitalização |
| 155 | 125 | D | Figura E ausente na digitalização |
| 155 | 126 | A | Figura F ausente na digitalização |

As alternativas em todas essas linhas são **hipóteses e não respostas verificadas**. As ilustrações A, B, C, E e F não podem ser reconstruídas com segurança a partir da página digitalizada.

## Como corrigir uma hipótese

Abra `pense-bem-mickey-viagem-no-tempo/content.js`, localize `GABARITO_PROVISORIO`, corrija a letra pelo gabarito original e, depois da verificação, substitua o `?` no campo da questão pela letra validada e remova sua entrada do objeto de hipóteses. Isso altera `answerStatus` de `provisional` para `interpreted`, ainda não `official`.

Depois rode `npm test`, `npm run gabarito`, `npm run snack` no diretório do app e `python ../scripts/gerar-rascunho-pdf.py` para atualizar os artefatos. **Validação factual de fonte é distinta de passar nos testes do código.**
