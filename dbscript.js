const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config()

const dbscript = () => {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    db.connect(function(err) {
        if (err) throw err;
        db.query("CREATE DATABASE IF NOT EXISTS crud_express", function (err, result) {
          if (err) throw err;
          console.log("Database created");
        });
      });

    const dataArr = fs.readFileSync('database/Initialize.sql').toString().replace(/\n/g, '').replace(/\t/g, '').split(';');
    
    dataArr.forEach(sql => {
        if(sql != ''){
        db.query(sql, function(err){
            if(err) throw err;
            console.log(sql + '\n');
        })
    }
    });
};

module.exports = dbscript();