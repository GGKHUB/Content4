const axios = require('axios');

async function testAPIEndpoints() {
  try {
    console.log('🌐 TESTING BACKEND API ENDPOINTS TO FETCH USERS\n');
    console.log('=' .repeat(80));
    
    const baseURL = 'http://localhost:5000/api';
    
    // Test 1: Check if server is running
    console.log('\n📋 TEST 1: Server Health Check');
    try {
      const response = await axios.get(`${baseURL}/posts`);
      console.log('✅ Server is running and responding');
      console.log(`Status: ${response.status}`);
    } catch (error) {
      console.log('❌ Server is not running or not accessible');
      console.log('Error:', error.message);
      return;
    }
    
    // Test 2: Register a test user
    console.log('\n📋 TEST 2: Register a test user');
    try {
      const registerData = {
        username: 'apitest',
        email: 'apitest@example.com',
        password: 'password123'
      };
      
      const registerResponse = await axios.post(`${baseURL}/register`, registerData);
      console.log('✅ User registered successfully');
      console.log(`Response: ${registerResponse.data.message}`);
      console.log(`Token: ${registerResponse.data.token.substring(0, 20)}...`);
      
      // Test 3: Login with the registered user
      console.log('\n📋 TEST 3: Login with registered user');
      const loginData = {
        email: 'apitest@example.com',
        password: 'password123'
      };
      
      const loginResponse = await axios.post(`${baseURL}/login`, loginData);
      console.log('✅ Login successful');
      console.log(`Response: ${loginResponse.data.message}`);
      console.log(`User: ${loginResponse.data.user.username} (${loginResponse.data.user.email})`);
      
      // Test 4: Get user profile (requires authentication)
      console.log('\n📋 TEST 4: Get user profile (authenticated)');
      const token = loginResponse.data.token;
      const profileResponse = await axios.get(`${baseURL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Profile retrieved successfully');
      console.log(`Username: ${profileResponse.data.username}`);
      console.log(`Email: ${profileResponse.data.email}`);
      
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, trying login instead...');
        
        // Try to login with existing user
        const loginData = {
          email: 'apitest@example.com',
          password: 'password123'
        };
        
        const loginResponse = await axios.post(`${baseURL}/login`, loginData);
        console.log('✅ Login successful with existing user');
        console.log(`User: ${loginResponse.data.user.username} (${loginResponse.data.user.email})`);
      } else {
        console.log('❌ Error:', error.response?.data?.message || error.message);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 HOW TO FETCH USERS FROM BACKEND:');
    console.log('');
    console.log('1. 🔐 AUTHENTICATION REQUIRED:');
    console.log('   - First register/login to get a JWT token');
    console.log('   - Include token in Authorization header: "Bearer <token>"');
    console.log('');
    console.log('2. 📋 AVAILABLE ENDPOINTS:');
    console.log('   - POST /api/register - Register new user');
    console.log('   - POST /api/login - Login existing user');
    console.log('   - GET /api/profile - Get current user profile (authenticated)');
    console.log('   - GET /api/users/:userId - Get user by ID (authenticated)');
    console.log('');
    console.log('3. 🗄️ DIRECT DATABASE ACCESS:');
    console.log('   - Use the scripts I created to query database directly');
    console.log('   - node scripts/showUsers.js - Show all users');
    console.log('   - node scripts/searchUser.js <term> - Search for user');
    console.log('   - node scripts/queryUsers.js - Raw SQL query');
    console.log('');
    console.log('4. 🔍 CURRENT USERS IN DATABASE:');
    console.log('   - GGK-2 (govind1@gmail.com)');
    console.log('   - testuser2 (testuser2@example.com)');
    console.log('   - GGK-octane (govind@gmail.com)');
    console.log('   - newuser (newuser@example.com)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check if axios is available, if not, show manual instructions
try {
  require('axios');
  testAPIEndpoints();
} catch (error) {
  console.log('📋 MANUAL API TESTING INSTRUCTIONS:');
  console.log('');
  console.log('Since axios is not installed, you can test the API manually:');
  console.log('');
  console.log('1. 🌐 Using Browser or Postman:');
  console.log('   - GET http://localhost:5000/api/posts (to check if server is running)');
  console.log('   - POST http://localhost:5000/api/register');
  console.log('   - POST http://localhost:5000/api/login');
  console.log('   - GET http://localhost:5000/api/profile (with Authorization header)');
  console.log('');
  console.log('2. 💻 Using PowerShell:');
  console.log('   $body = @{username="test"; email="test@example.com"; password="password123"} | ConvertTo-Json');
  console.log('   Invoke-RestMethod -Uri "http://localhost:5000/api/register" -Method Post -Body $body -ContentType "application/json"');
  console.log('');
  console.log('3. 🗄️ Direct Database Access (Recommended):');
  console.log('   node scripts/showUsers.js');
  console.log('   node scripts/searchUser.js <search_term>');
}

