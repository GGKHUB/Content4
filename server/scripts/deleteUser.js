const { User } = require('../models');

async function deleteUser(emailOrUsername) {
  try {
    console.log(`🔍 Looking for user to delete: ${emailOrUsername}\n`);
    
    // Find user by email or username
    const { Op } = require('sequelize');
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });
    
    if (!user) {
      console.log('❌ User not found. Please check the email or username.');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}\n`);
    
    // Confirm deletion
    console.log('⚠️  Are you sure you want to delete this user?');
    console.log('   This action cannot be undone!');
    
    // For script automation, we'll delete directly
    // In a real application, you'd want user confirmation
    await user.destroy();
    
    console.log('✅ User deleted successfully!');
    console.log(`   Deleted user: ${user.username} (${user.email})`);
    
    // Show remaining users
    const remainingUsers = await User.findAll({
      attributes: ['id', 'username', 'email'],
      order: [['id', 'ASC']]
    });
    
    console.log(`\n📋 Remaining users (${remainingUsers.length}):`);
    remainingUsers.forEach(user => {
      console.log(`   ${user.id}. ${user.username} (${user.email})`);
    });
    
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  } finally {
    process.exit(0);
  }
}

// Get parameter from command line arguments
const emailOrUsername = process.argv[2];

if (!emailOrUsername) {
  console.log('❌ Please provide email or username to delete.');
  console.log('Usage: node deleteUser.js <email_or_username>');
  console.log('Example: node deleteUser.js govind@gmail.com');
  process.exit(1);
}

deleteUser(emailOrUsername);


