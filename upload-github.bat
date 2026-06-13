@echo off
setlocal
cd /d "%~dp0"

set REMOTE_URL=https://github.com/zulteon/LEMUR-VB.git

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo Ez a mappa nem git repo.
  pause
  exit /b 1
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin %REMOTE_URL%
) else (
  git remote set-url origin %REMOTE_URL%
)

git branch -M main

echo.
echo Valtozasok:
git status --short
echo.

git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo Nincs feltoltendo valtozas.
  pause
  exit /b 0
)

set COMMIT_MSG=Update Lemur VB blog
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo.
  echo Hiba tortent a commit kozben.
  pause
  exit /b 1
)

git push -u origin main
if errorlevel 1 (
  echo.
  echo Hiba tortent a GitHub feltoltes kozben.
  pause
  exit /b 1
)

echo.
echo Kesz: https://github.com/zulteon/LEMUR-VB
pause
