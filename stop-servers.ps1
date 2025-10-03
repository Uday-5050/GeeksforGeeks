# Stop Both Backend and Frontend Servers
# This script terminates all Python and Node.js processes related to the servers

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Stopping Healthcare Triage Bot Servers" -ForegroundColor Yellow
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "[1/3] Checking running processes..." -ForegroundColor Yellow

# Find Node.js processes (Frontend)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Found $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor White
} else {
    Write-Host "   No Node.js processes found" -ForegroundColor Gray
}

# Find Python processes (Backend)
$pythonProcesses = Get-Process -Name "python*" -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    Write-Host "   Found $($pythonProcesses.Count) Python process(es)" -ForegroundColor White
} else {
    Write-Host "   No Python processes found" -ForegroundColor Gray
}

Write-Host "`n[2/3] Stopping servers..." -ForegroundColor Yellow

# Stop Node.js processes
if ($nodeProcesses) {
    try {
        Stop-Process -Name "node" -Force -ErrorAction Stop
        Write-Host "   ✓ Stopped Frontend (Node.js)" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Failed to stop Node.js: $_" -ForegroundColor Red
    }
} else {
    Write-Host "   → No Frontend server to stop" -ForegroundColor Gray
}

# Stop Python processes (be careful - only stop if running uvicorn)
if ($pythonProcesses) {
    foreach ($proc in $pythonProcesses) {
        try {
            $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($proc.Id)").CommandLine
            if ($cmdLine -like "*uvicorn*") {
                Stop-Process -Id $proc.Id -Force
                Write-Host "   ✓ Stopped Backend (Python/Uvicorn)" -ForegroundColor Green
            }
        } catch {
            # Silently continue if we can't get command line
        }
    }
}

Write-Host "`n[3/3] Verifying shutdown..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Check if ports are free
$port8000 = netstat -ano | findstr ":8000.*LISTENING"
$port3000 = netstat -ano | findstr ":3000.*LISTENING"

if (-not $port8000) {
    Write-Host "   ✓ Port 8000 is free (Backend stopped)" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Port 8000 still in use" -ForegroundColor Yellow
}

if (-not $port3000) {
    Write-Host "   ✓ Port 3000 is free (Frontend stopped)" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Port 3000 still in use" -ForegroundColor Yellow
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Servers Stopped" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "To start the servers again, run:" -ForegroundColor Gray
Write-Host "  .\start-servers.ps1`n" -ForegroundColor White
