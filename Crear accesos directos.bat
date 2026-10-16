@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
 "$w=New-Object -ComObject WScript.Shell; $d=(Get-Location).Path;" ^
 "foreach($f in @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('SendTo'))){" ^
 " $l=$w.CreateShortcut((Join-Path $f 'PS5 Directo.lnk'));" ^
 " $l.TargetPath=(Join-Path $env:WINDIR 'System32\wscript.exe');" ^
 " $l.Arguments='\"'+(Join-Path $d 'PS5 Directo.vbs')+'\"';" ^
 " $l.WorkingDirectory=$d; $l.IconLocation=(Join-Path $d 'web\ps5directo.ico');" ^
 " $l.Description='PS5 Directo'; $l.Save() }"
if %errorlevel%==0 (
  echo Listo:
  echo  - Icono "PS5 Directo" en el escritorio. Tambien puedes soltar archivos encima.
  echo  - Clic derecho en archivos ^> Enviar a ^> PS5 Directo.
) else (
  echo No se pudieron crear los accesos directos.
)
pause
