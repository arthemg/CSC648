// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
// var dbconfig = require('./passportDBConfig');
// var connection = mysql.createConnection(dbconfig.connection);
//
// connection.query('USE ' + dbconfig.database);
var dbConnection = require('./db');
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        // console.log(user.user_id, "USERRRRRRRR");
        // var user = user.user_id;
        // app.locals.user;
         done(null, user.user_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        dbConnection.query("SELECT * FROM t_user WHERE user_id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    // console.log("REQ1");
    // passport.use('local-signup', new LocalStrategy({
    //             // by default, local strategy uses username and password, we will override with email
    //             usernameField : 'username',
    //             passwordField : 'password',
    //             passReqToCallback : true //console.log(passport.usernameField, 'Username' ) // allows us to pass back the entire request to the callback
    //         },
    //         function(req, fname, lname, phone,username, password, done) {
    //         //console.log(req,"REQ");
    //             // find a user whose email is the same as the forms email
    //             // we are checking to see if the user trying to login already exists
    //             dbConnection.query("SELECT * FROM t_user WHERE email = ?",[username], function(err, rows) {
    //                 //console.log(rows.length, "After query ROWS LENGHT");
    //                 if (err)
    //                     return done(err);
    //                 if (rows.length) {
    //                     //console.log(rows.length, "ROWS LENGHT");
    //                     return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
    //                 } else {
    //                     // if there is no user with that username
    //                     // create the user
    //                     // if($('#seller').is(":checked"))
    //                     // {
    //                     //     var seller = 1;
    //                     // }
    //                     // else
    //                     // {
    //                     //     var seller = 0;
    //                     // }
    //                     var newUserMysql = {
    //                         // fname: $('#fname').val(),
    //                         // lname: $('#lname').val(),
    //                         // phone: $('#phone').val(),
    //                         fname: fname,
    //                         lname: lname,
    //                         phone: phone,
    //                         username: username,
    //                         password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
    //                         // sellerCheck: seller,
    //                         // licenseNum: license
    //                         // sellerCheck: seller,
    //                         // licenseNum : $('#license').val()
    //                     };
    //                     console.log(fname, 'fname');
    //                     console.log(lname, 'lname');
    //                     console.log(phone, 'phone');
    //                     console.log(username, 'username');
    //                     console.log(password, 'password');
    //
    //                     var insertQuery = "INSERT INTO t_user (name, email, password, lname, phone ) values (?,?,?,?,?)";
    //
    //                     dbConnection.query(insertQuery,[newUserMysql.fname,newUserMysql.username, newUserMysql.password,newUserMysql.lname, newUserMysql.phone],function(err, rows) {
    //                         newUserMysql.user_id = rows.insertId;
    //
    //                         return done(null, newUserMysql);
    //                     });
    //                 }
    //             });
    //         })
    // );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'username',
                passwordField : 'password',
                passReqToCallback : true// allows us to pass back the entire request to the callback
                //passReqToCallback: console.log(LocalStrategy.usernameField, "USERNAME");
            },
            function(req, username, password, done) { // callback with email and password from our form
                // console.log(req, "LOGIN REQ");
                dbConnection.query("SELECT * FROM t_user WHERE email = ?",[username], function(err, rows){
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};