'use strict';


var kraken = require('kraken-js'),
    settings = require('./config/app'),
    mongoose = require('mongoose'),
    app = {};


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.

    // Connecto to MongoDB
    mongoose.connect(
        settings.mongodb.host,
        settings.mongodb.name,
        settings.mongodb.port,
        {
            user: settings.mongodb.user,
            pass: settings.mongodb.pass
        }
    );
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
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
