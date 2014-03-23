'use strict';

var User = require('../models/user'),
    LocalStrategy = require('passport-local').Strategy;

exports.config = function (settings) {

};

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function () {

    return new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {

        //Retrieve the user from the database by email
        User.findOne({email: email}, function (err, user) {

            //If something weird happens, abort.
            if (err) {
                return done(err);
            }

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                return done(null, false, { message: 'Login not found' });
            }

            //Make sure that the provided password matches what's in the DB.
            if (!user.passwordMatches(password)) {
                return done(null, false, { message: 'Incorrect Password' });
            }

            //If everything passes, return the retrieved user object.
            done(null, user);

        });
    });
};

/**
 * A helper method to determine if a user has been authenticated, and if they have the right role.
 * If the user is not known, redirect to the login page. If the role doesn't match, show a 403 page.
 * @param role The role that a user should have to pass authentication.
 */
exports.check = function (role) {

    return function (req, res, next) {

        if (!req.isAuthenticated()) {
            return res.apiAuth("Please login to continue");
        }

        // //If a role was specified, make sure that the user has it.
        // if (role && req.user.role !== role) {
        //     res.status(401);
        //     res.render('errors/401');
        //     return;
        // }

        next();
    };
};
