const start = async () => {

var fs = require("fs");
var jp = require('jsonpath');
const pg = require('pg');


// Get content from file
var contents = fs.readFileSync("./cypress/results/mochawesome.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);

var testExecutionTime = jp.query(jsonContent, '$.stats.start').toString();
testExecutionTime = testExecutionTime.replace('T', ' ')
testExecutionTime = testExecutionTime.slice(0,-5)

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
  var resultsArray = jp.query(jsonContent, '$..results[0].suites[0].tests[*]');

    for (let index = 0; index < resultsArray.length; index++) {

      var serviceNameValue = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].title');
      var statusValue = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].state');
      if(statusValue=="passed"){
        statusValue = 200
      }
      else{
        statusValue = 500
      }
      var responseTimeValue = jp.query(jsonContent, '$.results[0].suites[0].tests['+index+'].duration');

      console.log("Service Names ", serviceNameValue);
      console.log("Status ", statusValue);
      console.log("Response Time", parseInt(responseTimeValue[0]));

    
      //const sql = "INSERT INTO tbl_api_status_details (serviceName, status, responseTime, time_executed) VALUES ('"+serviceNameValue+"','"+ statusValue+"','"+ responseTimeValue+"','"+testExecutionTime+"')";
      // con.query(sql, function (err, result) {
      // if (err) throw err;
      //     // console.log("1 record inserted");
      // });
      const { rows } = await pool.query(`
          INSERT INTO tbl_api_status_details ( serviceName, status, responseTime, time_executed)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `, [serviceNameValue, statusValue, parseInt(responseTimeValue[0]), testExecutionTime]);
      console.log(rows)
    }
  }catch (err) {
    console.log(err);
  }
}

start();