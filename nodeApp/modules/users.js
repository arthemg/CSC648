var express = require('express');
var dbConnection = require('../config/db');
var bcrypt = require('bcrypt-nodejs');

var getAllUsers = function (req, res, next) {
    // req.getConnection(function (err, conn) {
    //
    //     if (err) return next("Cannot Connect");

        var query = dbConnection.query('SELECT * FROM t_user ', function (err, rows) {

            if (err) {
                console.log(err);
                return next("Mysql error, check your query");
            }

            //console.log(rows, 'rows'); //debug console output

            res.render('user', {title: "Users", data: rows});

        });
};

//post data to DB | POST
var addNewUser = function (req, res, next)
{

    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password, null, null)
    };

    //inserting into mysql
    // req.getConnection(function (err, conn)
    // {
    //
    //     if (err) return next("Cannot Connect");

        var query = dbConnection.query("INSERT INTO t_user set ? ",data, function(err, rows)
        {

            if (err)
            {
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.sendStatus(200);
        });
    //});
};

var getSearchUsersPage = function(req,res) {
    res.render('search_users', {data:[]});
};

var searchUser = function(req, res, next)
{
    var user = req.params.user;
    // console.log(user, 'user');


    // req.getConnection(function(err,conn)
    // {
    //
    //     if (err) return next("Cannot Connect");

        var query = dbConnection.query("SELECT * FROM t_user WHERE name LIKE ? ", user[0] + user[1] + user[2] + "%", function(err,rows)
        {

            if(err)
            {
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User not found.");
            //console.log(rows, 'rows'); //debug console output
            res.render('search_users',{data:rows});
        });

    //});

};


var getUserToEdit = function (req, res, next){

        var user_id = req.params.user_id;

        // req.getConnection(function(err,conn){
        //
        //     if (err) return next("Cannot Connect");

            var query = dbConnection.query("SELECT * FROM t_user WHERE user_id = ? ",[user_id],function(err,rows){

                if(err){
                    console.log(err);
                    return next("Mysql error, check your query");
                }

                //if user not found
                if(rows.length < 1)
                    return res.send("User Not found");
                //console.log(req.params, 'User Id params');
                res.render('edit_user',{title:"Edit user",data:rows});
            });

        //});


};

var updateUserInfo = function (req, res, next)
{
	var user_id = req.params.user_id;

	// console.log(req.params, 'User Id in updateUser');

    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
     };

    //inserting into mysql
    // req.getConnection(function (err, conn){
    //
    //     if (err) return next("Cannot Connect");

        var query = dbConnection.query("UPDATE t_user set ? WHERE user_id = ? ",[data,user_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     //});

};

var deleteUser = function (req, res, next) {

    var user_id = req.params.user_id;

     // req.getConnection(function (err, conn) {
     //
     //    if (err) return next("Cannot Connect");

        var query = dbConnection.query("DELETE FROM t_user  WHERE user_id = ? ",[user_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     //});
};

var getSignupForm = function(req, res){
    res.render('signup',{title:"SignUp Page", message:''});
};

var registerUser = function (req, res, next)
{
    console.log(req.body,"REQUEST");

    req.assert('first_name','First Name is required').notEmpty();
    req.assert('last_name','Last Name is required').notEmpty();
    req.assert('phone','Phone Number must have atleast 10 digits!', 'Should be numbers Only!').len(10, 20).isNumeric();
    req.assert('email','Email is required').isEmail();
    req.assert('password', 'Password is required', 'Must be at least 6 characters long').len(6, 20).notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.status(420).json(errors);
        return;
    }

    dbConnection.query("SELECT * FROM t_user WHERE email =?", [req.body.email], function(err, rows){
        if(err){
            console.log(err, 'Register SQL Check error');
            return next("Mysql error, check your query");

        }
        if(rows.length){
           res.status(420).json([{msg:'Email already exists'}]);
           return;
           //console.log("Mysql error, check your query");
        }
        else{
            var data = {
                name:req.body.first_name,
                email:req.body.email,
                password:bcrypt.hashSync(req.body.password, null, null),
                lname:req.body.last_name,
                phone:req.body.phone,
                seller:req.body.seller,
                license:req.body.license
            };

            dbConnection.query("INSERT INTO t_user set ? ",data, function(err, rows)
            {

                if (err)
                {
                    console.log(err);
                    return next("Mysql error, check your query");
                }

                res.sendStatus(200);
            });
        }

    })

};

var messageToSeller = function (req, res, next)
{
	console.log(req.body,"REQUEST");

    req.assert('name','Name is required').notEmpty();
    req.assert('phone','Phone Number must have atleast 10 digits!', 'Should be numbers Only!').len(10, 20).isNumeric();
    req.assert('email','Email is required').isEmail();
    req.assert('message', 'Message is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.status(420).json(errors);
        return;
    }

	var data = {
		name:req.body.name,
		phone:req.body.phone,
		email:req.body.email,
		message:req.body.message,
		user_id:req.params.user_id
	};

	dbConnection.query("INSERT INTO messages set ? ", data, function(err, rows)
	{

		if (err)
		{
			console.log(err);
			return next("Mysql error, check your query");
		}

		res.sendStatus(200);
	});
};

var deleteMessage = function (req, res, next) {

    var message_id = req.params.message_id;

    var query = dbConnection.query("DELETE FROM messages WHERE message_id = ? ",[message_id], function(err, rows){
		
		if(err){
			console.log(err);
			return next("Mysql error, check your query");
		}

		res.sendStatus(200);
	});
};

var getAdminPage = function (req, res, next) {

	var query = dbConnection.query('SELECT * FROM t_user; SELECT * FROM listings; ', function (err, rows) {

		if (err) {
			console.log(err);
			return next("Mysql error, check your query");
		}

		res.render('admin', {title: "Admin", data: rows[0], listings: rows[1]});

	});
};

module.exports = {
	getAdminPage: getAdminPage,
    getAllUsers: getAllUsers,
    addNewUser:addNewUser,
    searchUser:searchUser,
    getUserToEdit:getUserToEdit,
    updateUserInfo:updateUserInfo,
    deleteUser:deleteUser,
	getSearchUsersPage:getSearchUsersPage,
    getSignupForm:getSignupForm,
    registerUser:registerUser,
	messageToSeller:messageToSeller,
	deleteMessage:deleteMessage
};
