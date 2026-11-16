param([switch]$Android)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location (Join-Path $projectRoot 'mobile')
try {
  if (!(Test-Path -LiteralPath 'node_modules')) { & npm.cmd ci; if ($LASTEXITCODE -ne 0) { throw 'Instalação de dependências falhou.' } }
  if ($Android) { & npm.cmd run android } else { & npm.cmd run web }
} finally { Pop-Location }
