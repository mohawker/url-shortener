const { Pool } = require('pg');
require('dotenv').config();

// Replace Pool details with process.env for cloud deployment
const devConfig = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});

const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig
);

module.exports = pool;
