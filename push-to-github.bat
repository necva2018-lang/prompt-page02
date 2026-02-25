@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM 嘗試找到 git（若 PATH 沒有）
where git >nul 2>&1
if errorlevel 1 (
  if exist "C:\Program Files\Git\bin\git.exe" (
    set "PATH=C:\Program Files\Git\bin;%PATH%"
  ) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set "PATH=C:\Program Files (x86)\Git\bin;%PATH%"
  )
)

where git >nul 2>&1
if errorlevel 1 (
  echo [X] 找不到 git。請先安裝 Git for Windows: https://git-scm.com/
  pause
  exit /b 1
)

set REMOTE=https://github.com/necva2018-lang/prompt-page02.git
set BRANCH=main

if not exist ".git" (
  echo 初始化 Git...
  git init
  git branch -M %BRANCH%
  git remote add origin %REMOTE%
)

echo 加入所有檔案...
git add .

echo 建立版本 1 提交...
git commit -m "v1.0.0 - Prompt 圖書館 MVP 初始版本" 2>nul
if errorlevel 1 (
  echo.
  echo 沒有新變更可提交，或已是第一次提交。
  echo 嘗試推送到遠端...
) else (
  echo 提交完成。
)

echo.
echo 推送到 GitHub: %REMOTE%
git push -u origin %BRANCH%
if errorlevel 1 (
  echo.
  echo 推送被拒，可能是遠端已有內容。正在拉取並合併...
  git pull origin %BRANCH% --allow-unrelated-histories --no-edit
  if errorlevel 1 (
    echo [X] 拉取失敗。請手動執行:
    echo     git pull origin %BRANCH% --allow-unrelated-histories --no-edit
    echo     git push -u origin %BRANCH%
    pause
    exit /b 1
  )
  echo 再次推送...
  git push -u origin %BRANCH%
  if errorlevel 1 (
    echo [X] 推送仍失敗。若需登入請用 GitHub 帳密或 Personal Access Token。
    pause
    exit /b 1
  )
)

echo.
echo [OK] 已成功推送到 GitHub，版本 1。
pause
