# Healthcare Triage Bot - Start Script
Write-Host "Starting Healthcare Triage Bot..." -ForegroundColor Green

# Ensure we're in the correct directory
Set-Location -Path $PSScriptRoot

# Start the server
Write-Host "Starting server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "" 
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow

python -m uvicorn triage:app --reload --port 8000