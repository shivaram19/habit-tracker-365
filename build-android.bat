@echo off
REM Build and Install Android App with proper environment
SET ANDROID_HOME=C:\Users\smorigala\AppData\Local\Android\Sdk
SET ANDROID_SDK_ROOT=C:\Users\smorigala\AppData\Local\Android\Sdk
SET PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%
SET JAVA_OPTS=-Djavax.net.ssl.trustStoreType=Windows-ROOT -Dorg.gradle.daemon=true

echo.
echo ==================================== 
echo Building Android Development Build
echo ====================================
echo This will take 3-5 minutes...
echo.

npx expo run:android --no-build-cache

echo.
echo ====================================
echo Build Complete!
echo ====================================
