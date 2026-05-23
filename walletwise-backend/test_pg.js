const { Client } = require('pg');

const passwords = ['postgres', 'root', 'admin', 'password', '1234', '12345', '123456', '', 'admin123', 'admin@123'];

async function testPasswords() {
  for (const pwd of passwords) {
    const client = new Client({
      user: 'postgres',
      password: pwd,
      host: 'localhost',
      port: 5432,
      database: 'postgres' // connect to default db first
    });
    
    try {
      await client.connect();
      console.log(`\n\nSUCCESS_FOUND_PASSWORD: ${pwd}\n\n`);
      await client.end();
      return pwd;
    } catch (err) {
      // ignore
    }
  }
  console.log('\n\nALL_FAILED\n\n');
  return null;
}

testPasswords();
