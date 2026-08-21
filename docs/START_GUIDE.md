# SPAM Project - Start Guide

## Quick Start Options

### Option 1: Using Batch File (Recommended for Windows)
Simply double-click `start.bat` or run in command prompt:
```cmd
start.bat
```
This will open two separate windows - one for backend, one for frontend.

### Option 2: Using PowerShell Script
Run in PowerShell:
```powershell
.\start.ps1
```
This runs both servers in the same window with colored output.

### Option 3: Using NPM Scripts
First, install concurrently (one-time setup):
```bash
npm install
```

Then start both servers:
```bash
npm start
```

Or start individually:
```bash
npm run start:backend   # Backend only
npm run start:frontend  # Frontend only
```

## Installation

If this is your first time, install all dependencies:
```bash
npm run install:all
```

Or manually:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd SPAM_Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

## Default URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000 (or as configured in .env)

## Environment Setup

Make sure you have a `.env` file in the `SPAM_Backend` folder with:
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Stopping Servers

- **start.bat**: Close the individual command windows
- **start.ps1**: Press `Ctrl+C` in PowerShell
- **npm start**: Press `Ctrl+C` in terminal
