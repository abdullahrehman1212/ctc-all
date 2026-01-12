# Start Laravel Backend Server
Set-Location -Path $PSScriptRoot
Write-Host "Starting Laravel Backend Server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

php artisan serve --port=8000 --host=127.0.0.1

Read-Host "Press Enter to exit"
