param([switch]$Test)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$portableJdk = Join-Path $projectRoot '.tools/jdk'
if (Test-Path -LiteralPath $portableJdk) { $env:JAVA_HOME = (Get-ChildItem -LiteralPath $portableJdk -Directory | Select-Object -First 1).FullName }
$portableMaven = Join-Path $projectRoot '.tools/maven/apache-maven-3.9.11/bin/mvn.cmd'
$mavenCommand = if (Test-Path -LiteralPath $portableMaven) { $portableMaven } else { 'mvn.cmd' }
Push-Location (Join-Path $projectRoot 'backend')
try {
  if ($Test) { & $mavenCommand -B verify } else { & $mavenCommand -B spring-boot:run }
  if ($LASTEXITCODE -ne 0) { throw 'Backend falhou. Confira JDK 21, Maven e mensagens acima.' }
} finally { Pop-Location }
