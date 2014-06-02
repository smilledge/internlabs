'use strict';


var User = require('../models/user'),
    Profile = require('../models/profile'),
    async = require('async'),
    auth = require('../lib/auth'),
    mailer = require('../lib/mailer'),
    passport = require('passport'),
    UserService = require('../services/user'),
    _ = require('lodash'),
    nconf = require('nconf');


module.exports = function(app) {


    /**
     * Get the currently logged in user
     */
    app.get('/api/me', auth.check(), function(req, res) {
      return res.apiSuccess(req.user);
    });


    /**
     * Get the currently logged in user's profile
     */
    app.get('/api/me/profile', auth.check(), function(req, res) {
      User.findById(req.user._id).populate('profile address').exec(function(err, user) {
        return res.apiSuccess(user.profile);
      });
    });


    /**
     * Register a new user
     */
    app.post('/api/register', function(req, res) {
      async.waterfall([

        /**
         * Create the account
         */
        function(callback) {
          UserService.create(_.extend({}, req.body, {
            provider: 'local'
          }), callback);
        },

        /**
         * Send the activation email
         */
        function(user, callback) {
          mailer.send({
            to: user.email,
            subject: "Activate your account",
            template: "activate.ejs",
            model: {
              activationUrl: nconf.get("url") + 'activate?token=' + user.activationToken + '&user=' + user._id,
              user: user
            }
          }, function(err) {
            callback(null, user);
          });
        }

      ], function(err, user) {
        if ( err ) {
          return res.apiError(err);
        }
        return res.apiSuccess("Your account has been created successfully", user);
      });
    });


    /**
     * Activate an account
     */
    app.put('/api/activate', function(req, res) {

      async.waterfall([

        // Ge the users account
        function(callback) {
          User.findOne({ _id: req.body.userId }, function(err, user) {
            if ( err || ! user ) {
              return callback(new Error("Could not find you account."));
            }
            callback(null, user);
          });
        },

        // Activate the account
        function(user, callback) {
          // Check if their account has already been activated
          if ( ! user.activationToken || user.activated ) {
            return callback(null, user);
          }

          // Make sure they have the correct token
          if ( ! user.activationToken === req.body.activationToken ) {
            return callback(new Error("Sorry, but the activation token you provided was incorrect."));
          }

          user.activated = true;

          user.save(function(err, user) {
            callback(null, user);
          });
        }

      ], function(err, user) {
        if ( err ) {
          return res.apiError(err.message);
        }
        return res.apiSuccess("Your account has been activated successfully.", user);
      });

    });


    /**
     * Resend the users activation email
     */
    app.post('/api/resend-activation', function(req, res) {
      async.waterfall([
        // Get the users account
        function(callback) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if ( err || ! user ) {
              return res.apiError("Could not find an account what the provided email.");
            }
            callback(null, user);
          });
        },

        // Send the activation email
        function(user, callback) {
          mailer.send({
            to: user.email,
            subject: "Activate your account",
            template: "activate.ejs",
            model: {
              activationUrl: nconf.get("url") + 'activate?token=' + user.activationToken + '&user=' + user._id
            }
          }, function(err) {
            callback(err, user);
          });
        }

      ], function(user) {
        return res.apiSuccess("An activation email has been sent to your address.", user);
      });
    });


    /**
     * Send password reset email
     */
    app.post('/api/password-reset', function(req, res) {

      async.waterfall([

        // Ge the users account
        function(callback) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if ( err || ! user ) {
              return res.apiError("Could not find an account with that email.");
            }
            callback(null, user);
          });
        },

        // Create a reset token for the user
        function(user, callback) {

          user.resetToken = user.getResetToken();

          user.save(function(err, user) {
            if ( err ) {
              return res.apiError("Please provide a vaild password.");
            }

            callback(err, user);
          });
        },

        // Send the confirmation email
        function(user, callback) {
          mailer.send({
            to: user.email,
            subject: "Confirm password reset",
            template: "password-reset.ejs",
            model: {
              resetUrl: nconf.get("url") + 'password-reset?token=' + user.resetToken + '&user=' + user._id
            }
          }, function(err) {
            callback(err, user);
          });
        }

      ], function(user) {
        return res.apiSuccess("A confirmation email has been sent to the address you provided.", user);
      });

    });


    /**
     * Reset password
     */
    app.put('/api/password-reset', function(req, res) {
      
      async.waterfall([

        // Ge the users account
        function(callback) {
          User.findOne({ _id: req.body.userId }, function(err, user) {
            if ( err || ! user ) {
              return res.apiError("Could not find you account.");
            }
            callback(null, user);
          });
        },

        // Reset the password
        function(user, callback) {

          // Make sure they have the correct token
          if ( ! user.resetToken === req.body.resetToken ) {
            return res.apiError("Sorry, but the reset token you provided was incorrect.");
          }

          // Password will be hashed using the save hook int he user model
          user.password = req.body.password;

          user.save(function(err, user) {
            callback(err, user);
          });
        }

      ], function(user) {
        return res.apiSuccess("Your password has been reset successfully.", user);
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

        // Is the user activated
        if ( ! user.activated ) {
          return res.apiError("Sorry, your account has not been activated yet. Please check your email for an activation link.");
        }

        // Remember me
        if (req.body.remember) {
          req.session.cookie.maxAge = 9999999999;
        } else {
          req.session.cookie.expires = false;
        }

        // Log the user in
        req.logIn(user, function(err) {
          if (err) { 
            return res.apiError("Unknown error... Ooops");
          }

          return res.apiSuccess("Your have been logged in successfully", user);
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