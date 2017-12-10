var express = require('express');
var fs = require('fs');
var dbConnection = require('../config/db');

var getAllListings = function (req, res, next) {
    var id = req.app.locals.user_id;
	
	var queryString = 'SELECT * FROM listings WHERE user_id = ?; SELECT * FROM messages WHERE user_id = ?; '

	
	var query = dbConnection.query(queryString,[id, id], function (err, rows) {

		if (err) {
			console.log(err);
			return next("Mysql error, check your query");
		}
			
		res.render('all_listings', {title: "Dashboard", data: rows[0], messages: rows[1]});
	});
};

var getAddListingPage = function (req, res) {
    res.render('add_listing', {data: []});
};

var addNewListing = function (req, res, next) {
    console.log(req.app.locals, 'REQUEST APPP');
    //validation
    req.assert('address', 'Address is required').notEmpty();
    req.assert('city', 'City is required').notEmpty();
    req.assert('state', 'State is required').len(2, 2);
    req.assert('zip_code', 'Enter a zip code of 5 numbers').len(5, 5);

    var errors = req.validationErrors();

    if (errors) {
        if (!req.file) {
            var error = {param: 'name', msg: "Please select file to upload!"};
            errors.push(error);
        }
        res.status(422).json(errors);
        return;
    }

    fs.rename(req.file.path, req.file.path + ".jpg", function (err) {
        if (err) {
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
            image: db_img_address,
            user_id: req.app.locals.user_id
        };

		
		var query = dbConnection.query("INSERT INTO listings set ? ", data, function (err, rows) {

			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
		});

		res.sendStatus(200);
    });
};

var searchListing = function (req, res, next) {

    var listing = req.params.listing;
	var returning = false;

	//like search 1-4 characters
	var searchWord = "%";
	if (listing.length > 0 && listing.length < 5){
		
		for(i = 0; i < listing.length; i++){
			searchWord = searchWord + listing[i];
		}
	}
	else{
		//like search maximum 5 characters
		searchWord = "%" + listing[0] + listing[1] + listing[2] + listing[3] + listing[4] + "%";
	}
	searchWord = searchWord + "%";
	
	
	var queryString = "SELECT * FROM listings WHERE city LIKE ? OR address LIKE ? OR zip_code LIKE ? "
	var filter = [searchWord, searchWord, searchWord];
	
	var query = dbConnection.query(queryString, filter, function (err, rows) {

		if (err) {
			console.log(err);
			return next("Mysql error, check your query");
		}

		//if listing not found
		if (rows.length < 1){
			//return res.send("Listing not found.");
		}

		res.render('index', {data: rows, returning: returning});
	});
};

var getListingToEdit = function (req, res, next) {

    var listing_id = req.params.listing_id;
	
	
	var query = dbConnection.query("SELECT * FROM listings WHERE listing_id = ? ", [listing_id], function (err, rows) {

		if (err) {
			console.log(err);
			return next("Mysql error, check your query");
		}

		//if listing not found
		if (rows.length < 1)
			return res.send("Listing Not found");

		res.render('edit_listing', {title: "Edit listing", data: rows});
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
        if (!req.file) {
            var error = {param: 'name', msg: "Please select file to upload!"};
            errors.push(error);
        }
        res.status(422).json(errors);
        return;
    }

    fs.rename(req.file.path, req.file.path + ".jpg", function (err) {
        if (err) {
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
		

		var query = dbConnection.query("UPDATE listings set ? WHERE listing_id = ? ", [data, listing_id], function (err, rows) {

			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}

			res.sendStatus(200);

		});
    });
};

var deleteListing = function (req, res, next) {

    var listing_id = req.params.listing_id;


	var query = dbConnection.query("DELETE FROM listings  WHERE listing_id = ? ", [listing_id], function (err, rows) {

		if (err) {
			console.log(err);
			return next("Mysql error, check your query");
		}

		res.sendStatus(200);

	});
};

var getDescription = function (req, res, next) {

    var listing_id = req.params.listing_id;

	
	var query = dbConnection.query("SELECT * FROM listings WHERE listing_id = ? ", [listing_id], function (err, rows) {

		if (err) {
			console.log(err);
			return next("Mysql error, check your query");
		}

		//if listing not found
		if (rows.length < 1){
			return res.send("Listing Not found");
		}

		res.render('listing_description', {title: "Listing Description", data: rows});
	});
};

var returnToSearch = function (req, res, next) {

    var listing = req.params.requery;
	var returning = true;
	
	var searchWord = "%";
	if (listing.length > 0 && listing.length < 5){
		
		for(i = 0; i < listing.length; i++){
			searchWord = searchWord + listing[i];
		}
	}
	else{
		searchWord = "%" + listing[0] + listing[1] + listing[2] + listing[3] + listing[4] + "%";
	}
	searchWord = searchWord + "%";
	
	
	var queryString = "SELECT * FROM listings WHERE city LIKE ? OR address LIKE ? OR zip_code LIKE ? "
	var filter = [searchWord, searchWord, searchWord];
	
	var query = dbConnection.query(queryString, filter, function (err, rows) {

		if (err) {
			console.log(err);
			return next("Mysql error, check your query");
		}

		//if listing not found
		if (rows.length < 1) {
			return res.send("Listing not found.");
		}

		res.render('index', {title: "Search", data: rows, returning: returning});
	});
};

module.exports = {
    getAllListings: getAllListings,
    addNewListing: addNewListing,
    searchListing: searchListing,
    getListingToEdit: getListingToEdit,
    updateListingInfo: updateListingInfo,
    deleteListing: deleteListing,
    getDescription: getDescription,
    getAddListingPage: getAddListingPage,
	returnToSearch: returnToSearch
}