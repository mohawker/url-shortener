CREATE DATABASE url_shortener_db;

CREATE TABLE links(
  id SERIAL PRIMARY KEY,
  long_url VARCHAR (255) UNIQUE NOT NULL,
  short_url_code VARCHAR (255) UNIQUE NOT NULL,
  short_url VARCHAR (255) UNIQUE NOT NULL
);
