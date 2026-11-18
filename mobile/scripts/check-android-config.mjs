import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const cli=fileURLToPath(new URL('../node_modules/expo/bin/cli',import.meta.url));
const configuration=JSON.parse(execFileSync(process.execPath,[cli,'config','--type','introspect','--json'],{
  cwd:root,encoding:'utf8',timeout:60000,maxBuffer:10*1024*1024,
}));
const application=configuration._internal?.modResults?.android?.manifest?.manifest?.application?.[0]?.$;
assert.ok(application,'O plugin deve gerar o manifesto Android.');
assert.equal(application['android:usesCleartextTraffic'],'true','A demonstração local precisa permitir sua API HTTP.');
assert.equal(application['android:allowBackup'],'false','O identificador local não deve entrar no backup automático do Android.');
assert.equal(configuration.userInterfaceStyle,'light');
const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
for(const dependency of ['expo-font','expo-system-ui','expo-build-properties'])assert.ok(pkg.dependencies[dependency],`${dependency} deve ser uma dependência direta.`);
mkdirSync(new URL('../verification-results/',import.meta.url),{recursive:true});
writeFileSync(new URL('../verification-results/android-config.json',import.meta.url),JSON.stringify({
  manifestVerified:true,usesCleartextTraffic:application['android:usesCleartextTraffic'],allowBackup:application['android:allowBackup'],
  userInterfaceStyle:configuration.userInterfaceStyle,nativeExecutionVerified:false,
},null,2));
console.log('Configuração Android verificada por introspecção. Não substitui execução em aparelho.');
