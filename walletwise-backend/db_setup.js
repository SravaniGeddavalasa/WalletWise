const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  try {
    await client.connect();
    
    // Check if the database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='walletwise'");
    if (res.rowCount === 0) {
      console.log("Database 'walletwise' does not exist. Creating it...");
      await client.query("CREATE DATABASE walletwise");
      console.log("Database 'walletwise' created successfully.");
    } else {
      console.log("Database 'walletwise' already exists.");
    }
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

setupDatabase();
