# Script d'installation automatique de l'environnement Android pour Expo/React Native

$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Chemins d'installation
$InstallDir = "$env:LOCALAPPDATA\Android"
$SdkDir = "$InstallDir\Sdk"
$JdkDir = "$InstallDir\jdk"
$CmdlineToolsDir = "$SdkDir\cmdline-tools"
$EmulatorDir = "$SdkDir\emulator"
$PlatformToolsDir = "$SdkDir\platform-tools"

Write-Host "=== Installation de l'environnement Android pour DNB FlashCard ===" -ForegroundColor Cyan
Write-Host ""

# Créer les répertoires
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
New-Item -ItemType Directory -Force -Path $SdkDir | Out-Null

# ============================================
# 1. Télécharger et installer OpenJDK 21
# ============================================
Write-Host "[1/6] Installation de Java JDK 21..." -ForegroundColor Yellow

$JdkZipUrl = "https://aka.ms/download-jdk/microsoft-jdk-21.0.6-windows-x64.zip"
$JdkZipFile = "$env:TEMP\microsoft-jdk-21.zip"

if (-not (Test-Path "$JdkDir\bin\java.exe")) {
    try {
        Write-Host "  -> Téléchargement du JDK (peut prendre quelques minutes)..."
        Invoke-WebRequest -Uri $JdkZipUrl -OutFile $JdkZipFile -UseBasicParsing
        
        Write-Host "  -> Extraction du JDK..."
        Expand-Archive -Path $JdkZipFile -DestinationPath $env:TEMP -Force
        
        # Trouver le dossier extrait
        $ExtractedJdk = Get-ChildItem -Path $env:TEMP -Filter "jdk-21*" -Directory | Select-Object -First 1
        if ($ExtractedJdk) {
            Remove-Item -Path $JdkDir -Recurse -Force -ErrorAction SilentlyContinue
            Move-Item -Path $ExtractedJdk.FullName -Destination $JdkDir -Force
        }
        
        Remove-Item $JdkZipFile -Force -ErrorAction SilentlyContinue
        Write-Host "  -> JDK installé avec succès!" -ForegroundColor Green
    } catch {
        Write-Host "  -> ERREUR lors de l'installation du JDK: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  -> JDK déjà installé" -ForegroundColor Green
}

# ============================================
# 2. Télécharger et installer Android SDK Command Line Tools
# ============================================
Write-Host "[2/6] Installation des Android SDK Command Line Tools..." -ForegroundColor Yellow

$CmdlineToolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$CmdlineToolsZip = "$env:TEMP\cmdline-tools.zip"

if (-not (Test-Path "$CmdlineToolsDir\latest\bin\sdkmanager.bat")) {
    try {
        Write-Host "  -> Téléchargement des command line tools..."
        Invoke-WebRequest -Uri $CmdlineToolsUrl -OutFile $CmdlineToolsZip -UseBasicParsing
        
        Write-Host "  -> Extraction..."
        Expand-Archive -Path $CmdlineToolsZip -DestinationPath $env:TEMP -Force
        
        # Renommer le dossier cmdline-tools en latest
        New-Item -ItemType Directory -Force -Path $CmdlineToolsDir | Out-Null
        $TempCmdlineDir = "$env:TEMP\cmdline-tools"
        if (Test-Path $TempCmdlineDir) {
            Remove-Item -Path "$CmdlineToolsDir\latest" -Recurse -Force -ErrorAction SilentlyContinue
            Move-Item -Path $TempCmdlineDir -Destination "$CmdlineToolsDir\latest" -Force
        }
        
        Remove-Item $CmdlineToolsZip -Force -ErrorAction SilentlyContinue
        Write-Host "  -> Command line tools installés!" -ForegroundColor Green
    } catch {
        Write-Host "  -> ERREUR: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  -> Command line tools déjà installés" -ForegroundColor Green
}

# ============================================
# 3. Configurer les variables d'environnement
# ============================================
Write-Host "[3/6] Configuration des variables d'environnement..." -ForegroundColor Yellow

$env:JAVA_HOME = $JdkDir
$env:ANDROID_HOME = $SdkDir
$env:ANDROID_SDK_ROOT = $SdkDir

[Environment]::SetEnvironmentVariable("JAVA_HOME", $JdkDir, "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $SdkDir, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $SdkDir, "User")

# Mettre à jour le PATH
$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
$PathsToAdd = @(
    "$JdkDir\bin"
    "$CmdlineToolsDir\latest\bin"
    "$SdkDir\platform-tools"
    "$SdkDir\emulator"
)

foreach ($PathToAdd in $PathsToAdd) {
    if (-not ($CurrentPath -like "*$PathToAdd*")) {
        $CurrentPath = "$PathToAdd;$CurrentPath"
    }
}

[Environment]::SetEnvironmentVariable("Path", $CurrentPath, "User")
Write-Host "  -> Variables d'environnement configurées!" -ForegroundColor Green

# ============================================
# 4. Installer les composants SDK nécessaires
# ============================================
Write-Host "[4/6] Installation des composants Android SDK..." -ForegroundColor Yellow

$SdkManager = "$CmdlineToolsDir\latest\bin\sdkmanager.bat"
$env:JAVA_HOME = $JdkDir

# Créer le dossier licenses
New-Item -ItemType Directory -Force -Path "$SdkDir\licenses" | Out-Null

# Créer les fichiers de licences directement (évite l'interaction)
$Licenses = @{
    "android-sdk-license" = @(
        "24333f8a63b6825ea9c5514f83c2829b004d1fee"
        "d56f5187479451eabf01fb78af6dfcb131a6481e"
        "84831b9409646a918e30573bab4c9c91346d8abd"
    )
    "android-googletv-license" = @("601085b94cd77f0b54ff86406957099ebe79c4d6")
    "android-sdk-arm-dbt-license" = @("859f317696f67ef3d7f30a50a5560e7834b43903")
    "android-sdk-preview-license" = @("84831b9409646a918e30573bab4c9c91346d8abd")
    "google-gdk-license" = @("33b6a2b64607f11b759f320ef9dff4ae5c47d97a")
    "intel-android-extra-license" = @("d975f751698a77b662f1254ddbeed3901e976f5a")
    "intel-android-sysimage-license" = @("d975f751698a77b662f1254ddbeed3901e976f5a")
    "mips-android-sysimage-license" = @("e9acab5b5fbb560a72cfaecce8946896ff6aab9d")
}

foreach ($LicenseFile in $Licenses.Keys) {
    $LicenseContent = $Licenses[$LicenseFile] -join "`n"
    $LicenseContent | Out-File -FilePath "$SdkDir\licenses\$LicenseFile" -Encoding ASCII -Force
}

Write-Host "  -> Licences acceptées"

# Installer les packages nécessaires
$Packages = @(
    "platform-tools"
    "platforms;android-35"
    "build-tools;35.0.0"
    "emulator"
    "system-images;android-35;google_apis;x86_64"
)

foreach ($Package in $Packages) {
    Write-Host "  -> Installation de $Package..."
    $proc = Start-Process -FilePath $SdkManager -ArgumentList "--sdk_root=$SdkDir", "$Package", "--install" -Wait -PassThru -WindowStyle Hidden
    if ($proc.ExitCode -ne 0) {
        Write-Host "  -> Attention: installation de $Package a retourné le code $($proc.ExitCode)" -ForegroundColor Yellow
    }
}

Write-Host "  -> Composants SDK installés!" -ForegroundColor Green

# ============================================
# 5. Créer l'émulateur Android
# ============================================
Write-Host "[5/6] Création de l'émulateur Android..." -ForegroundColor Yellow

$AvdManager = "$CmdlineToolsDir\latest\bin\avdmanager.bat"
$AvdName = "Pixel_8_API_35"

# Vérifier si l'émulateur existe déjà
$AvdList = & cmd /c "$AvdManager list avd 2>&1"
if ($AvdList -notlike "*$AvdName*") {
    Write-Host "  -> Création de l'AVD $AvdName..."
    & cmd /c "$AvdManager create avd -n $AvdName -k system-images;android-35;google_apis;x86_64 -d pixel_8 -f 2>&1" | Out-Null
    Write-Host "  -> Émulateur créé!" -ForegroundColor Green
} else {
    Write-Host "  -> Émulateur déjà existant" -ForegroundColor Green
}

# ============================================
# 6. Créer les scripts de lancement
# ============================================
Write-Host "[6/6] Création des scripts de lancement..." -ForegroundColor Yellow

$ProjectDir = $PSScriptRoot

# Script pour démarrer l'émulateur
$StartEmulatorScript = @"
@echo off
set JAVA_HOME=$JdkDir
set ANDROID_HOME=$SdkDir
set ANDROID_SDK_ROOT=$SdkDir
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

echo Demarrage de l'emulateur Android...
emulator -avd $AvdName -no-snapshot-load
"@

$StartEmulatorScript | Out-File -FilePath "$ProjectDir\start-emulator.bat" -Encoding ASCII

# Script pour lancer l'app Android
$RunAndroidScript = @"
@echo off
set JAVA_HOME=$JdkDir
set ANDROID_HOME=$SdkDir
set ANDROID_SDK_ROOT=$SdkDir
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

cd /d "$ProjectDir"
echo Lancement de l'application sur Android...
npx expo start --android
"@

$RunAndroidScript | Out-File -FilePath "$ProjectDir\run-android.bat" -Encoding ASCII

Write-Host "  -> Scripts créés!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Installation terminée avec succès! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Résumé:" -ForegroundColor White
Write-Host "  - JDK installé: $JdkDir"
Write-Host "  - Android SDK: $SdkDir"
Write-Host "  - Émulateur: $AvdName"
Write-Host ""
Write-Host "Pour utiliser:" -ForegroundColor White
Write-Host "  1. Double-cliquez sur 'start-emulator.bat' pour démarrer l'émulateur"
Write-Host "  2. Attendez que l'émulateur soit complètement démarré"
Write-Host "  3. Double-cliquez sur 'run-android.bat' pour lancer l'application"
Write-Host ""
Write-Host "Ou utilisez les commandes:" -ForegroundColor White
Write-Host "  npx expo start --android"
Write-Host ""
Write-Host "NOTE: Redémarrez votre terminal/VS Code pour que les nouvelles variables d'environnement soient prises en compte." -ForegroundColor Yellow
