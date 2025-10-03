@echo off

REM Healthcare Triage Bot - Quick Run Script for Windows

echo 🏥 Starting Healthcare Triage Bot...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or later.
    pause
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip is not installed. Please install pip.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Set default environment variables if not set
if "%PORT%"=="" set PORT=8000
if "%HOST%"=="" set HOST=0.0.0.0

REM Optional: Check for OpenAI API key
if defined OPENAI_API_KEY (
    echo 🤖 OpenAI API key detected - enhanced explanations will be available
) else (
    echo ℹ️  No OpenAI API key set - using template explanations ^(set OPENAI_API_KEY for AI-generated explanations^)
)

echo.
echo 🚀 Starting server on http://%HOST%:%PORT%
echo 📖 API Documentation: http://%HOST%:%PORT%/docs
echo 🔍 Health Check: http://%HOST%:%PORT%/api/health
echo.
echo Demo endpoints:
echo   - GET  /api/demo - List demo scenarios
echo   - GET  /api/demo/{id} - Get demo payload  
echo   - POST /api/triage - Main triage endpoint
echo.
echo Press Ctrl+C to stop the server
echo ==========================
echo.

REM Start the server
uvicorn triage:app --host %HOST% --port %PORT% --reload

pause