# Restart Both Backend and Frontend Servers
# This script stops existing servers and starts fresh ones

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Restarting Healthcare Triage Bot Servers" -ForegroundColor Yellow
Write-Host "============================================`n" -ForegroundColor Cyan

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Step 1: Stopping existing servers...`n" -ForegroundColor Yellow
& "$scriptDir\stop-servers.ps1"

Write-Host "`nStep 2: Starting fresh servers...`n" -ForegroundColor Yellow
Start-Sleep -Seconds 3
& "$scriptDir\start-servers.ps1"
