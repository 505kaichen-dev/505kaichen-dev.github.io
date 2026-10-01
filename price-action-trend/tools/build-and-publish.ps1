[CmdletBinding()]
param(
    [string]$Workbook,
    [string]$InternalRoot = "X:\price-action-trend",
    [string]$OfflineOutput = "X:\price-action-trend\offline\IBM_Power_Storage_Tape_調價趨勢_Offline.html",
    [string]$PythonExecutable,
    [string]$NodeExecutable
)

$ErrorActionPreference = "Stop"
$siteRoot = Split-Path -Parent $PSScriptRoot
$buildRoot = Join-Path $siteRoot ".build"
$plainData = Join-Path $buildRoot "data.js"
$buildVersion = Get-Date -Format "yyyyMMddHHmmss"
$releaseVersion = "ver" + (Get-Date -Format "yyyyMMdd")

function Resolve-Tool([string]$Explicit, [string]$CommandName, [string]$BundledPath) {
    if ($Explicit) { return (Resolve-Path -LiteralPath $Explicit).Path }
    if (Test-Path -LiteralPath $BundledPath) { return $BundledPath }
    $command = Get-Command $CommandName -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
    throw "找不到 $CommandName，請用參數指定執行檔。"
}

if (-not $Workbook) {
    $pattern = Join-Path $env:USERPROFILE "OneDrive*\Price Action\IBM_Power_Storage_Tape_調價趨勢指數_*.xlsx"
    $candidate = Get-ChildItem -Path $pattern -File -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
    if (-not $candidate) { throw "找不到主 Excel，請使用 -Workbook 指定路徑。" }
    $Workbook = $candidate.FullName
}

$python = Resolve-Tool $PythonExecutable "python" (Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe")
$node = Resolve-Tool $NodeExecutable "node" (Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe")

New-Item -ItemType Directory -Force -Path $buildRoot, $InternalRoot | Out-Null

& $python (Join-Path $PSScriptRoot "generate-data.py") --workbook $Workbook --output $plainData
if ($LASTEXITCODE -ne 0) { throw "Excel 資料產生失敗。" }

Copy-Item -LiteralPath (Join-Path $siteRoot "app.js") -Destination (Join-Path $InternalRoot "app.js") -Force
Copy-Item -LiteralPath (Join-Path $siteRoot "styles.css") -Destination (Join-Path $InternalRoot "styles.css") -Force
Copy-Item -LiteralPath $plainData -Destination (Join-Path $InternalRoot "data.js") -Force
Copy-Item -LiteralPath (Join-Path $siteRoot "MAINTENANCE.md") -Destination (Join-Path $InternalRoot "MAINTENANCE.md") -Force
Copy-Item -LiteralPath (Join-Path $siteRoot "RELEASE_NOTES.md") -Destination (Join-Path $InternalRoot "RELEASE_NOTES.md") -Force

$internalTemplate = Get-Content -LiteralPath (Join-Path $PSScriptRoot "templates\index-internal.html") -Raw
($internalTemplate.Replace("__BUILD_VERSION__", $buildVersion)).TrimEnd() |
    Set-Content -LiteralPath (Join-Path $InternalRoot "index.html") -Encoding UTF8

$publicIndexPath = Join-Path $siteRoot "index.html"
$publicAuthPath = Join-Path $siteRoot "auth.js"
((Get-Content -LiteralPath $publicIndexPath -Raw) -replace 'v=[0-9-]+', "v=$buildVersion" -replace 'ver[0-9]{8}', $releaseVersion).TrimEnd() |
    Set-Content -LiteralPath $publicIndexPath -Encoding UTF8
((Get-Content -LiteralPath $publicAuthPath -Raw) -replace 'v=[0-9-]+', "v=$buildVersion").TrimEnd() |
    Set-Content -LiteralPath $publicAuthPath -Encoding UTF8

$securePassword = Read-Host "請輸入 GitHub／離線版密碼" -AsSecureString
$passwordPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $env:PRICE_TREND_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPtr)
    & $node (Join-Path $PSScriptRoot "protect-data.mjs") $plainData (Join-Path $siteRoot "protected-data.json")
    if ($LASTEXITCODE -ne 0) { throw "加密資料產生失敗。" }

    & $node (Join-Path $PSScriptRoot "build-offline.mjs") `
        $publicIndexPath `
        (Join-Path $siteRoot "styles.css") `
        $publicAuthPath `
        (Join-Path $siteRoot "app.js") `
        (Join-Path $siteRoot "protected-data.json") `
        $OfflineOutput
    if ($LASTEXITCODE -ne 0) { throw "離線版產生失敗。" }
}
finally {
    Remove-Item Env:PRICE_TREND_PASSWORD -ErrorAction SilentlyContinue
    if ($passwordPtr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPtr)
    }
    Remove-Item -LiteralPath $plainData -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "完成："
Write-Host "  內網版：$InternalRoot"
Write-Host "  GitHub 待提交版：$siteRoot"
Write-Host "  單檔離線版：$OfflineOutput"
Write-Host "GitHub 不會自動 commit 或 push，請先檢查 git diff。"
