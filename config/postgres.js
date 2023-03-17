const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'host.docker.internal',
  database: 'lms',
  password: 'password',
  port: 5432,
});

module.exports = pool;