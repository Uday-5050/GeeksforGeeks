# Google OAuth Quick Setup Script
# Run this after you get your credentials from Google Cloud Console

Write-Host "=== Google OAuth Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
$envFile = ".\geeksforgeeks\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found at $envFile" -ForegroundColor Red
    exit 1
}

Write-Host "Found .env file at: $envFile" -ForegroundColor Green
Write-Host ""

# Prompt for credentials
Write-Host "Please enter your Google OAuth credentials:" -ForegroundColor Yellow
Write-Host "(Get these from https://console.cloud.google.com/apis/credentials)" -ForegroundColor Gray
Write-Host ""

$clientId = Read-Host "Google Client ID"
$clientSecret = Read-Host "Google Client Secret"

if ([string]::IsNullOrWhiteSpace($clientId) -or [string]::IsNullOrWhiteSpace($clientSecret)) {
    Write-Host "Error: Client ID and Secret cannot be empty" -ForegroundColor Red
    exit 1
}

# Read current .env content
$envContent = Get-Content $envFile -Raw

# Check if Google credentials are already uncommented
if ($envContent -match "^GOOGLE_CLIENT_ID=.+" -and $envContent -notmatch "^# GOOGLE_CLIENT_ID") {
    Write-Host "Warning: Google credentials already configured in .env" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Setup cancelled" -ForegroundColor Yellow
        exit 0
    }
}

# Update or add Google credentials
$envContent = $envContent -replace "# GOOGLE_CLIENT_ID=.*", "GOOGLE_CLIENT_ID=$clientId"
$envContent = $envContent -replace "# GOOGLE_CLIENT_SECRET=.*", "GOOGLE_CLIENT_SECRET=$clientSecret"
$envContent = $envContent -replace "# GOOGLE_REDIRECT_URI=.*", "GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback"

# If credentials weren't found (commented), try uncommenting
if ($envContent -notmatch "^GOOGLE_CLIENT_ID=") {
    # Add credentials at the end of Google OAuth section
    $envContent = $envContent -replace "(# GitHub OAuth.*)", "GOOGLE_CLIENT_ID=$clientId`nGOOGLE_CLIENT_SECRET=$clientSecret`nGOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback`n`n`$1"
}

# Save updated .env
Set-Content -Path $envFile -Value $envContent -NoNewline

Write-Host ""
Write-Host "✅ Google OAuth credentials saved to .env" -ForegroundColor Green
Write-Host ""

# Check if backend is running
$pythonProcesses = Get-Process | Where-Object {$_.ProcessName -like "*python*"}
if ($pythonProcesses) {
    Write-Host "⚠️  Backend server is currently running" -ForegroundColor Yellow
    Write-Host "   You need to restart it to load new credentials:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   1. Stop the server (Ctrl+C in the terminal)" -ForegroundColor Cyan
    Write-Host "   2. Restart with: python -m uvicorn geeksforgeeks.triage:app --reload --port 8000" -ForegroundColor Cyan
    Write-Host ""
    
    $restart = Read-Host "Do you want me to restart the backend now? (y/n)"
    if ($restart -eq "y") {
        Write-Host "Stopping Python processes..." -ForegroundColor Yellow
        $pythonProcesses | Stop-Process -Force
        Start-Sleep -Seconds 2
        
        Write-Host "Starting backend server..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python -m uvicorn geeksforgeeks.triage:app --reload --port 8000"
        
        Start-Sleep -Seconds 3
        Write-Host "✅ Backend server restarted!" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  Backend server is not running" -ForegroundColor Cyan
    Write-Host "   Start it with: python -m uvicorn geeksforgeeks.triage:app --reload --port 8000" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure backend is running on http://localhost:8000" -ForegroundColor White
Write-Host "2. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "3. Click the Google button" -ForegroundColor White
Write-Host "4. You should see Google's account picker!" -ForegroundColor White
Write-Host ""
Write-Host "Note: You may need to add your email as a test user in Google Cloud Console" -ForegroundColor Gray
Write-Host "      (OAuth consent screen → Test users)" -ForegroundColor Gray
Write-Host ""
