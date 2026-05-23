const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'walletwise_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'your_password';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

let isConnected = false;

const connectDB = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      isConnected = true;
      console.log('--------------------------------------------------');
      console.log('🐘 PostgreSQL database connected successfully.');
      console.log(`📡 Connected to ${dbName} on ${dbHost}:${dbPort}`);
      console.log('--------------------------------------------------');
      return;
    } catch (error) {
      console.error(`❌ [Attempt ${attempt}/${retries}] Database connection failed:`, error.message);
      if (attempt < retries) {
        console.log(`🔄 Retrying database connection in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('💥 All database connection attempts failed.');
        console.log('⚠️ Running app in degraded mode: Database queries will fail but app won\'t crash.');
      }
    }
  }
};

const getDBStatus = () => isConnected;

module.exports = {
  sequelize,
  connectDB,
  getDBStatus
};
