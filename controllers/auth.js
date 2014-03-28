'use strict';


var User = require('../models/user'),
    Profile = require('../models/profile'),
    async = require('async'),
    auth = require('../lib/auth'),
    passport = require('passport');


module.exports = function(app) {


    /**
     * Get the currently logged in user
     */
    app.get('/api/me', auth.check(), function(req, res) {
      return res.apiSuccess({ user: req.user });
    });


    /**
     * Register a new user
     */
    app.post('/api/register', function(req, res) {

      async.waterfall([

        // Check if the account already exists
        function(callback) {

          User.findOne({ email: req.body.email }).exec(function(err, user) {

            if ( ! err && user ) {  
              return res.apiError("An account already exists for that email address");
            }

            callback(null);
          });
          
        },

        // Create the profile
        function(callback) {

          var profile = new Profile(req.body.profile);

          profile.save(function(err) {
            if (err) {
              return res.apiError("Unknown error... Ooops");
            }

            callback(null, profile);
          });

        },

        // Create the account
        function(profile, callback) {

          delete req.body.profile;
          req.body.profile = profile._id;

          var user = new User(req.body);
          user.provider = 'local';

          user.save(function (err) {
            if (err) {
              return res.apiError("Unknown error... Ooops");
            }

            callback(null, user);
          });

        }

      ], function(err, user) {
        // Everything was completed
          return res.apiSuccess("Your account has been created successfully", { user: user });
      });
      
    });


    /**
     * Login
     */
    app.post('/api/login', function(req, res) {

      passport.authenticate('local', function(err, user, info) {

        if (err) {
          return res.apiError("Unknown error... Ooops");
        }

        if (!user) {
          return res.apiError("Sorry, there are no accounts with that email address.");
        }

        // Remember me
        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }

        // Log the user in
        req.logIn(user, function(err) {
          if (err) { 
            return res.apiError("Unknown error... Ooops");
          }

          return res.apiSuccess("Your have been logged in successfully", { user: user });
        });

      })(req, res);
      
    });


    /**
     * Get the currently logged in user
     */
    app.delete('/api/logout', function(req, res) {
      req.logout();
      return res.apiSuccess("Your have been successfully logged out.");
    });

};