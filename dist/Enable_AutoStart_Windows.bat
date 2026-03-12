@echo off
set "SCRIPT_PATH=%~dp0stillgrowing-win.exe"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "LINK_NAME=%STARTUP_FOLDER%\StillGrowing.lnk"
echo Creating Startup Shortcut...
powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%LINK_NAME%');$s.TargetPath='%SCRIPT_PATH%';$s.WorkingDirectory='%~dp0';$s.Save()"
echo SUCCESS! StillGrowing will now start automatically.
pause