@echo off
REM Set Android environment variables and start Expo dev server
SET ANDROID_HOME=C:\Users\smorigala\AppData\Local\Android\Sdk
SET ANDROID_SDK_ROOT=C:\Users\smorigala\AppData\Local\Android\Sdk
SET PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

echo.
echo ====================================
echo Android Environment Setup
echo ====================================
echo ANDROID_HOME: %ANDROID_HOME%
echo.
echo Checking ADB...
adb version
echo.
echo Checking devices...
adb devices
echo.
echo ====================================
echo Starting Expo Dev Server...
echo ====================================
echo.

npm run dev
