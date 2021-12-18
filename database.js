const mysql=require('mysql');


const connection=mysql.createConnection({
    host:'localhost',
    database:'donationportal',
    user:'root',
    password:'mysql123',
    port: '3307'
});

module.exports=connection;