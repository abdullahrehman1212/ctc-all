@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo Starting Laravel Backend Server
echo ========================================
echo.
php artisan serve --port=8000 --host=127.0.0.1
pause
