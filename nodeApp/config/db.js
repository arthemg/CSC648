var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    // user     : 'root',
    // password : 'b795fk99sw', //set password if there is one
    // database : 'test', //set DB name here
    user     : 'git',
    password : 'csc648fa17g12', //set password if there is one
    database : 'fa17g12', //set DB name here
    debug    : false //set true if you wanna see debug logger
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;