const start = async () => {

const fs = require("fs");
const jp = require('jsonpath');
const pg = require('pg');


// Get content from file
// const contents = fs.readFileSync("./cypress/results/mochawesome.json");
const contents = fs.readFileSync("./cypress/results/testresults.json");
// Define to JSON type
const jsonContent = JSON.parse(contents);

const testExecutionTime = jp.query(jsonContent, '$.results');
console.log(testExecutionTime[0].length);

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

  // Extract and Iterate
  const resultsArray = jp.query(jsonContent, '$.results');

    for (let index = 0; index < resultsArray[0].length; index++) {

      const testNameValue = jp.query(jsonContent, '$.results['+index+'].name');
      const responseTimeValue = jp.query(jsonContent, '$.results['+index+'].time');
      const timestampValue = jp.query(jsonContent, '$.results['+index+'].timestamp');

      console.log(testNameValue)
      console.log(responseTimeValue)
    
      const { rows } = await pool.query(`
        INSERT INTO tbl_api_status_details ( serviceName, status, responseTime, time_executed)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [testNameValue, null, parseInt(responseTimeValue[0]), timestampValue]);
    }
  }catch (err) {
    console.log(err);
  }
}

start();