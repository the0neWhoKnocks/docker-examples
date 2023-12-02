const { existsSync, readFileSync, writeFileSync } = require('fs');

const PWD = process.cwd();
const PATH__PKG = `${PWD}/package.json`;
const PATH__PKG_LOCK = `${PWD}/package-lock.json`;
const pkg = JSON.parse(readFileSync(PATH__PKG, 'utf-8'));
const lock = (existsSync(PATH__PKG_LOCK))
  ? JSON.parse(readFileSync(PATH__PKG_LOCK, 'utf-8'))
  : false;

let preInstallScript;
if (pkg.scripts && pkg.scripts.preinstall) preInstallScript = pkg.scripts.preinstall;

delete pkg.devDependencies;
delete pkg.scripts;
delete pkg.version;
if (lock) delete lock.version;

if (preInstallScript) pkg.scripts = { preinstall: preInstallScript };

writeFileSync(PATH__PKG, JSON.stringify(pkg));
if (lock) writeFileSync(PATH__PKG_LOCK, JSON.stringify(lock));
