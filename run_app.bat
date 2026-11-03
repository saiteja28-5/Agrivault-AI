@echo off
echo ========================================================
echo       AGRIVAULT AI - GRAIN INTELLIGENCE PLATFORM
echo   Smart Grain Storage and Post-Harvest Loss Prevention
echo ========================================================
echo.
echo Starting Agrivault AI Frontend and Backend Services...
echo.

start "Agrivault Backend (FastAPI)" cmd /k "python -m uvicorn backend.main:app --reload --port 8000"
timeout /t 2 /nobreak > nul
start "Agrivault Frontend (Vite + React)" cmd /k "cd frontend && npm run dev"

echo Services started successfully!
echo.
echo - Web Dashboard:  http://localhost:5173
echo - REST API Docs:  http://localhost:8000/docs
echo.
echo Press any key to exit this launcher window...
pause > nul

