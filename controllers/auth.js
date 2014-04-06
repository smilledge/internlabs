'use strict';


var User = require('../models/user'),
    Profile = require('../models/profile'),
    async = require('async'),
    auth = require('../lib/auth'),
    mailer = require('../lib/mailer'),
    passport = require('passport'),
    companyService = require('../services/company'),
    _ = require('lodash'),
    nconf = require('nconf');


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

          if ( ! req.body.profile || _.isEmpty(req.body.profile) ) {
            return callback(null, null);
          }

          // Make sure skills is an array
          if ( _.isString(req.body.profile.skills) ) {
            req.body.profile.skills = req.body.profile.skills.split(',');
          }

          // Trim skills, remove empty strings and remove duplicates
          req.body.profile.skills = _.uniq(_.compact(_.map(req.body.profile.skills, function(skill) {
            return skill.trim();
          })));

          var profile = new Profile(req.body.profile);

          profile.save(function(err) {
            if (err) {
              return res.apiError(err);
            }

            callback(null, profile);
          });

        },

        // Create the company
        function(profile, callback) {
          companyService.create(req.body.company, function(err, company) {
            // If there's an error creating the company, also remove the profile
            if ( err ) {
              return profile.remove(function() {
                res.apiError(err);
              });
            }

            callback(null, profile, company);
          });
        },

        // Create the account
        function(profile, company, callback) {

          var user = req.body;
          user.provider = 'local';

          if (profile) {
            user.profile = profile._id;
          }

          if (company) {
            user.company = company._id;
          }

          new User(user).save(function (err, user) {

              if (err) {
                return async.parallel([function(callback) {
                  if ( company ) company.remove();
                  callback();
                }, function(callback) {
                  if (profile) profile.remove();
                  callback();
                }], function() {
                  res.apiError(err);
                })
              }

              callback(null, user);
            });

        },

        // Get the user with the profile and company populated
        function(user, callback) {
          console.log(user);
          user.populate('company profile', function(err, user) {
            callback(err, user);
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

      ], function(err, user) {
        // Everything was completed
          return res.apiSuccess("Your account has been created successfully", { user: user });
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
              return res.apiError("Could not find you account.");
            }
            callback(null, user);
          });
        },

        // Activate the account
        function(user, callback) {
          // Check if their account has already been activated
          if ( ! user.activationToken || user.activated ) {
            return res.apiSuccess("Your account has already been activated.", { user: user });
          }

          // Make sure they have the correct token
          if ( ! user.activationToken === req.body.activationToken ) {
            return res.apiError("Sorry, but the activation token you provided was incorrect.");
          }

          user.activated = true;

          user.save(function(err, user) {
            callback(err, user);
          });
        }

      ], function(user) {
        return res.apiSuccess("Your account has been activated successfully.", { user: user });
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
        return res.apiSuccess("An activation email has been sent to your address.", { user: user });
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
        return res.apiSuccess("A confirmation email has been sent to the address you provided.", { user: user });
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
        return res.apiSuccess("Your password has been reset successfully.", { user: user });
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