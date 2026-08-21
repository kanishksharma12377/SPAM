# SPAM Project - Start Script
# This script starts both Frontend and Backend servers concurrently

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  SPAM - Student Portfolio System   " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if node is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "[INFO] Starting Backend Server..." -ForegroundColor Green
Write-Host "[INFO] Starting Frontend Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start Backend Server
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\SPAM_Backend
    npm run dev 2>&1
}

# Start Frontend Server
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\Frontend
    npm run dev 2>&1
}

# Display output from both jobs
try {
    while ($true) {
        # Get backend output
        $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
        if ($backendOutput) {
            $backendOutput | ForEach-Object {
                Write-Host "[BACKEND] $_" -ForegroundColor Magenta
            }
        }

        # Get frontend output
        $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            $frontendOutput | ForEach-Object {
                Write-Host "[FRONTEND] $_" -ForegroundColor Blue
            }
        }

        # Check if jobs are still running
        if (($backendJob.State -eq "Completed" -or $backendJob.State -eq "Failed") -and 
            ($frontendJob.State -eq "Completed" -or $frontendJob.State -eq "Failed")) {
            break
        }

        Start-Sleep -Milliseconds 100
    }
}
finally {
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Green
}
