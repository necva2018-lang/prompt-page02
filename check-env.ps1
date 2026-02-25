# 本地測試環境檢查腳本
# 在專案目錄執行: .\check-env.ps1

$ErrorActionPreference = "Stop"
$ok = 0
$fail = 0

Write-Host "=== Prompt 圖書館 環境檢查 ===" -ForegroundColor Cyan
Write-Host ""

# 1. Node
try {
  $nodeVer = node -v 2>$null
  if ($nodeVer) { Write-Host "[OK] Node: $nodeVer"; $ok++ } else { throw "not found" }
} catch {
  Write-Host "[X] Node 未安裝或不在 PATH" -ForegroundColor Red
  $fail++
}

# 2. npm
try {
  $npmVer = npm -v 2>$null
  if ($npmVer) { Write-Host "[OK] npm: $npmVer"; $ok++ } else { throw "not found" }
} catch {
  Write-Host "[X] npm 未找到（請確認 Node 已安裝）" -ForegroundColor Red
  $fail++
}

# 3. node_modules
if (Test-Path "node_modules") {
  Write-Host "[OK] node_modules 存在"
  $ok++
} else {
  Write-Host "[X] node_modules 不存在，請執行: npm install" -ForegroundColor Red
  $fail++
}

# 4. 必要檔案
$files = @("package.json", "src\app\page.tsx", "src\lib\storage.ts", "next.config.ts")
foreach ($f in $files) {
  if (Test-Path $f) { Write-Host "[OK] $f"; $ok++ } else { Write-Host "[X] 缺少 $f" -ForegroundColor Red; $fail++ }
}

Write-Host ""
if ($fail -eq 0) {
  Write-Host "建議執行: npm run dev  然後開啟 http://localhost:3002" -ForegroundColor Green
} else {
  Write-Host "請先解決上述 [X] 項目後再執行 npm run dev" -ForegroundColor Yellow
}
