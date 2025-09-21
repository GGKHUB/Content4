const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function resetPassword(usernameOrEmail, newPassword) {
  try {
    console.log(`🔍 Looking for user: ${usernameOrEmail}\n`);
    
    // Find user by username or email
    const { Op } = require('sequelize');
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      }
    });
    
    if (!user) {
      console.log('❌ User not found. Please check the username or email.');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}\n`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    await user.update({ password: hashedPassword });
    
    console.log('✅ Password updated successfully!');
    console.log(`   New password: ${newPassword}`);
    console.log('   (Password is now hashed and stored securely)');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  } finally {
    process.exit(0);
  }
}

// Get parameters from command line arguments
const usernameOrEmail = process.argv[2];
const newPassword = process.argv[3];

if (!usernameOrEmail || !newPassword) {
  console.log('❌ Please provide both username/email and new password.');
  console.log('Usage: node resetPassword.js <username_or_email> <new_password>');
  console.log('Example: node resetPassword.js govind@gmail.com mynewpassword123');
  process.exit(1);
}

resetPassword(usernameOrEmail, newPassword);

