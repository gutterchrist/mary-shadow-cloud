@echo off
:: This script removes the startup shortcut for the Mary Shadow Cloud
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "LINK_NAME=%STARTUP_FOLDER%\MaryShadowCloud.lnk"

if exist "%LINK_NAME%" (
    echo Removing Startup Shortcut...
    del "%LINK_NAME%"
    echo.
    echo SUCCESS! Mary Shadow Cloud will no longer start automatically.
) else (
    echo No startup shortcut found.
)
pause
