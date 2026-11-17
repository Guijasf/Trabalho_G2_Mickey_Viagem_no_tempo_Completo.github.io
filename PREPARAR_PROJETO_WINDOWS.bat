@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0pense-bem-mickey-viagem-no-tempo"
echo.
echo Pense Bem - Mickey Viagem no Tempo / AV2

echo 1. Instalando dependencias...
call npm install
if errorlevel 1 goto error

echo 2. Executando testes...
call npm test
if errorlevel 1 goto error

echo 3. Gerando arquivo do Snack...
call npm run snack
if errorlevel 1 goto error

echo.
echo Preparacao concluida.
echo Para executar: npm start

echo Para o professor: copie Snack-App.js para snack.expo.dev e salve sua URL.
echo Os arquivos de imagem originais podem ser recuperados com npm run recuperar:imagens.
pause
exit /b 0
:error
echo Ocorreu um erro. Revise a mensagem acima.
pause
exit /b 1
