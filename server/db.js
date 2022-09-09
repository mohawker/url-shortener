const { Pool } = require('pg');

// Replace Pool details with process.env for cloud deployment
const pool = new Pool({
  host: 'localhost',
  user: 'mohawker',
  port: 5432,
  database: 'mohawker',
});

module.exports = pool;
