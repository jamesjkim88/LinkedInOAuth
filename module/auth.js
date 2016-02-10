// API Access link for creating client ID and secret:
// https://www.linkedin.com/secure/developer

var config = require("../config");
var session = require("express-session");

var LINKEDIN_CLIENT_ID = config.LINKEDIN_CLIENT_ID;
var LINKEDIN_CLIENT_SECRET = config.LINKEDIN_CLIENT_SECRET;
var LINKEDIN_CALLBACK_URL = config.LINKEDIN_CALLBACK_URL;

var passport = require("passport");
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


module.exports = function(app){

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new LinkedInStrategy({
            clientID:     LINKEDIN_CLIENT_ID,
            clientSecret: LINKEDIN_CLIENT_SECRET,
            callbackURL:  LINKEDIN_CALLBACK_URL,
            scope:        [ 'r_basicprofile', 'r_emailaddress', 'w_share', 'rw_company_admin'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            req.session.accessToken = accessToken;
            process.nextTick(function () {
                // To keep the example simple, the user's Linkedin profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Linkedin account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));

    app.use(session({secret: "keyboard cat", resave: true, saveUninitialized: true}));

    app.use(passport.initialize());
    app.use(passport.session());

app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE' }),
    function(req, res){

    });

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function(req, res) {
        console.log("req.user :", req.user);
        res.redirect('/');
    });

    app.get('/account', ensureAuthenticated, function(req, res){
        res.status(200).json({ user: req.user });
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    }

};

