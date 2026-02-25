# Install Node (if missing) + npm install + npm run dev
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$nodePaths = @(
    "C:\Program Files\nodejs\npm.cmd",
    "C:\Program Files (x86)\nodejs\npm.cmd",
    "$env:LOCALAPPDATA\Programs\node\npm.cmd"
)

$npm = $null
try { $npm = (Get-Command npm -ErrorAction Stop).Source } catch {}
if (-not $npm) {
    foreach ($n in $nodePaths) {
        if (Test-Path $n) { $npm = $n; break }
    }
}

if (-not $npm) {
    Write-Host "Node.js not found. Installing via winget..."
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    $npm = "C:\Program Files\nodejs\npm.cmd"
    if (-not (Test-Path $npm)) {
        Write-Host "Install done. Close this window, open a new one, run this script again."
        Read-Host "Press Enter"
        exit 1
    }
    # Prepend Node to PATH so npm and postinstall scripts find node
    $env:Path = "C:\Program Files\nodejs;" + $env:Path
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Running npm install..."
    & $npm install
    if ($LASTEXITCODE -ne 0) { Read-Host "npm install failed. Press Enter"; exit 1 }
}

Write-Host "Starting dev server at http://localhost:3002 (Ctrl+C to stop)"
& $npm run dev
Read-Host "Press Enter to close"
