@echo off
chcp 65001 >nul
title PS5 Directo
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 app.py %*
) else (
  python app.py %*
)
if %errorlevel%==3 exit /b 0
echo.
echo PS5 Directo se ha cerrado.
pause
