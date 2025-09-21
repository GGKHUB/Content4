const { User } = require('../models');

async function showUsers() {
  try {
    console.log('🔍 Fetching all registered users...\n');
    
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'joinDate'],
      order: [['joinDate', 'DESC']]
    });

    if (users.length === 0) {
      console.log('❌ No users found in the database.');
      return;
    }

    console.log(`✅ Found ${users.length} registered user(s):\n`);
    console.log('┌─────┬─────────────────┬─────────────────────────┬─────────────────┬─────────────────┬─────────────────────┐');
    console.log('│ ID  │ Username        │ Email                   │ First Name      │ Last Name       │ Join Date           │');
    console.log('├─────┼─────────────────┼─────────────────────────┼─────────────────┼─────────────────┼─────────────────────┤');
    
    users.forEach(user => {
      const id = String(user.id).padEnd(3);
      const username = (user.username || '').padEnd(15);
      const email = (user.email || '').padEnd(23);
      const firstName = (user.firstName || '').padEnd(15);
      const lastName = (user.lastName || '').padEnd(15);
      const joinDate = user.joinDate ? user.joinDate.toISOString().split('T')[0] : 'N/A';
      
      console.log(`│ ${id} │ ${username} │ ${email} │ ${firstName} │ ${lastName} │ ${joinDate} │`);
    });
    
    console.log('└─────┴─────────────────┴─────────────────────────┴─────────────────┴─────────────────┴─────────────────────┘');
    
    console.log('\n📊 Summary:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Database Table: Users`);
    console.log(`   Primary Key: id (auto-increment)`);
    console.log(`   Login Fields: email (unique), username (unique)`);
    console.log(`   Password: hashed with bcrypt`);
    
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
  } finally {
    process.exit(0);
  }
}

showUsers();

