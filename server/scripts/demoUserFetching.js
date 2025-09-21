const { User } = require('../models');
const sequelize = require('../config/database');

async function demonstrateUserFetching() {
  try {
    console.log('🔍 DEMONSTRATING DIFFERENT WAYS TO FETCH REGISTERED USERS\n');
    console.log('=' .repeat(80));
    
    // Method 1: Using Sequelize ORM - findAll()
    console.log('\n📋 METHOD 1: Using Sequelize ORM (findAll)');
    console.log('Code: User.findAll({ attributes: [...], order: [...] })');
    console.log('Result:');
    
    const users1 = await User.findAll({
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'joinDate'],
      order: [['joinDate', 'DESC']]
    });
    
    console.log(`Found ${users1.length} users:`);
    users1.forEach(user => {
      console.log(`  ${user.id}. ${user.username} (${user.email}) - ${user.joinDate}`);
    });
    
    // Method 2: Using Raw SQL Query
    console.log('\n📋 METHOD 2: Using Raw SQL Query');
    console.log('Code: sequelize.query("SELECT * FROM Users ORDER BY joinDate DESC")');
    console.log('Result:');
    
    const [users2] = await sequelize.query(
      'SELECT id, username, email, firstName, lastName, joinDate FROM Users ORDER BY joinDate DESC'
    );
    
    console.log(`Found ${users2.length} users:`);
    users2.forEach(user => {
      console.log(`  ${user.id}. ${user.username} (${user.email}) - ${user.joinDate}`);
    });
    
    // Method 3: Using findOne for specific user
    console.log('\n📋 METHOD 3: Finding a specific user by email');
    console.log('Code: User.findOne({ where: { email: "govind@gmail.com" } })');
    console.log('Result:');
    
    const specificUser = await User.findOne({
      where: { email: 'govind@gmail.com' },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'joinDate']
    });
    
    if (specificUser) {
      console.log(`Found user: ${specificUser.username} (${specificUser.email})`);
    } else {
      console.log('User not found');
    }
    
    // Method 4: Using count to get total number
    console.log('\n📋 METHOD 4: Getting user count');
    console.log('Code: User.count()');
    console.log('Result:');
    
    const userCount = await User.count();
    console.log(`Total users in database: ${userCount}`);
    
    // Method 5: Using findAll with conditions
    console.log('\n📋 METHOD 5: Finding users with specific conditions');
    console.log('Code: User.findAll({ where: { firstName: { [Op.ne]: null } } })');
    console.log('Result:');
    
    const { Op } = require('sequelize');
    const usersWithNames = await User.findAll({
      where: {
        firstName: { [Op.ne]: null }
      },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName']
    });
    
    console.log(`Users with first names (${usersWithNames.length}):`);
    usersWithNames.forEach(user => {
      console.log(`  ${user.username} - ${user.firstName} ${user.lastName}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY OF METHODS:');
    console.log('1. User.findAll() - Get all users with Sequelize ORM');
    console.log('2. sequelize.query() - Execute raw SQL queries');
    console.log('3. User.findOne() - Find single user by condition');
    console.log('4. User.count() - Get total count of users');
    console.log('5. User.findAll() with where conditions - Filtered results');
    
    console.log('\n🗄️ DATABASE DETAILS:');
    console.log(`Database Type: SQLite`);
    console.log(`Database File: ${sequelize.options.storage || 'Not SQLite'}`);
    console.log(`Table Name: Users`);
    console.log(`ORM: Sequelize`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

demonstrateUserFetching();

