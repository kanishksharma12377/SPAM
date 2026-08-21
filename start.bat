@echo off
REM SPAM Project - Start Script for Windows
REM This batch file starts both Frontend and Backend servers

echo =====================================
echo   SPAM - Student Portfolio System   
echo =====================================
echo.

echo [INFO] Starting Backend and Frontend servers...
echo Press Ctrl+C to stop all servers
echo.

REM Start Backend in a new window
start "SPAM Backend" cmd /k "cd SPAM_Backend && npm run dev"

REM Wait a moment before starting frontend
timeout /t 2 /nobreak >nul

REM Start Frontend in a new window
start "SPAM Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Close the windows or press Ctrl+C in each window to stop the servers.
echo.
pause
