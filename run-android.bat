@echo off
set JAVA_HOME=C:\Users\Bruno\AppData\Local\Android\jdk
set ANDROID_HOME=C:\Users\Bruno\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\Bruno\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

cd /d "C:\Users\Bruno\Documents\GitHub\FlashCardBrevetDesColleges\DNB_FlashCard"
echo Lancement de l'application sur Android...
npx expo start --android
