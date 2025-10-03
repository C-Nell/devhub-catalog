#!/usr/bin/env node

console.log('=== Running Node.js startup script ===');

const { execSync } = require('child_process');
const fs = require('fs');
const projectDirectory = '/projects/devhub-devspace'

// Copy sample-env to .env file
fs.copyFileSync('sample-env', '.env');

// Get routes
const frontendUrl = execSync('oc get routes | grep 3000 | awk \'{print "https://" $2}\'')
  .toString().trim();

const backendUrl = execSync('oc get routes | grep 7007 | awk \'{print "https://" $2}\'')
.toString().trim();
console.log('Frontend URL:', frontendUrl);
console.log('Backend URL:', backendUrl);

// Read the .env file
let envContent = fs.readFileSync('.env', 'utf8');
console.log(envContent)

// Replace values
envContent = envContent.replace('"PLACEHOLDER_FRONTEND_URL"', frontendUrl);
envContent = envContent.replace('"PLACEHOLDER_BACKEND_URL"', backendUrl);

// Write back to .env file
fs.writeFileSync('.env', envContent);

// Run yarn install
execSync('node .yarn/releases/yarn-*.cjs install', { stdio: 'inherit', cwd: projectDirectory });

// Run frontend & backend build
execSync('node .yarn/releases/yarn-*.cjs build:all', { stdio: 'inherit', cwd: projectDirectory });

// Start backstage
execSync('node .yarn/releases/yarn-*.cjs workspace backend start', { stdio: 'inherit', cwd: projectDirectory });
