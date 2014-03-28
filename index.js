'use strict';


var kraken = require('kraken-js'),
    db = require('./lib/database'),
    auth = require('./lib/auth'),
    User = require('./models/user'),
    passport = require('passport'),
    apiResponse = require('./lib/apiResponse'),
    mailer = require('./lib/mailer'),
    app = {};


app.configure = function configure(nconf, next) {

    // Init database connection 
    // Takes config from config/app.json
    db.config(nconf.get("mongodb"));

    passport.use(auth.localStrategy());

    //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(null, user);
        });
    });

    // Config mail helper
    mailer.config(nconf.get("mail"));

    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
    
    server.use(apiResponse());

    server.use(passport.initialize());
    server.use(passport.session());
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
