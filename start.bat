@echo off
echo Starting flipboard + plane tracker...

start /B python server.py
timeout /t 1 /nobreak > nul

echo Server running at http://localhost:8080
echo Tracking planes every 15s. Press Ctrl+C to stop.

:loop
python nearest_plane.py
timeout /t 15 /nobreak > nul
goto loop
