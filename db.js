const { Pool } = require('pg');
require('dotenv').config();

// Replace Pool details with process.env for cloud deployment
const devConfig = {
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
};

const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig
);

const getShortUrl = async (longUrl) => {
  let shortUrl;
  const res = await pool.query(
    `SELECT short_url FROM links WHERE long_url='${longUrl}' LIMIT 1`
  );
  if (res.rows.length != 0) {
    shortUrl = res.rows[0].short_url;
  }
  return shortUrl;
};

const insertLinkEntry = async (longUrl, shortUrl, shortUrlCode) => {
  await pool.query(
    `INSERT INTO links(long_url,short_url_code,short_url) VALUES ('${longUrl}', '${shortUrlCode}', '${shortUrl}')`
  );
};

const getLongUrl = async (shortUrlCode) => {
  const res = await pool.query(
    `SELECT long_url FROM links WHERE short_url_code='${shortUrlCode}' LIMIT 1`
  );
  return res.rows[0].long_url;
};

exports.getShortUrl = getShortUrl;
exports.insertLinkEntry = insertLinkEntry;
exports.getLongUrl = getLongUrl;
