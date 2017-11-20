var express = require('express');
var dbConnection = require('../config/db');

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

   // });

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
        password:req.body.password
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
    console.log(user, 'user');


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

        console.log(req.params, 'User Id in updateUser');

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


module.exports = {
    getAllUsers: getAllUsers,
    addNewUser:addNewUser,
    searchUser:searchUser,
    getUserToEdit:getUserToEdit,
    updateUserInfo:updateUserInfo,
    deleteUser:deleteUser,
	getSearchUsersPage:getSearchUsersPage
};
