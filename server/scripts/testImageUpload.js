const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testImageUpload() {
  try {
    console.log('🔍 TESTING IMAGE UPLOAD ENDPOINT\n');
    
    // Create a simple test image file
    const testImagePath = './test-image.txt';
    fs.writeFileSync(testImagePath, 'This is a test image content');
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'test-image.txt',
      contentType: 'image/jpeg'
    });
    formData.append('caption', 'Test post from script');
    
    // Get auth token
    const loginResponse = await axios.post('http://localhost:5000/api/login', {
      email: 'testuser3@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token obtained\n');
    
    // Test image upload
    console.log('📤 Testing image upload...');
    const uploadResponse = await axios.post('http://localhost:5000/api/posts', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ Image upload successful!');
    console.log('Response:', uploadResponse.data);
    
    // Clean up test file
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('❌ Image upload failed:');
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

// Check if axios is available
try {
  require('axios');
  testImageUpload();
} catch (error) {
  console.log('📋 MANUAL TESTING INSTRUCTIONS:');
  console.log('');
  console.log('Since axios is not installed, you can test manually:');
  console.log('');
  console.log('1. 🌐 Using Postman:');
  console.log('   - POST http://localhost:5000/api/posts');
  console.log('   - Headers: Authorization: Bearer <token>');
  console.log('   - Body: form-data with image file and caption');
  console.log('');
  console.log('2. 💻 Using PowerShell (limited):');
  console.log('   - PowerShell has limited FormData support');
  console.log('   - Try using the web interface instead');
  console.log('');
  console.log('3. 🗄️ Check server logs for detailed error messages');
}


