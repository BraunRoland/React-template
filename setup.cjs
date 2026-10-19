const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Package name: ', (appName) => {
  
  const pkgPath = './package.json';
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.name = appName.toLowerCase().replace(/\s+/g, '-');
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  const indexPath = './index.html';
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(/__APP_NAME__/g, appName.toLowerCase().replace(/\s+/g, '-'));
    fs.writeFileSync(indexPath, html);
  }

  console.log('\ndownloading...');
  execSync('npm install', { stdio: 'inherit' });
  if (fs.existsSync('.git')) {
    fs.rmSync('.git', { recursive: true, force: true });
  }
  execSync('git init', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "létrehozva"', { stdio: 'inherit' });

  fs.unlinkSync(__filename);

  try {
    execSync('code .', { stdio: 'inherit' });
  } catch (e) {
    console.log(' (A parancs nem futott le, de a projekt kész!)');
  }

  rl.close();
});