const sequelize = require('../config/database');

async function runSQL() {
  try {
    // Get SQL query from command line arguments
    const sqlQuery = process.argv.slice(2).join(' ');
    
    if (!sqlQuery) {
      console.log('❌ Please provide a SQL query.');
      console.log('Usage: node runSQL.js "SELECT * FROM Users"');
      console.log('Usage: node runSQL.js "SELECT username, email FROM Users WHERE id = 1"');
      console.log('Usage: node runSQL.js "SELECT COUNT(*) FROM Users"');
      process.exit(1);
    }
    
    console.log(`🔍 Executing SQL Query: ${sqlQuery}\n`);
    console.log('=' .repeat(80));
    
    // Test database connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');
    
    // Execute the query
    const [results] = await sequelize.query(sqlQuery);
    
    if (Array.isArray(results)) {
      console.log(`✅ Query executed successfully! Found ${results.length} row(s):\n`);
      
      if (results.length === 0) {
        console.log('No results found.');
      } else {
        // Display results in a nice format
        console.log(JSON.stringify(results, null, 2));
        
        // Also show in table format if it's a simple select
        if (sqlQuery.toUpperCase().includes('SELECT') && results.length > 0) {
          console.log('\n📋 Table Format:');
          const keys = Object.keys(results[0]);
          console.log(keys.join('\t'));
          console.log('-'.repeat(keys.join('\t').length));
          results.forEach(row => {
            console.log(keys.map(key => row[key] || 'NULL').join('\t'));
          });
        }
      }
    } else {
      console.log('✅ Query executed successfully!');
      console.log('Result:', results);
    }
    
  } catch (error) {
    console.error('❌ Error executing SQL query:', error.message);
    console.error('\n💡 Common issues:');
    console.error('1. Check SQL syntax');
    console.error('2. Make sure table name is correct (case-sensitive)');
    console.error('3. Use single quotes for string values');
    console.error('4. Example: node runSQL.js "SELECT * FROM Users WHERE username = \'govind\'"');
  } finally {
    process.exit(0);
  }
}

runSQL();

