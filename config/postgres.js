//for local env
// const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'me',
//   host: 'host.docker.internal',
//   database: 'lms',
//   password: 'password',
//   port: 5432,
// });

// module.exports = pool;

//for docker image and db stored in local env
// const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'me',
//   host: 'host.docker.internal',
//   database: 'lms',
//   password: 'password',
//   port: 5432,
// });

// module.exports = pool;

//for docker compose
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
});

module.exports = pool;