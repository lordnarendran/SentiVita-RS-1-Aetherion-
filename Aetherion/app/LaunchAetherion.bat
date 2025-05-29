@echo off
setlocal enabledelayedexpansion

:: Configuration
set "FRONTEND_PATH=D:\Aetherion\app"
set "BACKEND_PATH=D:\gguf-api"
set "NGROK_PATH=D:\SentiVita Backup\SentiVita Web App\ngrok.exe"
set "SCRIPT_FILE=%FRONTEND_PATH%\script.js"

:: 1. Start backend
echo Starting backend server...
cd /d "%BACKEND_PATH%"
start cmd /k "venv\Scripts\activate && python Backend.py"
timeout /t 60 >nul

:: 2. Start ngrok
echo Starting ngrok tunnel...
"%NGROK_PATH%" config add-authtoken 2tlyUlyMrR7SmwEOt0tA1eock46_3s7Gn5Dj7if8JYgyRZ57T
start "" "%NGROK_PATH%" http 5000
timeout /t 5 >nul

:: 3. Get ngrok URL manually
:get_url
set "ngrok_url="
echo.
echo #################################################
echo # PLEASE MANUALLY COPY YOUR NGROK URL FROM HERE #
echo #################################################
curl -s http://localhost:4040/api/tunnels | python -c "import sys,json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])"
echo #################################################
echo.
set /p "ngrok_url=Please COPY and PASTE the ngrok URL shown above: "

:: Verify URL
if "!ngrok_url!"=="" (
    echo ERROR: No URL entered
    timeout /t 2
    goto get_url
)

echo !ngrok_url! | findstr /r "https://.*\.ngrok-free\.app" >nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Invalid URL format. Must be like: https://abcd-1234.ngrok-free.app
    timeout /t 3
    goto get_url
)

:: Remove trailing slash if present
if "!ngrok_url:~-1!"=="/" set "ngrok_url=!ngrok_url:~0,-1!"

:: 4. Show confirmation
echo.
echo YOU ARE ABOUT TO REPLACE ALL API URLs WITH:
echo !ngrok_url!
echo.
pause

:: 5. Update script.js - ENHANCED REPLACEMENT
cd /d "%FRONTEND_PATH%"

:: Create backup
set "backup_file=script_backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%.js"
copy "%SCRIPT_FILE%" "%backup_file%" >nul
echo Created backup: %backup_file%

:: Enhanced replacement that handles all URL formats
powershell -Command "$content = Get-Content '%SCRIPT_FILE%' -Raw; $content = $content -replace 'https?://[a-f0-9\-]+\.ngrok-free\.app', '%ngrok_url%'; Set-Content '%SCRIPT_FILE%' -Value $content"

:: 6. VERIFICATION WITH IMPROVED CHECKING
echo.
echo VERIFYING CHANGES...
echo Checking for ALL API endpoints...

:: Check both with and without trailing slashes
set "check_url=!ngrok_url!"
if "!check_url:~-1!"=="/" set "check_url=!check_url:~0,-1!"

for %%A in (
    "infer"
    "limb_reconstruction"
    "visualize"
    "predict"
    "register_face"
    "authenticate_face"
) do (
    findstr /i /c:"!check_url!/api/%%~A" "%SCRIPT_FILE%" >nul
    if !errorlevel! equ 0 (
        echo /api/%%~A - OK
    ) else (
        echo /api/%%~A - NOT UPDATED
        echo Checking for alternative patterns...
        findstr /i /c:"api/%%~A" "%SCRIPT_FILE%"
    )
)

:: 7. Launch frontend
start "" "%FRONTEND_PATH%\index.html"
echo Frontend launched with updated URLs
pause
