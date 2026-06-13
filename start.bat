@echo off
setlocal
cd /d "%~dp0"

if not exist node_modules (
  echo Elso inditas: csomagok telepitese...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo Hiba tortent a csomagok telepitese kozben.
    pause
    exit /b 1
  )
)

echo Lemur VB inditasa...
echo Megnyitas: http://127.0.0.1:3000
start "" "http://127.0.0.1:3000"
call npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
pause
