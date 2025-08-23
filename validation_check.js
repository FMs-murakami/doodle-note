#!/usr/bin/env node

/**
 * Comprehensive validation script for Phase 2 implementation
 * Validates GitHub Actions workflow, package.json, and build system
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Phase 2 Implementation Validation\n');

let validationErrors = [];
let validationWarnings = [];

// Helper function to check file existence
function checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description}: ${filePath}`);
        return true;
    } else {
        console.log(`❌ ${description}: ${filePath} - NOT FOUND`);
        validationErrors.push(`Missing file: ${filePath}`);
        return false;
    }
}

// Helper function to validate JSON structure
function validateJSON(filePath, requiredFields) {
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let isValid = true;
        
        for (const field of requiredFields) {
            if (!content[field]) {
                console.log(`❌ ${filePath}: Missing required field '${field}'`);
                validationErrors.push(`${filePath}: Missing field '${field}'`);
                isValid = false;
            }
        }
        
        if (isValid) {
            console.log(`✅ ${filePath}: JSON structure valid`);
        }
        
        return content;
    } catch (error) {
        console.log(`❌ ${filePath}: Invalid JSON - ${error.message}`);
        validationErrors.push(`${filePath}: Invalid JSON`);
        return null;
    }
}

// Helper function to validate YAML content
function validateYAMLContent(filePath, requiredStrings) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let isValid = true;
        
        for (const requiredString of requiredStrings) {
            if (!content.includes(requiredString)) {
                console.log(`❌ ${filePath}: Missing required content '${requiredString}'`);
                validationErrors.push(`${filePath}: Missing '${requiredString}'`);
                isValid = false;
            }
        }
        
        if (isValid) {
            console.log(`✅ ${filePath}: Required content present`);
        }
        
        return content;
    } catch (error) {
        console.log(`❌ ${filePath}: Cannot read file - ${error.message}`);
        validationErrors.push(`${filePath}: Cannot read file`);
        return null;
    }
}

console.log('📋 Requirement #1: GitHub Actions ワークフロー基盤構築');
console.log('=' .repeat(60));

// Check GitHub Actions workflow file
const workflowExists = checkFileExists('.github/workflows/deploy.yml', 'GitHub Actions workflow');

if (workflowExists) {
    const requiredWorkflowContent = [
        'name: Deploy to GitHub Pages',
        'branches: [ main ]',
        'node-version: \'18\'',
        'npm ci',
        'npm run build',
        'actions/deploy-pages@v4',
        'permissions:',
        'pages: write',
        'contents: read'
    ];
    
    validateYAMLContent('.github/workflows/deploy.yml', requiredWorkflowContent);
}

// Check workflow documentation
checkFileExists('.github/workflows/README.md', 'Workflow documentation');

console.log('\n📋 Requirement #2: package.json とビルド環境整備');
console.log('=' .repeat(60));

// Check package.json
const packageExists = checkFileExists('package.json', 'Package configuration');

if (packageExists) {
    const packageJson = validateJSON('package.json', ['name', 'scripts', 'devDependencies']);
    
    if (packageJson) {
        // Validate specific requirements
        if (packageJson.name !== 'internal-docs') {
            console.log(`❌ package.json: Name should be 'internal-docs', got '${packageJson.name}'`);
            validationErrors.push('package.json: Incorrect name');
        } else {
            console.log(`✅ package.json: Name is correct`);
        }
        
        // Check required scripts
        const requiredScripts = ['build', 'dev'];
        for (const script of requiredScripts) {
            if (!packageJson.scripts[script]) {
                console.log(`❌ package.json: Missing script '${script}'`);
                validationErrors.push(`package.json: Missing script '${script}'`);
            } else {
                console.log(`✅ package.json: Script '${script}' defined`);
            }
        }
        
        // Check required dependencies
        const requiredDeps = ['marked', 'highlight.js', 'fs-extra'];
        for (const dep of requiredDeps) {
            if (!packageJson.devDependencies[dep]) {
                console.log(`❌ package.json: Missing dependency '${dep}'`);
                validationErrors.push(`package.json: Missing dependency '${dep}'`);
            } else {
                console.log(`✅ package.json: Dependency '${dep}' defined`);
            }
        }
    }
}

// Check package-lock.json for CI/CD compatibility
console.log('\n📋 Dependencies Lock File Validation');
console.log('=' .repeat(60));

const lockFileExists = checkFileExists('package-lock.json', 'Dependencies lock file');

if (lockFileExists) {
    const lockFileJson = validateJSON('package-lock.json', ['name', 'lockfileVersion', 'packages']);
    
    if (lockFileJson) {
        // Validate lock file structure
        if (lockFileJson.name !== 'internal-docs') {
            console.log(`❌ package-lock.json: Name should be 'internal-docs', got '${lockFileJson.name}'`);
            validationErrors.push('package-lock.json: Incorrect name');
        } else {
            console.log(`✅ package-lock.json: Name is correct`);
        }
        
        if (!lockFileJson.lockfileVersion) {
            console.log(`❌ package-lock.json: Missing lockfileVersion`);
            validationErrors.push('package-lock.json: Missing lockfileVersion');
        } else {
            console.log(`✅ package-lock.json: Lock file version specified (${lockFileJson.lockfileVersion})`);
        }
        
        // Check for required dependencies in lock file
        const requiredDeps = ['marked', 'highlight.js', 'fs-extra'];
        for (const dep of requiredDeps) {
            const depKey = `node_modules/${dep}`;
            if (!lockFileJson.packages || !lockFileJson.packages[depKey]) {
                console.log(`❌ package-lock.json: Missing dependency '${dep}'`);
                validationErrors.push(`package-lock.json: Missing dependency '${dep}'`);
            } else {
                console.log(`✅ package-lock.json: Dependency '${dep}' locked`);
            }
        }
    }
} else {
    console.log(`❌ package-lock.json: File is required for CI/CD pipeline (npm ci)`);
    validationErrors.push('package-lock.json: Required for CI/CD pipeline');
}

// Check build scripts
console.log('\n📋 Build Scripts Validation');
console.log('=' .repeat(60));

const buildScriptExists = checkFileExists('scripts/build.js', 'Build script');
const devScriptExists = checkFileExists('scripts/dev.js', 'Development script');

if (buildScriptExists) {
    const buildContent = fs.readFileSync('scripts/build.js', 'utf8');
    const requiredBuildContent = ['marked', 'highlight.js', 'fs-extra', 'dist'];
    
    for (const required of requiredBuildContent) {
        if (buildContent.includes(required)) {
            console.log(`✅ Build script: Contains '${required}'`);
        } else {
            console.log(`❌ Build script: Missing '${required}'`);
            validationErrors.push(`Build script: Missing '${required}'`);
        }
    }
}

// Check configuration files
console.log('\n📋 Configuration Files Validation');
console.log('=' .repeat(60));

const configExists = checkFileExists('config/config.json', 'Site configuration');
if (configExists) {
    validateJSON('config/config.json', ['site', 'pages', 'navigation', 'theme']);
}

// Check existing content
console.log('\n📋 Existing Content Validation');
console.log('=' .repeat(60));

checkFileExists('docs/README.md', 'Sample documentation');
checkFileExists('index.html', 'Main HTML file');
checkFileExists('assets/css', 'CSS assets directory');
checkFileExists('assets/js', 'JavaScript assets directory');

// Summary
console.log('\n📊 Validation Summary');
console.log('=' .repeat(60));

if (validationErrors.length === 0) {
    console.log('🎉 All validation checks passed!');
    console.log('✅ GitHub Actions workflow is properly configured');
    console.log('✅ package.json meets all requirements');
    console.log('✅ Build system is ready for deployment');
    console.log('✅ All required files are present');
} else {
    console.log(`❌ Found ${validationErrors.length} validation errors:`);
    validationErrors.forEach(error => console.log(`   - ${error}`));
}

if (validationWarnings.length > 0) {
    console.log(`⚠️  Found ${validationWarnings.length} warnings:`);
    validationWarnings.forEach(warning => console.log(`   - ${warning}`));
}

console.log('\n🚀 Next Steps:');
console.log('1. Run `npm ci` to install dependencies');
console.log('2. Run `npm run build` to test the build process');
console.log('3. Run `npm run dev` to test the development server');
console.log('4. Commit and push to trigger GitHub Actions deployment');

// Exit with appropriate code
process.exit(validationErrors.length === 0 ? 0 : 1);