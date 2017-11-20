var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator'),
    users = require('./modules/users'),
    listings = require('./modules/listings'),
    multer = require('multer'),
    upload = multer({dest: "./public/images/upload_images"}),
    fs = require('fs'),
    passport = require('passport');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); //support x-www-form-urlencoded
app.use(bodyParser.json({}));
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'b795fk99sw', //set password if there is one
        database : 'test', //set DB name here
        // user     : 'fa17g12',
        // password : 'csc648fa17g12', //set password if there is one
        // database : 'fa17g12', //set DB name here
        debug    : false //set true if you wanna see debug logger
    },'request')

);

//Get home page
app.get('/',function(req,res){
	req.getConnection(function(err,conn){

		if (err) return next("Cannot Connect");

		var query = conn.query('SELECT * FROM listings ',function(err,rows){

			if(err){
				console.log(err);
				return next("Mysql error, check your query");
			}

			res.render('index',{title:"Bay Real Estate",data:rows});
		});
	});
});

app.get('/login', function(req, res){
    res.render('login',{title:"Login Page", message:''});
})

app.get('/signup', function(req, res){
    res.render('signup',{title:"SignUp Page", message:''});
})


//Get pages before router

//RESTful route
var router = express.Router();


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

//USERS EXTERNAL MODULES
app.get('/api/user', users.getAllUsers);
app.post('/api/user', users.addNewUser);
app.get('/search_users', users.getSearchUsersPage);
app.post('/search/:user', users.searchUser);
app.get('/api/user/:user_id', users.getUserToEdit);
app.put('/api/user/:user_id', users.updateUserInfo);
app.delete('/api/user/:user_id', users.deleteUser);

//LISTINGS EXTERNAL MODULES
app.get('/api/listings', listings.getAllListings);
app.get('/api/add_listing', listings.getAddListingPage);
app.post('/api/add_listing', upload.single('photo'), listings.addNewListing);
app.post('/fa17g12/search_listings/:listing', listings.searchListing);
app.get('/api/listings/:listing_id', listings.getListingToEdit);
app.put('/api/listings/:listing_id', upload.single('photo'), listings.updateListingInfo);
app.delete('/api/listings/:listing_id', listings.deleteListing);
app.get('/api/listing_description/:listing_id', listings.getDescription);


//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(17012,function(){

   console.log("Listening to port %s",server.address().port);

});
