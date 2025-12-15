# Student Management System - Setup and Run Script
# PowerShell script for Windows

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "    STUDENT MANAGEMENT SYSTEM - DevOps Final Exam Project" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if Docker is running
function Test-Docker {
    try {
        docker ps | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Check Docker
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (-not (Test-Docker)) {
    Write-Host "❌ Docker is not running or not installed!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green

# Display menu
Write-Host ""
Write-Host "What would you like to do?" -ForegroundColor Cyan
Write-Host "1. Start Application (Docker Compose)" -ForegroundColor White
Write-Host "2. Stop Application" -ForegroundColor White
Write-Host "3. View Logs" -ForegroundColor White
Write-Host "4. Restart Application" -ForegroundColor White
Write-Host "5. Clean Everything (Remove containers and volumes)" -ForegroundColor White
Write-Host "6. Build Images" -ForegroundColor White
Write-Host "7. Check Status" -ForegroundColor White
Write-Host "8. Run Selenium Tests" -ForegroundColor White
Write-Host "9. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-9)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting Student Management System..." -ForegroundColor Green
        docker-compose up -d
        Write-Host ""
        Write-Host "✅ Application started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access the application at:" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:80" -ForegroundColor Yellow
        Write-Host "  Backend API: http://localhost:5000" -ForegroundColor Yellow
        Write-Host "  MongoDB: localhost:27017" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Gray
    }
    "2" {
        Write-Host ""
        Write-Host "🛑 Stopping application..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Application stopped" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "📋 Showing logs (Press Ctrl+C to exit)..." -ForegroundColor Yellow
        docker-compose logs -f
    }
    "4" {
        Write-Host ""
        Write-Host "🔄 Restarting application..." -ForegroundColor Yellow
        docker-compose restart
        Write-Host "✅ Application restarted" -ForegroundColor Green
    }
    "5" {
        Write-Host ""
        Write-Host "🗑️  Removing all containers and volumes..." -ForegroundColor Red
        $confirm = Read-Host "Are you sure? This will delete all data! (yes/no)"
        if ($confirm -eq "yes") {
            docker-compose down -v
            Write-Host "✅ Everything cleaned" -ForegroundColor Green
        } else {
            Write-Host "Cancelled" -ForegroundColor Yellow
        }
    }
    "6" {
        Write-Host ""
        Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
        docker-compose build --no-cache
        Write-Host "✅ Images built successfully" -ForegroundColor Green
    }
    "7" {
        Write-Host ""
        Write-Host "📊 Container Status:" -ForegroundColor Cyan
        docker-compose ps
        Write-Host ""
        Write-Host "💾 Docker Images:" -ForegroundColor Cyan
        docker images | Select-String "student"
    }
    "8" {
        Write-Host ""
        Write-Host "🧪 Running Selenium Tests..." -ForegroundColor Yellow
        Write-Host "Make sure the application is running first!" -ForegroundColor Yellow
        Write-Host ""
        Set-Location selenium-tests
        if (Test-Path "node_modules") {
            npm test
        } else {
            Write-Host "Installing dependencies first..." -ForegroundColor Yellow
            npm install
            npm test
        }
        Set-Location ..
    }
    "9" {
        Write-Host ""
        Write-Host "👋 Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
