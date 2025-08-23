#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🚀 Running npm run build...\n');

const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    cwd: process.cwd()
});

buildProcess.on('close', (code) => {
    if (code === 0) {
        console.log('\n✅ Build completed successfully!');
        
        // Check what was generated
        const fs = require('fs');
        if (fs.existsSync('dist')) {
            console.log('\n📁 Generated files:');
            const files = fs.readdirSync('dist', { recursive: true });
            files.forEach(file => {
                console.log(`   - ${file}`);
            });
        }
    } else {
        console.log(`\n❌ Build failed with code ${code}`);
    }
});

buildProcess.on('error', (error) => {
    console.error('❌ Failed to start build process:', error.message);
});