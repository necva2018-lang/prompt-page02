@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Prompt 圖書館 安裝與啟動 ===
echo.

REM 若 PATH 沒有 npm，嘗試常見的 Node 安裝路徑
where npm >nul 2>&1
if errorlevel 1 (
  if exist "C:\Program Files\nodejs\npm.cmd" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
  ) else if exist "C:\Program Files (x86)\nodejs\npm.cmd" (
    set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
  ) else if exist "%LOCALAPPDATA%\Programs\node\npm.cmd" (
    set "PATH=%LOCALAPPDATA%\Programs\node;%PATH%"
  )
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [X] 找不到 npm。
  echo.
  echo 請先安裝 Node.js LTS: https://nodejs.org/
  echo 安裝完成後「關閉並重新開啟」此視窗，再雙擊本腳本。
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo 正在安裝依賴...
  call npm install
  if errorlevel 1 (
    echo [X] npm install 失敗
    pause
    exit /b 1
  )
  echo.
)

echo 啟動開發伺服器 (port 3002)...
echo 請在瀏覽器開啟: http://localhost:3002
echo 按 Ctrl+C 可停止
echo.
call npm run dev
pause
