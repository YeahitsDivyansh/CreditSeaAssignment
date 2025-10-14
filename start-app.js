#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CreditSea Application...\n');

// Start backend server
console.log('📦 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a moment for backend to start
setTimeout(() => {
  console.log('\n📦 Starting frontend server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });

  console.log('\n🎉 CreditSea Application is starting up!');
  console.log('📱 Frontend: http://localhost:5173');
  console.log('🔧 Backend API: http://localhost:5000');
  console.log('❤️  Health Check: http://localhost:5000/health');
  console.log('\n📝 Sample XML files are available in server/sample-data/');
  console.log('\nPress Ctrl+C to stop all servers');

  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

}, 3000);

// Handle backend errors
backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

backend.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend process exited with code ${code}`);
  }
});
