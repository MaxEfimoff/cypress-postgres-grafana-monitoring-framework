/* eslint-disable camelcase */

// exports.shorthands = undefined;

const db_name = 'db_cypress_api_monitor';
const db_tbl_name = 'tbl_api_status_details';

function up(pgm) {
  // pgm.sql(`
  //   CREATE DATABASE ${db_name}
  // `);

  pgm.sql(`
    CREATE TABLE ${db_tbl_name} (
      id SERIAL PRIMARY KEY,  
      serviceName VARCHAR(255),
      status INTEGER,
      responseTime INTEGER,
      time_executed TIMESTAMP WITH TIME ZONE
    );
  `);
}

function down(pgm) {
  pgm.sql(`
    DROP TABLE users;
  `);
}

module.exports = { up, down };
