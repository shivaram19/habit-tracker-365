@echo off
SET ANDROID_HOME=C:\Users\smorigala\AppData\Local\Android\Sdk
SET ANDROID_SDK_ROOT=C:\Users\smorigala\AppData\Local\Android\Sdk
SET PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%
npm run android
