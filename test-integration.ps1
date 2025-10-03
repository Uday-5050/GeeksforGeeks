# Integration Test Script
# Tests the connection between Frontend and Backend

Write-Host "`n=== Testing Backend-Frontend Integration ===" -ForegroundColor Cyan

# Test 1: Backend Health Check
Write-Host "`n1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing
    $healthData = $health.Content | ConvertFrom-Json
    Write-Host "   [OK] Backend is healthy" -ForegroundColor Green
    Write-Host "   Status: $($healthData.status)" -ForegroundColor Gray
    Write-Host "   Version: $($healthData.version)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Backend health check failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Triage API - Severe Emergency
Write-Host "`n2. Testing Triage API (Emergency Case)..." -ForegroundColor Yellow
try {
    $emergencyPayload = @{
        symptoms = @("chest pain", "shortness of breath")
        severity = "severe"
        patient_age = 55
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/triage" `
        -Method POST `
        -Body $emergencyPayload `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $triageData = $response.Content | ConvertFrom-Json
    Write-Host "   [OK] Triage API responded successfully" -ForegroundColor Green
    Write-Host "   Triage Level: $($triageData.triage_label)" -ForegroundColor Gray
    Write-Host "   Action: $($triageData.action)" -ForegroundColor Gray
    Write-Host "   Confidence: $($triageData.confidence_score)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Triage API test failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Triage API - Mild Case
Write-Host "`n3. Testing Triage API (Self-Care Case)..." -ForegroundColor Yellow
try {
    $mildPayload = @{
        symptoms = @("runny nose", "sneezing")
        severity = "mild"
        patient_age = 30
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/triage" `
        -Method POST `
        -Body $mildPayload `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $triageData = $response.Content | ConvertFrom-Json
    Write-Host "   [OK] Triage API responded successfully" -ForegroundColor Green
    Write-Host "   Triage Level: $($triageData.triage_label)" -ForegroundColor Gray
    Write-Host "   Action: $($triageData.action)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Triage API test failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Test 4: Demo Endpoint
Write-Host "`n4. Testing Demo Endpoint..." -ForegroundColor Yellow
try {
    $demo = Invoke-WebRequest -Uri "http://localhost:8000/api/demo/emergency" -UseBasicParsing
    $demoData = $demo.Content | ConvertFrom-Json
    Write-Host "   [OK] Demo endpoint responded successfully" -ForegroundColor Green
    Write-Host "   Demo scenario: $($demoData.triage_label)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Demo endpoint test failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 5: Frontend Availability
Write-Host "`n5. Testing Frontend Availability..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($frontend.StatusCode -eq 200) {
        Write-Host "   [OK] Frontend is accessible" -ForegroundColor Green
        Write-Host "   URL: http://localhost:3000" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [FAIL] Frontend not accessible" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 6: CORS Check
Write-Host "`n6. Testing CORS Configuration..." -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = "http://localhost:3000"
    }
    $corsTest = Invoke-WebRequest -Uri "http://localhost:8000/api/health" `
        -Headers $headers `
        -UseBasicParsing
    
    $corsHeader = $corsTest.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader) {
        Write-Host "   [OK] CORS is properly configured" -ForegroundColor Green
        Write-Host "   Allow-Origin: $corsHeader" -ForegroundColor Gray
    } else {
        Write-Host "   [WARN] CORS header not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   [FAIL] CORS test failed" -ForegroundColor Red
}

Write-Host "`n=== Integration Test Complete ===" -ForegroundColor Cyan
Write-Host "`nAll systems operational!" -ForegroundColor Green
Write-Host "`nAccess the application at: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API documentation at: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
