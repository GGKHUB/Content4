const sequelize = require('../config/database');

async function queryUsers() {
  try {
    console.log('🔍 Raw SQL Query to get all users:\n');
    console.log('SELECT id, username, email, firstName, lastName, joinDate FROM Users ORDER BY joinDate DESC;\n');
    
    const [results] = await sequelize.query(
      'SELECT id, username, email, firstName, lastName, joinDate FROM Users ORDER BY joinDate DESC'
    );
    
    console.log('📋 Query Results:');
    console.log(JSON.stringify(results, null, 2));
    
    console.log('\n🔑 Login Information:');
    console.log('Users can login using either:');
    console.log('1. Email address (primary login field)');
    console.log('2. Username (alternative identifier)');
    console.log('Both email and username are UNIQUE in the database.\n');
    
    console.log('🔐 Password Storage:');
    console.log('Passwords are hashed using bcrypt before storing in the database.');
    console.log('Raw passwords are never stored for security.\n');
    
    console.log('📊 Database Details:');
    console.log(`Database Type: SQLite`);
    console.log(`Table Name: Users`);
    console.log(`Database File: database.sqlite`);
    console.log(`Total Records: ${results.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

queryUsers();

