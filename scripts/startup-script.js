#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const projectDirectory = '/projects/devhub-catalog';

process.env.NODE_OPTIONS = '--no-node-snapshot';

// Run yarn install and use system headers
console.log('\n========== Running yarn install ==========\n')
try {
  execSync('node .yarn/releases/yarn-*.cjs config set --home enableTelemetry 0', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n Yarn telemetry disabled.\n');
} catch (err) {
  console.log('\n Failed to disable Yarn telemetry', err);
}

try {
  execSync('export npm_config_nodedir=/usr && node .yarn/releases/yarn-*.cjs install', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n Yarn install complete.\n');
} catch (err) {
  console.log('\n Yarn install Failed', err);
}

// Run yarn tsc command
console.log('\n========== Running yarn tsc command ==========\n')

try {
  execSync('node .yarn/releases/yarn-*.cjs tsc', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n Yarn compilation successful.\n');
} catch (err) {
  console.log('\n Yarn compilation failed', err);
}
// Generate a random token for BACKEND_AUTH_TOKEN
const backendToken = execSync('node -p \'require("crypto").randomBytes(24).toString("base64")\'', {
  encoding: 'utf8'
}).trim();

 // Run yarn install and use system headers
console.log('\n========== Running yarn lint command ==========\n')
 try {
  execSync('node .yarn/releases/yarn-*.cjs lint', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n Linting passed.\n');
} catch (err) {
  console.log('\n Linting failed - fix errors before committing.', err);
}

// Path to backend index.ts
const backendIndexPath = path.join(projectDirectory, 'packages/backend/src/index.ts');

// Read the file
let backendIndex = fs.readFileSync(backendIndexPath, 'utf8');

// Add dotenv import and config if not already present
if (!backendIndex.includes("import dotenv from 'dotenv'")) {
  const dotenvCode = "import dotenv from 'dotenv';\ndotenv.config({ path: '../../.env' });\n\n";
  backendIndex = dotenvCode + backendIndex;
  fs.writeFileSync(backendIndexPath, backendIndex);
  console.log('Added dotenv import and config to backend/src/index.ts');
}

if (fs.existsSync('.env')) {
  console.log('\nThe .env file exists, skipping copy...')
} else {
  console.log('\n The .env file does not exist, copying file...');
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

  console.log('Github Token:', githubToken);
  console.log('Backend Url:', backendUrl);
  console.log('Backend Auth Token:', backendToken);

  // Write back to .env file
fs.writeFileSync(path.join(projectDirectory, '.env'), envContent);
}

 // Run frontend & backend build
 console.log('\n========== Running yarn build command ==========\n')
 try {
  execSync('node .yarn/releases/yarn-*.cjs build:all', { stdio: 'inherit', cwd: projectDirectory, shell: true });
  console.log('\n Yarn build complete.\n');
} catch (err) {
  console.log('\n Yarn build failed', err);
}

// Start backstage
console.log('\n========== Running Backstage application ==========\n')
execSync('node .yarn/releases/yarn-*.cjs workspace backend start', { stdio: 'inherit', cwd: projectDirectory, shell: true });
