#!/usr/bin/env node

console.log('=== Running Node.js startup script ===');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const projectDirectory = '/projects/devhub-devspace';

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

// Copy sample-env to .env file
fs.copyFileSync(path.join(projectDirectory, 'sample-env'), path.join(projectDirectory, '.env'));

// Get routes
const frontendUrl = execSync('oc get routes | grep 3000 | awk \'{print "https://" $2}\'')
  .toString().trim();

const backendUrl = execSync('oc get routes | grep 7007 | awk \'{print "https://" $2}\'')
  .toString().trim();

console.log('Frontend URL:', frontendUrl);
console.log('Backend URL:', backendUrl);

// Read the .env file
let envContent = fs.readFileSync(path.join(projectDirectory, '.env'), 'utf8');
console.log(envContent);

// Replace values
envContent = envContent.replace('"PLACEHOLDER_FRONTEND_URL"', frontendUrl);
envContent = envContent.replace('"PLACEHOLDER_BACKEND_URL"', backendUrl);

process.env.NODE_OPTIONS = '--no-node-snapshot';

// Write back to .env file
fs.writeFileSync(path.join(projectDirectory, '.env'), envContent);

// Add dotenv to project
execSync('node .yarn/releases/yarn-*.cjs add dotenv', { stdio: 'inherit', cwd: projectDirectory, shell: true });

// Run yarn install
execSync('node .yarn/releases/yarn-*.cjs install', { stdio: 'inherit', cwd: projectDirectory, shell: true });

// Run frontend & backend build
execSync('node .yarn/releases/yarn-*.cjs build:all', { stdio: 'inherit', cwd: projectDirectory, shell: true });

// Start backstage
execSync('node .yarn/releases/yarn-*.cjs workspace backend start', { stdio: 'inherit', cwd: projectDirectory, shell: true });
