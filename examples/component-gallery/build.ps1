# Assembles the course from parts — PowerShell equivalent of build.sh for Windows.
# Run from anywhere:  powershell -NoProfile -ExecutionPolicy Bypass -File build.ps1
# Works with Windows PowerShell 5.1 and PowerShell 7+.
$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path

$parts = @(Join-Path $dir '_base.html')
$parts += Get-ChildItem -Path (Join-Path $dir 'modules') -Filter '*.html' |
  Where-Object { $_.Extension -eq '.html' } |
  Sort-Object Name |
  ForEach-Object { $_.FullName }
$parts += Join-Path $dir '_footer.html'

# Byte-for-byte the same result as `cat`: read and write UTF-8 without a BOM.
$sb = New-Object System.Text.StringBuilder
foreach ($p in $parts) { [void]$sb.Append([System.IO.File]::ReadAllText($p)) }
[System.IO.File]::WriteAllText((Join-Path $dir 'index.html'), $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))

Write-Host 'Built index.html - open it in your browser.'
