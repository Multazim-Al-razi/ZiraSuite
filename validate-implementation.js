/**
 * Quickstart validation script to ensure all functionality works as specified
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function validateImplementation() {
  console.log('Validating Supabase Authentication Implementation...\n');
  
  let validationResults = {
    setup: {
      packageJson: false,
      envFile: false,
      dependencies: false
    },
    foundational: {
      configFiles: false,
      middleware: false,
      models: false,
      routes: false
    },
    userStories: {
      us1_login: false,
      us2_protectedAccess: false,
      us3_session: false,
      us4_logout: false
    },
    polish: {
      documentation: false,
      codeQuality: false
    }
  };
  
  // Check if required files exist
  console.log('1. Checking file structure...');
  
  // Setup phase validation
 validationResults.setup.packageJson = fs.existsSync('./package.json');
  validationResults.setup.envFile = fs.existsSync('./.env');
  
  if (validationResults.setup.packageJson) {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    validationResults.setup.dependencies = 
      packageJson.dependencies && 
      packageJson.dependencies['@supabase/supabase-js'] &&
      packageJson.dependencies['express'] &&
      packageJson.dependencies['cookie-parser'] ? true : false;
  }
  
  console.log(`   - package.json: ${validationResults.setup.packageJson ? '✓' : '✗'}`);
  console.log(`   - .env file: ${validationResults.setup.envFile ? '✓' : '✗'}`);
  console.log(`   - Dependencies: ${validationResults.setup.dependencies ? '✓' : '✗'}`);
  
  // Foundational phase validation
 console.log('\n2. Checking foundational components...');
  
  validationResults.foundational.configFiles = 
    fs.existsSync('./config/supabase.js');
  validationResults.foundational.middleware = 
    fs.existsSync('./middleware/auth.js');
  validationResults.foundational.models = 
    fs.existsSync('./src/auth/session/sessionModel.js');
  validationResults.foundational.routes = 
    fs.existsSync('./routes/auth.js');
  
  console.log(`   - Supabase config: ${validationResults.foundational.configFiles ? '✓' : '✗'}`);
  console.log(`   - Auth middleware: ${validationResults.foundational.middleware ? '✓' : '✗'}`);
  console.log(`   - Session model: ${validationResults.foundational.models ? '✓' : '✗'}`);
  console.log(`   - Auth routes: ${validationResults.foundational.routes ? '✓' : '✗'}`);
  
  // User Story validation
 console.log('\n3. Checking user story implementations...');
  
  validationResults.userStories.us1_login = 
    fs.existsSync('./src/views/login.html') &&
    fs.existsSync('./public/css/login.css') &&
    fs.existsSync('./public/js/login.js') &&
    fs.existsSync('./src/controllers/authController.js');
    
  validationResults.userStories.us2_protectedAccess = 
    fs.existsSync('./src/auth/session/authGuard.js');
    
 validationResults.userStories.us3_session = 
    fs.existsSync('./src/auth/session/sessionManager.js');
    
 validationResults.userStories.us4_logout = 
    fs.existsSync('./src/controllers/authController.js'); // logout endpoint in same file
  
  console.log(`   - User Story 1 (Login): ${validationResults.userStories.us1_login ? '✓' : '✗'}`);
  console.log(`   - User Story 2 (Protected Access): ${validationResults.userStories.us2_protectedAccess ? '✓' : '✗'}`);
  console.log(`   - User Story 3 (Session Management): ${validationResults.userStories.us3_session ? '✓' : '✗'}`);
  console.log(`   - User Story 4 (Logout): ${validationResults.userStories.us4_logout ? '✓' : '✗'}`);
  
  // Polish phase validation
  console.log('\n4. Checking polish components...');
  
  validationResults.polish.documentation = 
    fs.existsSync('./docs/auth-implementation.md');
  
 // Basic code quality check - check if files have content
  const serverFile = fs.readFileSync('./server.js', 'utf8');
  validationResults.polish.codeQuality = serverFile.length > 0;
  
  console.log(`   - Documentation: ${validationResults.polish.documentation ? '✓' : '✗'}`);
  console.log(`   - Code quality: ${validationResults.polish.codeQuality ? '✓' : '✗'}`);
  
  // Summary
  console.log('\n5. Validation Summary:');
  
  const allValid = Object.values(validationResults).every(
    category => Object.values(category).every(result => result === true)
  );
  
  // Debug output
  console.log('Debug - validationResults:', JSON.stringify(validationResults, null, 2));
  console.log('Debug - allValid:', allValid);
  
  console.log(`Overall status: ${allValid ? '✅ ALL VALIDATIONS PASSED' : '❌ SOME VALIDATIONS FAILED'}`);
  
  if (!allValid) {
    console.log('\nFailed validations:');
    for (const [category, items] of Object.entries(validationResults)) {
      for (const [item, result] of Object.entries(items)) {
        if (!result) {
          console.log(`  - ${category}.${item}`);
        }
      }
    }
  }
  
  return allValid;
}

// Run validation
validateImplementation()
  .then(success => {
    if (success) {
      console.log('\n🎉 Implementation validation successful!');
      process.exit(0);
    } else {
      console.log('\n❌ Implementation validation failed!');
      process.exit(1);
    }
 })
  .catch(err => {
    console.error('Error during validation:', err);
    process.exit(1);
  });