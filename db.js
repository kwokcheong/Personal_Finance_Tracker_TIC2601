const mysql = require('mysql2');
//This is to read from the initialize.sql in the db, you can use it to read from the sql.
// const fs = require('fs');
// const datasql = fs.readFileSync('./database/Initialize.sql').toString();
require('dotenv').config()

let db;
//MySql Database Connection
  function connectDatabase() {
    if (!db) {
        db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: 'crud_express'
          });

        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();