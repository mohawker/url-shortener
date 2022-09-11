const express = require('express');
const shortid = require('shortid');
const validUrl = require('valid-url');
const cors = require('cors');
const pool = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// CLIENT
if (process.env.NODE_ENV === 'production') {
  //server static content
  //npm run build
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// ROUTES
// POST: Create short_url Code given long_url
app.post('/api/create-short-url', async (req, res) => {
  try {
    const longUrl = req.body.url;
    if (validUrl.isUri(longUrl)) {
      // Check
      const getUrlResults = await pool.query(
        `SELECT short_url FROM links WHERE long_url='${longUrl}' LIMIT 1`
      );
      if (getUrlResults.rows.length != 0) {
        const shortUrl = getUrlResults.rows[0].short_url;
        return res.json({
          message: `URL was shortened before. Short URL is: ${shortUrl}`,
          short_url: shortUrl,
          type: 'success',
        });
      }
      // If not in DB, create Short URL Code
      const shortUrlCode = shortid.generate();
      const shortUrl =
        req.protocol + '://' + req.get('host') + '/' + shortUrlCode;
      await pool.query(
        `INSERT INTO links(long_url,short_url_code,short_url) VALUES ('${longUrl}', '${shortUrlCode}', '${shortUrl}')`
      );
      res.json({
        message: `Long URL ${longUrl} shortened to Short URL ${shortUrl}`,
        short_url: shortUrl,
        type: 'success',
      });
    } else {
      return res.json({ message: 'Invalid URL', type: 'failure' });
    }
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

// GET: Redirect user to Long URL
app.get('/:code', async (req, res) => {
  try {
    let shortUrlCode = req.params.code;
    const longUrl = await pool.query(
      `SELECT long_url FROM links WHERE short_url_code='${shortUrlCode}' LIMIT 1`
    );
    res.redirect(longUrl.rows[0].long_url);
  } catch (err) {
    return res.json({ message: `Error Message: ${err}`, type: 'failure' });
  }
});

// Catch all other invalid routes and redirect to homepage
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`URL Shortener server started, listening at PORT ${PORT}`)
);
