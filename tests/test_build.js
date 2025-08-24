// Test build to see output structure
const { build } = require('../scripts/build.js');

async function testBuild() {
  try {
    await build();
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

testBuild();