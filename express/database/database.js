const mysql = require("mysql2");


//https://adi22maurya.medium.com/mysql-createconnection-vs-mysql-createpool-in-node-js-42a5274626e7
const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE,
    multipleStatements:true,
})

pool.getConnection((err, conn) => {
    if(err) console.log(err)
    else console.log("MySql Database Connected successfully")
})

module.exports = pool.promise()