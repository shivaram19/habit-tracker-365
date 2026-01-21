# Android Emulator Launcher
# This script starts the Android emulator if not already running

$ErrorActionPreference = "SilentlyContinue"

# Set Android environment variables
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "Checking for running emulators..." -ForegroundColor Cyan

# Check if emulator is already running
$adbDevices = & adb devices 2>$null | Select-String "emulator"

if ($adbDevices) {
    Write-Host "✓ Emulator is already running!" -ForegroundColor Green
    & adb devices
    exit 0
}

Write-Host "Starting Android emulator (Pixel_5)..." -ForegroundColor Yellow
Write-Host "This will take 30-60 seconds. Please wait..." -ForegroundColor Gray

# Start emulator in background
Start-Process -FilePath "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd", "Pixel_5" -WindowStyle Normal

# Wait for emulator to be ready
$maxWait = 90
$waited = 0
$bootComplete = $false

Write-Host "Waiting for emulator to boot..." -ForegroundColor Yellow

while ($waited -lt $maxWait -and -not $bootComplete) {
    Start-Sleep -Seconds 3
    $waited += 3
    
    $devices = & adb devices 2>$null | Select-String "emulator.*device"
    if ($devices) {
        # Check if boot is complete
        $bootStatus = & adb shell getprop sys.boot_completed 2>$null
        if ($bootStatus -match "1") {
            $bootComplete = $true
        }
    }
    
    Write-Host "." -NoNewline -ForegroundColor Gray
}

Write-Host ""

if ($bootComplete) {
    Write-Host "✓ Emulator is ready!" -ForegroundColor Green
    Write-Host "`nConnected devices:" -ForegroundColor Cyan
    & adb devices
    Write-Host "`nYou can now run: npm run android" -ForegroundColor Green
} else {
    Write-Host "⚠ Emulator is starting but not fully booted yet. Please wait a bit more." -ForegroundColor Yellow
    Write-Host "Run 'adb devices' to check status" -ForegroundColor Gray
}
