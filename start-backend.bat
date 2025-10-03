@echo off
echo ========================================
echo   Starting Backend Server
echo ========================================
echo.
cd /d C:\Users\udayj\GeeksforGeeks
python -m uvicorn geeksforgeeks.triage:app --reload --port 8000
pause
