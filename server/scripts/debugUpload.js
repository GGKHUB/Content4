const { User, Post } = require('../models');

async function debugUpload() {
  try {
    console.log('🔍 DEBUGGING UPLOAD ISSUES\n');
    
    // Check if uploads directory exists and is writable
    const fs = require('fs');
    const path = require('path');
    
    const uploadsDir = path.resolve('./uploads');
    console.log('📁 Uploads directory:', uploadsDir);
    console.log('📁 Directory exists:', fs.existsSync(uploadsDir));
    
    if (fs.existsSync(uploadsDir)) {
      const stats = fs.statSync(uploadsDir);
      console.log('📁 Is directory:', stats.isDirectory());
      console.log('📁 Permissions:', stats.mode);
    }
    
    // Check database connection
    console.log('\n🗄️ Database connection test:');
    const sequelize = require('../config/database');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if we can create a test post (without image)
    console.log('\n📝 Testing post creation (without image):');
    try {
      const testPost = await Post.create({
        userId: 3, // testuser3
        caption: 'Test post for debugging',
        imageUrl: '/uploads/test.jpg'
      });
      console.log('✅ Post creation successful:', testPost.id);
      
      // Clean up test post
      await testPost.destroy();
      console.log('✅ Test post cleaned up');
    } catch (error) {
      console.log('❌ Post creation failed:', error.message);
    }
    
    // Check Posts table structure
    console.log('\n📋 Posts table info:');
    const [posts] = await sequelize.query('PRAGMA table_info(Posts);');
    console.log('Posts table columns:');
    posts.forEach(col => {
      console.log(`  ${col.name} (${col.type})`);
    });
    
    console.log('\n💡 COMMON UPLOAD ISSUES:');
    console.log('1. File size too large (>5MB)');
    console.log('2. File type not supported (must be image/*)');
    console.log('3. No file selected in frontend');
    console.log('4. Missing Authorization header');
    console.log('5. Uploads directory not writable');
    console.log('6. Database connection issues');
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    process.exit(0);
  }
}

debugUpload();
