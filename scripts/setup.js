#!/usr/bin/env node

const { spawn } = require('child_process');

async function installDependencies() {
  console.log('🔧 Setting up Ticket Status Tracker...');
  
  try {
    // Install root dependencies
    console.log('📦 Installing root dependencies...');
    await runCommand('npm', ['install'], './');
    
    // Install backend dependencies
    console.log('📦 Installing backend dependencies...');
    await runCommand('npm', ['install'], './backend');
    
    // Install frontend dependencies
    console.log('📦 Installing frontend dependencies...');
    await runCommand('npm', ['install'], './frontend');
    
    console.log('✅ Setup complete! You can now run:');
    console.log('   npm run dev:fast    # For fastest startup');
    console.log('   npm run dev         # For regular startup');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: cwd
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

installDependencies(); 