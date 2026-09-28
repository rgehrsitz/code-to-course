# Rebuilds the gallery from the current references/ kit so design changes can be previewed.
# PowerShell equivalent of preview.sh:  powershell -NoProfile -ExecutionPolicy Bypass -File preview.ps1
$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$refs = Join-Path (Split-Path -Parent (Split-Path -Parent $dir)) 'references'
foreach ($f in 'styles.css', 'main.js', '_footer.html', 'build.sh', 'build.ps1') {
  Copy-Item -Path (Join-Path $refs $f) -Destination $dir -Force
}
& (Join-Path $dir 'build.ps1')
