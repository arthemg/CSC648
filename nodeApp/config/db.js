var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
   // user     : 'root',
   // password : 'b795fk99sw', //set password if there is one
   // database : 'test', //set DB name here
    user     : 'root',
    password : '5191', //set password if there is one
    database : 'test', //set DB name here
    debug    : false //set true if you wanna see debug logger
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
