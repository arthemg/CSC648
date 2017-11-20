var express = require('express');
var fs = require('fs');

var getAllListings = function (req,res,next) {
        req.getConnection(function(err,conn){

            if (err) return next("Cannot Connect");

            var query = conn.query('SELECT * FROM listings ',function(err,rows){

                if(err){
                    console.log(err);
                    return next("Mysql error, check your query");
                }

                res.render('all_listings',{title:"RESTful Crud Example",data:rows});

            });

        });
};

var getAddListingPage = function(req,res) {
    res.render('add_listing', {data:[]});
};

var addNewListing = function (req,res,next) {
    //validation
    req.assert('address','Address is required').notEmpty();
    req.assert('city','City is required').notEmpty();
    req.assert('state','State is required').len(2,2);
    req.assert('zip_code','Enter a zip code of 5 numbers').len(5,5);

    var errors = req.validationErrors();

    if(errors){
        if(!req.files){
            var error = {param: 'name', msg: "Please select file to upload!"};
            errors.push(error);
        }
        res.status(422).json(errors);
        return;
    }

    fs.rename(req.file.path,req.file.path + ".jpg", function(err) {
        if (err) {
            console.log(err, 'err');
        }


        var file = req.file;
        var db_img_address = '../images/upload_images/'+ file.filename + '.jpg';

        //get data
        var data = {
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            zip_code:req.body.zip_code,
            image: db_img_address
        };


        //inserting into mysql
        req.getConnection(function (err, conn) {

            if (err) return next("Cannot Connect");

            var query = conn.query("INSERT INTO listings set ? ", data, function (err, rows) {

                if (err) {
                    console.log(err);
                    return next("Mysql error, check your query");
                }
            });

            res.sendStatus(200);

        });
    });


};

var searchListing = function (req,res,next){

        var listing = req.params.listing;

        req.getConnection(function(err,conn)
        {

            if (err) return next("Cannot Connect");

            var query = conn.query("SELECT * FROM listings WHERE city LIKE ? ", listing[0] + listing[1] + listing[2] + "%", function(err,rows){

                if(err){
                    console.log(err);
                    return next("Mysql error, check your query");
                }

                //if listing not found
                if(rows.length < 1)
                    return res.send("Listing not found.");

                res.render('index',{data:rows});
            });

        });

};

var getListingToEdit = function(req, res,next){
	
	var listing_id = req.params.listing_id;

	req.getConnection(function(err,conn){

		if (err) return next("Cannot Connect");

		var query = conn.query("SELECT * FROM listings WHERE listing_id = ? ",[listing_id],function(err,rows){

			if(err){
				console.log(err);
				return next("Mysql error, check your query");
			}

			//if listing not found
			if(rows.length < 1)
				return res.send("Listing Not found");

			res.render('edit_listing',{title:"Edit listing",data:rows});
		});

	});

};

var updateListingInfo = function (req, res, next) {
    var listing_id = req.params.listing_id;

    //validation
    req.assert('address', 'Address is required').notEmpty();
    req.assert('city', 'City is required').notEmpty();
    req.assert('state', 'State is required').notEmpty();
    req.assert('zip_code', 'Enter a zip code of 5 numbers').len(5, 5);

    var errors = req.validationErrors();

    if (errors) {
        if (!req.files) {
            var error = {param: 'name', msg: "Please select file to upload!"};
            errors.push(error);
        }
        res.status(422).json(errors);
        return;
    }

    fs.rename(req.file.path, req.file.path + ".jpg", function (err) {
        if(err){
            console.log(err, 'err');
        }

        var file = req.file;
        var db_img_address = '../images/upload_images/' + file.filename + '.jpg';


        //get data
        var data = {
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            image: db_img_address

        };

        //inserting into mysql
        req.getConnection(function (err, conn) {

            if (err) return next("Cannot Connect");

            var query = conn.query("UPDATE listings set ? WHERE listing_id = ? ", [data, listing_id], function (err, rows) {

                if (err) {
                    console.log(err);
                    return next("Mysql error, check your query");
                }

                res.sendStatus(200);

            });

        });
    });
};

var deleteListing = function(req,res,next){

    var listing_id = req.params.listing_id;

    req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM listings  WHERE listing_id = ? ",[listing_id], function(err, rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.sendStatus(200);

        });
        //console.log(query.sql);

    });
};

var getDescription = function(req, res, next){
	
	var listing_id = req.params.listing_id;

	req.getConnection(function(err,conn){

		if (err) return next("Cannot Connect");

		var query = conn.query("SELECT * FROM listings WHERE listing_id = ? ",[listing_id],function(err,rows){

			if(err){
				console.log(err);
				return next("Mysql error, check your query");
			}

			//if listing not found
			if(rows.length < 1)
				return res.send("Listing Not found");

			res.render('listing_description',{title:"Listing Description",data:rows});
		});

	});

};

module.exports = {
    getAllListings:getAllListings,
    addNewListing:addNewListing,
    searchListing:searchListing,
    getListingToEdit:getListingToEdit,
    updateListingInfo:updateListingInfo,
    deleteListing:deleteListing,
	getDescription:getDescription,
	getAddListingPage:getAddListingPage
}