const express = require('express');
const shortid = require('shortid');
const validUrl = require('valid-url');
const pool = require('./db');

const app = express();
app.use(express.json());

// ROUTES
// POST: Create Short URL Code
app.post('/create-short-url', async (req, res) => {
  try {
    const longUrl = req.body.url;
    if (validUrl.isUri(longUrl)) {
      // Insert check if url already in DB
      const getUrlResults = await pool.query(
        `SELECT short_url FROM links WHERE long_url='${longUrl}' LIMIT 1`
      );
      if (getUrlResults.rows.length != 0) {
        return res.json({
          message: `URL was shortened before. Short URL Code is: ${getUrlResults.rows[0].short_url}`,
          type: 'success',
        });
      }
      // If not in DB, create Short URL Code
      const shortUrlCode = shortid.generate();
      const newUrl = await pool.query(
        `INSERT INTO links(long_url,short_url) VALUES ('${longUrl}', '${shortUrlCode}')`
      );
      res.json({
        message: `${shortUrlCode}`,
        type: 'success',
      });
    } else {
      return res.json({ message: 'Invalid URL', type: 'failure' });
    }
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

// GET: Redirection
app.get('/:shortUrlCode', async (req, res) => {
  try {
    let shortUrlCode = req.params.shortUrlCode;
    const longUrl = await pool.query(
      `SELECT long_url FROM links WHERE short_url='${shortUrlCode}' LIMIT 1`
    );
    res.redirect(longUrl.rows[0].long_url);
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`URL Shortener server started, listening at PORT ${PORT}`)
);
