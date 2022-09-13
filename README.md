# url-shortener

URL Shortening Client &amp; Service built with React.js, Node.js and PostgreSQL
Input any valid URL and the webpage will return a shortened URL string which will redirect you back to the original URL.  

Both server and client are hosted on Heroku at https://shorten-this-url-please.herokuapp.com/

## Instructions (to run locally)
### BE Server
- Clone the repo
- Install PosgreSQL on your own local machine (https://www.postgresql.org/download/) 
- Create an `.env` file in the root directory of the repo with the following details:
```
PG_USER = <YOUR USERNAME>
PG_HOST = <YOUR HOST>
PG_PORT = <YOUR PORT>
PG_DATABASE =<YOUR DATABASE NAME>
```
The server will use your local database to store the tables necessary. 
- Connect to your database and create the DB + tables with the commands provided in the `database.sql` file in the repo
- Run `node index.js` in the root directory to start the server on localhost

### FE Client
- `cd client` - Enter the client directory from the root directory
- `npm run start` - To start the client on https://localhost:3000

## Demo

## Architecture
Node.js was used for the backend server, with a postgreSQL database. The database has two tables, *teams* and *matches*

The schema (including constraints) for each of the postgreSQL database can be found below: 
```
CREATE TABLE links(
  id SERIAL PRIMARY KEY,
  long_url VARCHAR (255) UNIQUE NOT NULL,
  short_url_code VARCHAR (255) UNIQUE NOT NULL,
  short_url VARCHAR (255) UNIQUE NOT NULL
);

```
