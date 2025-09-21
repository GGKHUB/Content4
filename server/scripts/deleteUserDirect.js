const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function deleteUserDirect() {
  return new Promise((resolve, reject) => {
    const dbPath = path.resolve('./database.sqlite');
    console.log('🔍 Connecting to database:', dbPath);
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
    });

    // First, check if user exists
    db.get("SELECT id, username, email FROM Users WHERE email = 'govind@gmail.com'", (err, row) => {
      if (err) {
        console.error('❌ Error checking user:', err.message);
        db.close();
        reject(err);
        return;
      }

      if (!row) {
        console.log('✅ User govind@gmail.com is already deleted!');
        console.log('You can now register with this email address.');
        db.close();
        resolve();
        return;
      }

      console.log('📋 Found user to delete:');
      console.log(`   ID: ${row.id}, Username: ${row.username}, Email: ${row.email}`);

      // Delete the user
      db.run("DELETE FROM Users WHERE email = 'govind@gmail.com'", function(err) {
        if (err) {
          console.error('❌ Error deleting user:', err.message);
          db.close();
          reject(err);
          return;
        }

        console.log(`✅ User deleted successfully! (${this.changes} row(s) affected)`);

        // Show remaining users
        db.all("SELECT id, username, email FROM Users ORDER BY id", (err, rows) => {
          if (err) {
            console.error('❌ Error fetching remaining users:', err.message);
          } else {
            console.log(`\n📋 Remaining users (${rows.length}):`);
            rows.forEach(user => {
              console.log(`   ${user.id}. ${user.username} (${user.email})`);
            });
          }

          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err.message);
            } else {
              console.log('\n🎯 NEXT STEPS:');
              console.log('1. Restart your server');
              console.log('2. Try registering with govind@gmail.com');
              console.log('3. It should work now!');
            }
            resolve();
          });
        });
      });
    });
  });
}

deleteUserDirect().catch(console.error);

