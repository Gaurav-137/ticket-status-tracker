#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

// Find available port
function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function start() {
  try {
    console.log('🚀 Starting Ticket Status Tracker...');
    
    // Find available ports
    const backendPort = await findAvailablePort(5000);
    const frontendPort = await findAvailablePort(3000);
    
    console.log(`✅ Backend will use port: ${backendPort}`);
    console.log(`✅ Frontend will use port: ${frontendPort}`);
    
    // Set environment variables
    process.env.PORT = backendPort.toString();
    process.env.FRONTEND_PORT = frontendPort.toString();
    
    // Start backend
    const backend = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true,
      cwd: './backend',
      env: { ...process.env, PORT: backendPort.toString() }
    });
    
    // Log backend output with prefix
    backend.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`[BACKEND] ${output}`);
      }
    });
    
    backend.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`[BACKEND ERROR] ${output}`);
      }
    });
    
    // Wait a bit for backend to start
    setTimeout(() => {
      console.log(`\n🌐 Starting frontend on http://localhost:${frontendPort}`);
      console.log(`🔗 Backend API available at http://localhost:${backendPort}/api`);
      console.log(`\n📱 Open your browser and navigate to: http://localhost:${frontendPort}\n`);
      
      // Start frontend
      const frontend = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true,
        cwd: './frontend',
        env: { ...process.env, PORT: frontendPort.toString() }
      });
      
      // Log frontend output with prefix
      frontend.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`[FRONTEND] ${output}`);
        }
      });
      
      frontend.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`[FRONTEND ERROR] ${output}`);
        }
      });
      
      frontend.on('close', (code) => {
        console.log(`[FRONTEND] Process exited with code ${code}`);
        backend.kill();
      });
    }, 3000);
    
    backend.on('close', (code) => {
      console.log(`[BACKEND] Process exited with code ${code}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
}

start(); 