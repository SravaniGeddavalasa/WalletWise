// Re-export db configuration from src/config/db.js for root config/db.js support
const dbConfig = require('../src/config/db');

module.exports = dbConfig;
