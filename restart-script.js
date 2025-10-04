#!/usr/bin/env node

console.log('=== Running Node.js restart startup script ===');

const { execSync } = require('child_process');
const projectDirectory = '/projects/devhub-devspace';

// Run yarn typscript compiler
try {
  execSync('node .yarn/releases/yarn-*.cjs tsc', { 
    stdio: 'inherit', 
    cwd: projectDirectory, 
    shell: true 
  });
  console.log('TypeScript compilation successful!');
} catch (error) {
  // execSync throws when the command exits with non-zero status
  console.error('TypeScript compilation failed');
  
  if (error.status !== undefined) {
    console.error(`Exit code: ${error.status}`);
  }
  
  if (error.signal) {
    console.error(`Process killed with signal: ${error.signal}`);
  }
  
  // Re-throw or handle based on your needs
  process.exit(1); // or throw error;
}

// Run frontend & backend build
execSync('node .yarn/releases/yarn-*.cjs build:all', { stdio: 'inherit', cwd: projectDirectory, shell: true });

// Start backstage
execSync('node .yarn/releases/yarn-*.cjs workspace backend start', { stdio: 'inherit', cwd: projectDirectory, shell: true });
