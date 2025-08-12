// Test runner for the internal documentation site
// This file can be run with Node.js to execute the tests

// Load the test file
const fs = require('fs');
const path = require('path');

// Read and execute the test file
const testFilePath = path.join(__dirname, 'test', 'test_functionality.js');
const testCode = fs.readFileSync(testFilePath, 'utf8');

// Mock console for capturing output
let testOutput = [];
const originalConsoleLog = console.log;
console.log = function(...args) {
    testOutput.push(args.join(' '));
    originalConsoleLog.apply(console, args);
};

try {
    // Execute the test code
    eval(testCode);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests completed successfully!');
    console.log('The GitHub Pages setup is ready for deployment.');
    console.log('='.repeat(50));
    
} catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
}

// Restore console
console.log = originalConsoleLog;