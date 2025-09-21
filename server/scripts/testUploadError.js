const { User } = require('../models');

async function testUploadError() {
  try {
    console.log('🔍 TESTING IMAGE UPLOAD ERROR\n');
    
    // First, let's register a test user and get a token
    console.log('1. Registering test user...');
    const testUser = await User.create({
      username: 'uploadtest',
      email: 'uploadtest@example.com',
      password: '$2a$10$testpasswordhash' // This is just for testing
    });
    
    console.log('✅ Test user created with ID:', testUser.id);
    
    console.log('\n2. Now try uploading an image from the frontend:');
    console.log('   - Go to http://localhost:4200');
    console.log('   - Login with: uploadtest@example.com');
    console.log('   - Try to create a post with an image');
    console.log('   - Check the server console for detailed error logs');
    
    console.log('\n3. The server now has detailed logging enabled:');
    console.log('   - File upload info');
    console.log('   - Database operation details');
    console.log('   - Complete error stack traces');
    
    console.log('\n4. Common issues to check:');
    console.log('   - File size (must be < 5MB)');
    console.log('   - File type (must be image/*)');
    console.log('   - Authentication token');
    console.log('   - Database connection');
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }
}

testUploadError();


