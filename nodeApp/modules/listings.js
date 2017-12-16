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
    req.assert('price', 'Price is required').notEmpty();
    req.assert('beds', 'Number of Bedrooms is required').notEmpty();
    req.assert('bath', 'Number of Bathrooms is required').notEmpty();
    req.assert('area', 'Area is required').notEmpty();
    req.assert('description', 'Description is required').notEmpty();
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
            price: req.body.price,
            beds: req.body.beds,
            bath: req.body.bath,
            area: req.body.area,
            description: req.body.description,
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
	var returning = true;

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
	
	
	var queryString = "SELECT * FROM listings WHERE city LIKE ? OR address LIKE ? OR zip_code LIKE ? OR state LIKE ? "
	var filter = [searchWord, searchWord, searchWord, searchWord];
	
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

    var queryString = 'SELECT * FROM listings WHERE listing_id = ?; SELECT * FROM property_images WHERE listing_id = ?; '


    var query = dbConnection.query(queryString,[listing_id, listing_id], function (err, rows) {

        if (err) {
            console.log(err);
            return next("Mysql error, check your query");
        }

        console.log(rows, "ROWS");
        res.render('listing_description', {title: "Listing Description", data: rows[0], images: rows[1]});
        // res.render('all_listings', {title: "Dashboard", data: rows[0], messages: rows[1]});
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
	
	
	var queryString = "SELECT * FROM listings WHERE city LIKE ? OR address LIKE ? OR zip_code LIKE ? OR state LIKE ? "
	var filter = [searchWord, searchWord, searchWord, searchWord];
	
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


var upLoadMulPics = function (req,res,next)
{
    var listing = req.params.listing_id;

        if (req.files.length === 0) {
            res.status(422).json([{param: 'name', msg: "Please select up to 3 files to upload!"}]);
            return;
        }

        var sql = "INSERT INTO property_images (listing_id, images) VALUES ?";
        var values = [];

    for (var i = 0; i < req.files.length; i++) {
        var filePath = req.files[i].path + ".jpg";
        var arr = []
        arr.push(listing);
        arr.push('../images/upload_images/'+ req.files[i].filename + '.jpg');
        values.push(arr)
        fs.rename(req.files[i].path, filePath, function (err) {
            if (err) {
                console.log(err, 'err');
            }

        })


    }

    dbConnection.query(sql, [values], function (err) {
        if(err) throw err;
        res.status(200).json([{param: 'name', msg: "Files Uploaded Successfully!"}]);
    })

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
	returnToSearch: returnToSearch,
    upLoadMulPics:upLoadMulPics
}