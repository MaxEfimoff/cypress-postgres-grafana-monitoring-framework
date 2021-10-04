const start = async () => {
const pg = require('pg');
const async = require('async');
const { execSync } = require('child_process');

class Pool {
  _pool = null;

  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1 + 1;");
  }

  close() {
    return this._pool.end();
  }

  query(sql, params) {
    return this._pool.query(sql, params);
  }
}

const pool = new Pool();

const PGDATABASE = 'postgres';
const PGUSER = 'postgres';
const PGPASSWORD = 'pgpassword';
const PGHOST = 'localhost';
const PGPORT = '5432';

try{
// Postgres Client Setup
await pool.connect({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password:  PGPASSWORD,
  port: PGPORT,
});

console.log('Connected to POSTGRES_DB');

// Run Postgres migrations
async.series([
  () =>
    execSync(`
    DATABASE_URL=${PGDATABASE}://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/postgres npm run migrate up
  `),
]);
}catch (err) {
  console.log(err);
  new DatabaseConnectionError();
}}

start();