$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$toolsPath = Join-Path $projectRoot '.tools'
New-Item -ItemType Directory -Force $toolsPath | Out-Null
Write-Host 'Baixando ferramentas oficiais para a pasta .tools (sem alterar o sistema)...'
$assets = Invoke-RestMethod 'https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=windows&vendor=eclipse'
$jdkPackage = $assets[0].binary.package
$jdkZip = Join-Path $toolsPath 'jdk.zip'
Invoke-WebRequest $jdkPackage.link -OutFile $jdkZip
if ((Get-FileHash $jdkZip -Algorithm SHA256).Hash.ToLowerInvariant() -ne $jdkPackage.checksum.ToLowerInvariant()) { throw 'Checksum do JDK inválido.' }
Expand-Archive -LiteralPath $jdkZip -DestinationPath (Join-Path $toolsPath 'jdk') -Force
$mavenUrl = 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.11/apache-maven-3.9.11-bin.zip'
$mavenZip = Join-Path $toolsPath 'maven.zip'
Invoke-WebRequest $mavenUrl -OutFile $mavenZip
$expectedMavenHash = (Invoke-RestMethod "$mavenUrl.sha512").Trim().Split(' ')[0]
if ((Get-FileHash $mavenZip -Algorithm SHA512).Hash.ToLowerInvariant() -ne $expectedMavenHash.ToLowerInvariant()) { throw 'Checksum do Maven inválido.' }
Expand-Archive -LiteralPath $mavenZip -DestinationPath (Join-Path $toolsPath 'maven') -Force
Write-Host 'JDK 21 e Maven prontos. Node.js 24 deve estar instalado separadamente.'
