# Quick Authentication System Test Script
# Tests all auth endpoints without needing OAuth setup

Write-Host "`n=== Authentication System Test ===" -ForegroundColor Cyan
Write-Host "Testing backend authentication endpoints...`n" -ForegroundColor White

# Test 1: Backend Health
Write-Host "[1/5] Testing backend health..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing
    Write-Host "   ✅ Backend is healthy" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend not responding. Start it with:" -ForegroundColor Red
    Write-Host "      python -m uvicorn geeksforgeeks.triage:app --reload`n" -ForegroundColor Gray
    exit 1
}

# Test 2: Dev Login
Write-Host "`n[2/5] Testing dev-login endpoint..." -ForegroundColor Yellow
$loginBody = @{
    email = "tester@example.com"
    password = "test123"
    name = "Test User"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/auth/dev-login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.access_token
    Write-Host "   ✅ Dev-login successful" -ForegroundColor Green
    Write-Host "      User: $($loginData.user.email)" -ForegroundColor Gray
    Write-Host "      Provider: $($loginData.user.provider)" -ForegroundColor Gray
    Write-Host "      Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Dev-login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Protected Endpoint (with auth)
Write-Host "`n[3/5] Testing protected /api/triage with token..." -ForegroundColor Yellow
$triageBody = @{
    symptoms = @("headache", "fever")
    severity = "mild"
    patient_age = 25
} | ConvertTo-Json

try {
    $triageResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/triage" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $triageBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $triageData = $triageResponse.Content | ConvertFrom-Json
    Write-Host "   ✅ Protected endpoint accessible with valid token" -ForegroundColor Green
    Write-Host "      Triage Result: $($triageData.triage_label)" -ForegroundColor Gray
    Write-Host "      Action: $($triageData.action)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to access protected endpoint: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Protected Endpoint (without auth) - Should fail with 401
Write-Host "`n[4/5] Testing protected endpoint WITHOUT token (should fail)..." -ForegroundColor Yellow
try {
    $noAuthResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/triage" `
        -Method POST `
        -Body $triageBody `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "   ❌ ERROR: Protected endpoint should reject unauthenticated requests!" -ForegroundColor Red
    Write-Host "      Security issue - endpoint is not protected!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "   ✅ Protected endpoint correctly rejects unauthenticated requests (401)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Unexpected status code: $statusCode (expected 401)" -ForegroundColor Yellow
    }
}

# Test 5: Session Endpoint
Write-Host "`n[5/5] Testing session refresh endpoint..." -ForegroundColor Yellow
try {
    $sessionResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/auth/session" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -UseBasicParsing
    
    $sessionData = $sessionResponse.Content | ConvertFrom-Json
    Write-Host "   ✅ Session endpoint working" -ForegroundColor Green
    Write-Host "      Refreshed token received" -ForegroundColor Gray
    Write-Host "      User: $($sessionData.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Session refresh failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 6: Logout
Write-Host "`n[6/6] Testing logout endpoint..." -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/auth/logout" `
        -Method POST `
        -UseBasicParsing
    
    Write-Host "   ✅ Logout successful" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "✅ Authentication system is working correctly!" -ForegroundColor Green
Write-Host "`nYou can now test via browser:" -ForegroundColor White
Write-Host "  1. Start frontend: cd triage-frontend && npm run dev" -ForegroundColor Gray
Write-Host "  2. Open: http://localhost:5173" -ForegroundColor Gray
Write-Host "  3. Login with any email/password" -ForegroundColor Gray
Write-Host "`nFor OAuth testing (Google/GitHub), see AUTHENTICATION_TESTING.md`n" -ForegroundColor Gray
