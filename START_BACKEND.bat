@echo off
title Laravel Backend Server - Port 8000
color 0A
echo.
echo ========================================
echo   Starting Laravel Backend Server
echo   URL: http://localhost:8000/api
echo ========================================
echo.
echo Keep this window open while using the app!
echo Press Ctrl+C to stop the server
echo.
cd /d "d:\CTC Mian Hub\Autohub_Backend-master"
php artisan serve --port=8000 --host=127.0.0.1
pause
