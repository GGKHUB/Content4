const sequelize = require('../config/database');

async function queryDatabase() {
  try {
    console.log('🔍 QUERYING DATABASE DIRECTLY\n');
    console.log('=' .repeat(60));
    
    // Test 1: Basic connection test
    console.log('\n📋 TEST 1: Database Connection');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test 2: Show all tables
    console.log('\n📋 TEST 2: Show all tables in database');
    const [tables] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log('Tables found:');
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    // Test 3: Show Users table structure
    console.log('\n📋 TEST 3: Users table structure');
    const [columns] = await sequelize.query(
      "PRAGMA table_info(Users);"
    );
    console.log('Users table columns:');
    columns.forEach(col => {
      console.log(`  ${col.cid}. ${col.name} (${col.type}) - ${col.notnull ? 'NOT NULL' : 'NULL'} - ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Test 4: SELECT * FROM Users
    console.log('\n📋 TEST 4: SELECT * FROM Users');
    const [users] = await sequelize.query('SELECT * FROM Users;');
    console.log(`Found ${users.length} users:`);
    console.log(JSON.stringify(users, null, 2));
    
    // Test 5: SELECT specific columns
    console.log('\n📋 TEST 5: SELECT id, username, email FROM Users');
    const [specificUsers] = await sequelize.query(
      'SELECT id, username, email, firstName, lastName, joinDate FROM Users ORDER BY joinDate DESC;'
    );
    console.log('Users (specific columns):');
    specificUsers.forEach(user => {
      console.log(`  ${user.id}. ${user.username} (${user.email}) - ${user.firstName || 'N/A'} ${user.lastName || 'N/A'} - ${user.joinDate}`);
    });
    
    // Test 6: Count users
    console.log('\n📋 TEST 6: COUNT(*) FROM Users');
    const [countResult] = await sequelize.query('SELECT COUNT(*) as total FROM Users;');
    console.log(`Total users: ${countResult[0].total}`);
    
    // Test 7: Show database info
    console.log('\n📋 TEST 7: Database information');
    const [dbInfo] = await sequelize.query('SELECT * FROM sqlite_master WHERE type="table" AND name="Users";');
    console.log('Database info:');
    console.log(JSON.stringify(dbInfo[0], null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL QUERIES EXECUTED SUCCESSFULLY!');
    console.log('\n💡 TIP: If you want to use SQLite command line:');
    console.log('1. Download SQLite from: https://www.sqlite.org/download.html');
    console.log('2. Add to PATH or use full path');
    console.log('3. Then run: sqlite3 database.sqlite "SELECT * FROM Users;"');
    
  } catch (error) {
    console.error('❌ Error querying database:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    process.exit(0);
  }
}

queryDatabase();

