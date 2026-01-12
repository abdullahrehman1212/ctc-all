@echo off
cd /d "%~dp0"
echo Starting Laravel Backend Server on port 8001...
php artisan serve --port=8001 --host=127.0.0.1
pause
