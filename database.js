const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    database: 'donationportal',
    user: 'root',
    password: 'saad123',
    port: '3306'
});

module.exports = connection;