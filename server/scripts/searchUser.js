const { User } = require('../models');

async function searchUser(searchTerm) {
  try {
    console.log(`🔍 Searching for user with term: "${searchTerm}"\n`);
    
    // Search by username
    const userByUsername = await User.findOne({
      where: { username: searchTerm },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'joinDate']
    });
    
    // Search by email
    const userByEmail = await User.findOne({
      where: { email: searchTerm },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'joinDate']
    });
    
    // Search by partial username or email
    const { Op } = require('sequelize');
    const partialMatches = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'joinDate']
    });
    
    console.log('📋 Search Results:\n');
    
    if (userByUsername) {
      console.log('✅ Exact Username Match:');
      console.log(`   ID: ${userByUsername.id}`);
      console.log(`   Username: ${userByUsername.username}`);
      console.log(`   Email: ${userByUsername.email}`);
      console.log(`   Name: ${userByUsername.firstName || 'N/A'} ${userByUsername.lastName || 'N/A'}`);
      console.log(`   Join Date: ${userByUsername.joinDate}\n`);
    }
    
    if (userByEmail) {
      console.log('✅ Exact Email Match:');
      console.log(`   ID: ${userByEmail.id}`);
      console.log(`   Username: ${userByEmail.username}`);
      console.log(`   Email: ${userByEmail.email}`);
      console.log(`   Name: ${userByEmail.firstName || 'N/A'} ${userByEmail.lastName || 'N/A'}`);
      console.log(`   Join Date: ${userByEmail.joinDate}\n`);
    }
    
    if (partialMatches.length > 0) {
      console.log(`🔍 Partial Matches (${partialMatches.length} found):`);
      partialMatches.forEach(user => {
        console.log(`   ID: ${user.id} | Username: ${user.username} | Email: ${user.email}`);
      });
      console.log('');
    }
    
    if (!userByUsername && !userByEmail && partialMatches.length === 0) {
      console.log('❌ No users found matching your search term.');
      console.log('\n📋 All current users:');
      const allUsers = await User.findAll({
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'joinDate'],
        order: [['joinDate', 'DESC']]
      });
      
      allUsers.forEach(user => {
        console.log(`   ${user.id}. ${user.username} (${user.email}) - ${user.joinDate}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error searching for user:', error.message);
  } finally {
    process.exit(0);
  }
}

// Get search term from command line arguments
const searchTerm = process.argv[2];
if (!searchTerm) {
  console.log('❌ Please provide a search term.');
  console.log('Usage: node searchUser.js <username_or_email>');
  console.log('Example: node searchUser.js govind');
  process.exit(1);
}

searchUser(searchTerm);

