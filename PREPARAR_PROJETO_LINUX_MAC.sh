#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/pense-bem-mickey-viagem-no-tempo"
npm install
npm test
npm run snack
echo 'Concluido. npm start para executar e Snack-App.js para copiar no Expo Snack.'
