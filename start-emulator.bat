@echo off
set JAVA_HOME=C:\Users\Bruno\AppData\Local\Android\jdk
set ANDROID_HOME=C:\Users\Bruno\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\Bruno\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

echo Demarrage de l'emulateur Android...
emulator -avd Pixel_8_API_35 -no-snapshot-load
