const sequelize = require('../config/database');
const path = require('path');
const fs = require('fs');

async function verifyDatabase() {
  try {
    console.log('🔍 VERIFYING DATABASE FILE AND CONTENTS\n');
    console.log('=' .repeat(70));
    
    // Get database file info
    const dbPath = path.resolve('./database.sqlite');
    const stats = fs.statSync(dbPath);
    
    console.log('📁 DATABASE FILE INFORMATION:');
    console.log(`   Full Path: ${dbPath}`);
    console.log(`   File Size: ${stats.size} bytes`);
    console.log(`   Created: ${stats.birthtime}`);
    console.log(`   Modified: ${stats.mtime}`);
    console.log(`   Accessed: ${stats.atime}\n`);
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');
    
    // Get all tables
    const [tables] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
    );
    console.log('📋 TABLES IN DATABASE:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    console.log('');
    
    // Get Users table info
    const [users] = await sequelize.query('SELECT * FROM Users ORDER BY id;');
    console.log('👥 USERS IN DATABASE:');
    console.log(`   Total Users: ${users.length}\n`);
    
    if (users.length > 0) {
      console.log('📊 USER DETAILS:');
      users.forEach(user => {
        console.log(`   ID: ${user.id} | Username: ${user.username} | Email: ${user.email} | Join Date: ${user.joinDate}`);
      });
    } else {
      console.log('❌ NO USERS FOUND IN DATABASE!');
    }
    
    // Get Posts table info
    const [posts] = await sequelize.query('SELECT * FROM Posts ORDER BY id;');
    console.log(`\n📝 POSTS IN DATABASE: ${posts.length}`);
    
    // Get Likes table info
    const [likes] = await sequelize.query('SELECT * FROM Likes ORDER BY id;');
    console.log(`❤️ LIKES IN DATABASE: ${likes.length}`);
    
    // Get Comments table info
    const [comments] = await sequelize.query('SELECT * FROM Comments ORDER BY id;');
    console.log(`💬 COMMENTS IN DATABASE: ${comments.length}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TROUBLESHOOTING GUIDE FOR DB BROWSER:');
    console.log('');
    console.log('1. 📁 CORRECT FILE PATH:');
    console.log(`   ${dbPath}`);
    console.log('');
    console.log('2. 📊 EXPECTED RESULTS:');
    console.log(`   - Users table should show ${users.length} records`);
    console.log(`   - File size should be ${stats.size} bytes`);
    console.log(`   - Last modified: ${stats.mtime}`);
    console.log('');
    console.log('3. 🔍 IF YOU DON\'T SEE ALL USERS:');
    console.log('   - Make sure you opened the file at the path above');
    console.log('   - Check if you have multiple database files');
    console.log('   - Verify the file size matches the expected size');
    console.log('   - Try refreshing the database in DB Browser');
    console.log('');
    console.log('4. 🛠️ DB BROWSER STEPS:');
    console.log('   - File → Open Database');
    console.log('   - Navigate to: D:\\GitHub-ContentWithCars\\server\\');
    console.log('   - Select: database.sqlite');
    console.log('   - Go to "Browse Data" tab');
    console.log('   - Select "Users" table');
    console.log('');
    console.log('5. 🧪 TEST QUERY IN DB BROWSER:');
    console.log('   - Go to "Execute SQL" tab');
    console.log('   - Run: SELECT COUNT(*) FROM Users;');
    console.log(`   - Expected result: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

verifyDatabase();

