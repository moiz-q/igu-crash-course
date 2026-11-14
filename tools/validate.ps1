# Build the content, then run the headless validator.
# Usage (from the project folder):  powershell -File tools\validate.ps1 [-Only c,db]
param([string]$Only = "")
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
python tools\build.py
$chrome = @("C:\Program Files\Google\Chrome\Application\chrome.exe", "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { Write-Output "No Chrome/Edge found; skipped the headless validator."; exit 0 }
$prof = Join-Path $env:TEMP ("cc-val-" + [guid]::NewGuid().ToString("N"))
$url = "file:///" + ($root -replace '\\', '/' -replace ' ', '%20') + "/tools/validate.html"
if ($Only) { $url += "?only=$Only" }
$dom = & $chrome --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files --user-data-dir="$prof" --virtual-time-budget=180000 --dump-dom $url 2>$null | Out-String
Remove-Item -Recurse -Force $prof -ErrorAction SilentlyContinue
if ($dom -match '(?s)<pre id="o">(.*?)</pre>') { Write-Output "`n--- validator ---"; Write-Output ([System.Net.WebUtility]::HtmlDecode($Matches[1])) } else { Write-Output "Validator produced no output." }
