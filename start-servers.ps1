# Start Both Backend and Frontend Servers
# This script launches both servers in separate PowerShell windows

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Starting Healthcare Triage Bot Servers" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Backend server configuration
$backendPath = Join-Path $scriptDir "."
$backendCommand = "python -m uvicorn geeksforgeeks.triage:app --reload --host 0.0.0.0 --port 8000"

# Frontend server configuration
$frontendPath = Join-Path $scriptDir "triage-frontend"
$frontendCommand = "npm run dev"

Write-Host "[1/4] Checking if servers are already running..." -ForegroundColor Yellow

# Check if port 8000 is already in use
$port8000 = netstat -ano | findstr ":8000.*LISTENING"
if ($port8000) {
    Write-Host "   [WARN] Backend already running on port 8000" -ForegroundColor Yellow
} else {
    Write-Host "   [OK] Port 8000 available" -ForegroundColor Green
}

# Check if port 3000 is already in use
$port3000 = netstat -ano | findstr ":3000.*LISTENING"
if ($port3000) {
    Write-Host "   [WARN] Frontend already running on port 3000" -ForegroundColor Yellow
} else {
    Write-Host "   [OK] Port 3000 available" -ForegroundColor Green
}

Write-Host "`n[2/4] Starting Backend Server (FastAPI)..." -ForegroundColor Yellow

if (-not $port8000) {
    # Start backend in a new PowerShell window
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Cyan; $backendCommand"
    ) -WindowStyle Normal
    
    Write-Host "   [OK] Backend server launched in new window" -ForegroundColor Green
    Write-Host "   URL: http://localhost:8000" -ForegroundColor White
    Start-Sleep -Seconds 3
} else {
    Write-Host "   [SKIP] Already running" -ForegroundColor Yellow
}

Write-Host "`n[3/4] Starting Frontend Server (React + Vite)..." -ForegroundColor Yellow

if (-not $port3000) {
    # Start frontend in a new PowerShell window
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$frontendPath'; Write-Host 'Frontend Server Starting...' -ForegroundColor Cyan; $frontendCommand"
    ) -WindowStyle Normal
    
    Write-Host "   [OK] Frontend server launched in new window" -ForegroundColor Green
    Write-Host "   URL: http://localhost:3000" -ForegroundColor White
    Start-Sleep -Seconds 5
} else {
    Write-Host "   [SKIP] Already running" -ForegroundColor Yellow
}

Write-Host "`n[4/4] Verifying servers..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Check backend
try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($backendHealth.StatusCode -eq 200) {
        Write-Host "   [OK] Backend is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "   [WAIT] Backend not responding yet (may still be starting...)" -ForegroundColor Red
}

# Check frontend
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Host "   [OK] Frontend is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "   [WAIT] Frontend not responding yet (may still be starting...)" -ForegroundColor Yellow
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Servers Started Successfully!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "Access your application:" -ForegroundColor White
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs:  http://localhost:8000/docs`n" -ForegroundColor Cyan

Write-Host "The servers are running in separate windows." -ForegroundColor Yellow
Write-Host "To stop them, close the PowerShell windows or press Ctrl+C in each window.`n" -ForegroundColor Yellow

Write-Host "Tip: To stop all servers quickly, run:" -ForegroundColor Gray
Write-Host "  .\stop-servers.ps1`n" -ForegroundColor White

# Optional: Open browser
$openBrowser = Read-Host "Open browser to http://localhost:3000? (y/n)"
if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
    Start-Process "http://localhost:3000"
    Write-Host "`nBrowser opened!`n" -ForegroundColor Green
}

Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
