var Profile = require('../models/profile'),
    User = require('../models/user'),
    async = require('async'),
    _ = require('lodash'),
    Helpers = require('../helpers');



/**
 * Update a profile
 *
 * @param  {string}   profile ID
 * @param  {string}   user ID
 * @param  {object}   profile data
 * @return {void}
 */
module.exports.updateProfile = function(profile, user, data, done) {

  // Removed unwanted keys from data
  var data = _.omit(data, '__v', '_id', '_skills', 'id');

  // Parse the skills string
  if ( data.skills && data.skills.indexOf(',') > -1 ) {
    data.skills = Helpers.parseSkills(data.skills);
  }

  async.waterfall([

    /**
     * Get the profile
     */
    function(callback) {
      Profile.findById(profile._id || profile, function(err, profile) {
        if ( err || ! profile ) {
          return callback(new Error("Profile could not be found."));
        }
        callback(null, profile);
      });
    },

    /**
     * Get the user
     */
    function(profile, callback) {
      User.findById(user._id || user).exec(function(err, user) {
        if ( err || ! user ) {
          return callback(new Error("An error occured while saving the profile. Please try again later."));
        }
        callback(null, profile, user);
      });
    },

    /**
     * Check the user has write access to the profile
     */
    function(profile, user, callback) {
      if ( ! profile.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to edit documents on this profile.'));
      }
      callback(null, profile, user);
    },

    /**
     * Edit the profile
     */
    function(profile, user, callback) {
      _.extend(profile, data);

      profile.save(function(err, profile) {
        callback(err, profile);
      });
    }

  ], done);

};
