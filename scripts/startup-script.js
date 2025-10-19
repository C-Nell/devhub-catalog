#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os'); 
const path = require('path');
const projectDirectory = '/projects/devhub-catalog';

process.env.NODE_OPTIONS = '--no-node-snapshot';

// Get absolute path to your yarn file
const yarnPath = path.resolve(projectDirectory, '.yarn/releases/yarn-*.cjs');

// Determine which config file to use
const homeDir = os.homedir();
const isZsh = process.env.SHELL?.includes('zsh');
const configFile = isZsh ? path.join(homeDir, '.zshrc') : path.join(homeDir, '.bashrc');

// Create the alias line
const aliasLine = `alias yarn='node ${yarnPath}'`;

try {
  // Read existing content
  let content = '';
  if (fs.existsSync(configFile)) {
    content = fs.readFileSync(configFile, 'utf8');
  }

  // Check if alias already exists
  if (content.includes('alias yarn=')) {
    console.log('\n✔️  Yarn alias already exists');
  } else {
    // Append the alias
    fs.appendFileSync(configFile, `\n# Custom Yarn alias\n${aliasLine}\n`);
    console.log('\n✅  Alias added!');
    console.log(`✔️  Run: source ${configFile}`);
  }
} catch (error) {
  console.error('\n❌  Error:', error.message);
}

console.log('\n🔧 ========== Disabling Yarn Telemetry ==========\n')

try {
  execSync('node .yarn/releases/yarn-*.cjs config set --home enableTelemetry 0', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n✅  Yarn telemetry disabled');
} catch (err) {
  console.log('\n❌  Failed to disable Yarn telemetry', err);
}

console.log('\n📦 ========== Installing Dependencies ==========\n')

try {
  execSync('export npm_config_nodedir=/usr && node .yarn/releases/yarn-*.cjs install', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n✅  Dependencies installed');
} catch (err) {
  console.log('\n❌  Dependency installation failed', err);
}

// Run yarn tsc command
console.log('\n📝 ========== Type Checking ==========\n')

try {
  execSync('node .yarn/releases/yarn-*.cjs tsc', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n✅  Type checking passed');
} catch (err) {
  console.log('\n❌  Type checking failed', err);
}

// Generate a random token for BACKEND_AUTH_TOKEN
const backendToken = execSync('node -p \'require("crypto").randomBytes(24).toString("base64")\'', {
  encoding: 'utf8'
}).trim();

console.log('\n🔍 ========== Running Linter ==========\n')
try {
  execSync('node .yarn/releases/yarn-*.cjs lint', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n✅  Linting passed');
} catch (err) {
  console.log('\n❌  Linting failed - fix errors before committing', err);
}

// Path to backend index.ts
const backendIndexPath = path.join(projectDirectory, 'packages/backend/src/index.ts');

// Read the file
let backendIndex = fs.readFileSync(backendIndexPath, 'utf8');

console.log('\n⚙️  ========== Configuring Backend ==========\n');

// // Add dotenv import and config if not already present
// if (!backendIndex.includes("import dotenv from 'dotenv'")) {
//   const dotenvCode = "import dotenv from 'dotenv';\ndotenv.config({ path: '../../.env' });\n\n";
//   backendIndex = dotenvCode + backendIndex;
//   fs.writeFileSync(backendIndexPath, backendIndex);
//   console.log('✔️  Added dotenv import and config to backend/src/index.ts');
// } else {
//   console.log('✔️  Dotenv already configured');
// }

if (fs.existsSync('.env')) {
  console.log('\n✔️  .env file exists, skipping setup...');
} else {
  console.log('\n🔐 ========== Setting Up Environment Variables ==========\n');
  console.log('📄  Creating .env file...');
  fs.copyFileSync(path.join(projectDirectory, 'sample-env'), path.join(projectDirectory, '.env'));

  const backendUrl = execSync('oc get routes | grep 7007 | awk \'{print "https://" $2}\'')
    .toString().trim();

  // Read the .env file
  let envContent = fs.readFileSync(path.join(projectDirectory, '.env'), 'utf8');

  // Get GitHub token from Kubernetes secret
  const githubToken = execSync(
    `kubectl get secrets -o json | jq -r '.items[] | select(.metadata.name | test("personal-access-token")) | .data.token' | head -n1 | base64 -d`,
    { encoding: "utf-8" }
  ).trim();

  // Replace .env values
  envContent = envContent.replace('"PLACEHOLDER_GITHUB_TOKEN"', githubToken);
  envContent = envContent.replace('"PLACEHOLDER_BACKEND_URL"', backendUrl);
  envContent = envContent.replace('"PLACEHOLDER_BACKEND_AUTH_TOKEN"', backendToken);

  console.log('\nℹ️  Environment variables configured:');
  console.log('  🔑  GitHub Token: ✓');
  console.log('  🌐  Backend URL:', backendUrl);
  console.log('  🔐  Auth Token: ✓');

  // Write back to .env file
  fs.writeFileSync(path.join(projectDirectory, '.env'), envContent);
  console.log('\n✅  .env file configured');
}

console.log('\n🏗️  ========== Building Application ==========\n')
try {
  execSync('node .yarn/releases/yarn-*.cjs build:all', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n✅  Build complete');
} catch (err) {
  console.log('\n❌  Build failed', err);
}

// Start backstage
console.log('\n🚀 ========== Starting Backstage Application ==========\n')
execSync('node .yarn/releases/yarn-*.cjs workspace backend start', { stdio: 'inherit', cwd: projectDirectory, shell: true });
