// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    // app.get('/', function(req, res) {
    //     res.render('index.ejs'); // load the index.ejs file
    // });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/api/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/api/login', passport.authenticate('local-login', {
            // successRedirect : '/fa17g12/api/profile', // redirect to the secure profile section
            successRedirect : '/fa17g12/api/profile', // redirect to the secure profile section
            failureRedirect : '/api/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            console.log(res, "RESPONSE");
            // res.redirect('/fa17g12/');
            res.redirect('/fa17g12/');
        });

    app.use(function (req, res, next) {
        res.locals.login = req.isAuthenticated();
        res.locals.users = JSON.stringify(req.user);
        // console.log(res.locals.users);
        next();
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    // app.get('/signup', function(req, res) {
    //     // console.log("rendered signup");
    //     // render the page and pass in any flash data if it exists
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });

    // // process the signup form
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect : '/profile', // redirect to the secure profile section
    //     failureRedirect : '/signup', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/api/profile', isLoggedIn, function(req, res) {
        console.log(req.user, "We got it REquset");
        console.log("WE GOT IT");
        app.locals = {
            isSeller: req.user.seller,
            user_id: req.user.user_id
        };
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/api/logout', function(req, res) {
        app.locals = {};
        req.logout();
        // res.redirect('/fa17g12/');
        res.redirect('/fa17g12/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    // res.redirect('/fa17g12/');
    res.redirect('/fa17g12/');
}
