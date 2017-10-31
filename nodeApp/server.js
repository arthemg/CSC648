var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator'),
    users = require('./modules/users'),
    listings = require('./modules/listings');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'fa17g12',
        password : 'csc648fa17g12', //set password if there is one
        database : 'fa17g12', //set DB name here
        debug    : false //set true if you wanna see debug logger
    },'request')

);

//Get home page
app.get('/',function(req,res){
    res.render('index', {data:[]});
});

app.get('/search_listings',function(req,res){
    res.render('search_listings', {data:[]});
});


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
app.post('/search/:user', users.searchUser);
app.get('/api/user/:user_id', users.getUserToEdit);
app.put('/api/user/:user_id', users.updateUserInfo);
app.delete('/api/user/:user_id', users.deleteUser);

//LISITNGS EXTERNAL MODULES
app.get('/api/listings', listings.getAllListings);
app.post('/api/listings', listings.addNewListing);
app.post('/searchListings/:listing', listings.searchListing);
app.get('/api/listings/:listing_id', listings.getListingToEdit);
app.put('/api/listings/:listing_id', listings.updateListingInfo);
app.delete('/api/listings/:listing_id', listings.deleteListing);

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(17012,function(){

   console.log("Listening to port %s",server.address().port);

});
