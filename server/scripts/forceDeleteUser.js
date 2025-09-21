const { Sequelize } = require('sequelize');
const path = require('path');

async function forceDeleteUser() {
  try {
    console.log('🔍 FORCE DELETING USER FROM DATABASE\n');
    
    // Create a new sequelize instance with different connection settings
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.resolve('./database.sqlite'),
      logging: false,
      pool: {
        max: 1,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    });
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');
    
    // Check if user exists
    const [existingUsers] = await sequelize.query(
      "SELECT id, username, email FROM Users WHERE email = 'govind@gmail.com'"
    );
    
    if (existingUsers.length === 0) {
      console.log('✅ User govind@gmail.com is already deleted!');
      console.log('You can now register with this email address.');
    } else {
      console.log('📋 Found user to delete:');
      existingUsers.forEach(user => {
        console.log(`   ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
      });
      
      // Delete the user
      await sequelize.query("DELETE FROM Users WHERE email = 'govind@gmail.com'");
      console.log('\n✅ User deleted successfully!');
    }
    
    // Show remaining users
    const [remainingUsers] = await sequelize.query(
      "SELECT id, username, email FROM Users ORDER BY id"
    );
    
    console.log(`\n📋 Remaining users (${remainingUsers.length}):`);
    remainingUsers.forEach(user => {
      console.log(`   ${user.id}. ${user.username} (${user.email})`);
    });
    
    await sequelize.close();
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Restart your server');
    console.log('2. Try registering with govind@gmail.com');
    console.log('3. It should work now!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

forceDeleteUser();


