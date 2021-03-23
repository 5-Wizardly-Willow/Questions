// get the client
const mysql = require('mysql2/promise');

const ENV = process.env;
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: ENV.MYSQL_HOST,
  user: ENV.MYSQL_USER,
  database: 'questionsdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;