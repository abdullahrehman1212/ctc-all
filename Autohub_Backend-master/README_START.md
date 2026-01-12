# How to Start the Backend Server and Database

## Current Configuration
- Backend URL: `http://localhost:8001/api`
- Database: MySQL
- Database Name: `umjnrhjs_spareparts360`
- Database User: `root`
- Database Password: (empty)

## Steps to Start

### 1. Start MySQL Database

You need to have MySQL installed and running. Options:

**Option A: If you have MySQL installed as a Windows Service:**
```powershell
# Start MySQL service
Start-Service MySQL
# or
net start MySQL
```

**Option B: If you have XAMPP:**
- Open XAMPP Control Panel
- Click "Start" next to MySQL

**Option C: If you have WAMP:**
- Open WAMP
- Click on MySQL service to start it

**Option D: Install MySQL if not installed:**
- Download MySQL from https://dev.mysql.com/downloads/installer/
- Install MySQL Server
- Make sure the service starts automatically

### 2. Start Laravel Backend Server

**Option 1: Using the batch file (Recommended)**
Double-click `start-server.bat` in the `Autohub_Backend-master` folder

**Option 2: Using Command Line**
```powershell
cd "d:\CTC Mian Hub\Autohub_Backend-master"
php artisan serve --port=8001
```

You should see:
```
Starting Laravel development server: http://127.0.0.1:8001
```

### 3. Verify Backend is Running

Open your browser and go to: `http://localhost:8001/api`

Or test in PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:8001/api" -Method GET
```

### 4. Check Database Connection

Test if Laravel can connect to the database:
```powershell
cd "d:\CTC Mian Hub\Autohub_Backend-master"
php artisan migrate:status
```

## Troubleshooting

### If you get "could not find driver" error:
PHP PDO MySQL extension is not enabled. Check your `php.ini` file and uncomment:
```
extension=pdo_mysql
extension=mysqli
```

### If port 8001 is already in use:
Try a different port:
```powershell
php artisan serve --port=8002
```
Then update the frontend `src/baseURL/baseURL.js` to use the new port.

### If database connection fails:
1. Make sure MySQL is running
2. Verify database credentials in `.env` file
3. Make sure the database `umjnrhjs_spareparts360` exists
4. Create the database if it doesn't exist:
```sql
CREATE DATABASE umjnrhjs_spareparts360;
```

## Notes

- Keep the terminal/command window open while the server is running
- The server will stop when you close the terminal
- Frontend is configured to connect to `http://localhost:8001/api`
