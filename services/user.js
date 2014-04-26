var User = require('../models/user'),
    Profile = require('../models/profile'),
    Company = require('../models/company'),
    Address = require('../models/address'),
    async = require('async'),
    _ = require('lodash'),
    Helpers = require('../helpers');


/**
 * Create a new user of any type (employer, student, supervison)
 *
 * @param  {object}   data
 * @param  {func}     callback
 * @return {void}
 */
module.exports.create = function(data, done) {

  if ( ! data ) {
    return done(new Error("Error: No user data provided."), null);
  }

  async.waterfall([

    /**
     * Create the profile address
     */
    function(callback) {
      if ( ! data.profile || ! _.isObject(data.profile.address) ) {
        return callback(null, null);
      }

      new Address(data.profile.address).save(function(err, address) {
        if ( err ) {
          return callback(err, null);
        }

        return callback(null, address);
      });
    },

    /**
     * Create the profile
     */
    function(address, callback) {
      if ( ! _.isObject(data.profile) ) {
        return callback(null, null);
      }

      if ( ! _.isUndefined(data.profile.skills) ) {
        data.profile.skills = Helpers.parseSkills(data.profile.skills);
      }

      new Profile(_.extend({}, data.profile, {
        address: (address) ? address._id : null
      })).save(function(err, profile) {
        if ( err ) {
          return callback(err, null);
        }

        return callback(null, profile);
      });
    },


    /**
     * Create the company address
     */
    function(profile, callback) {
      if ( ! data.company || ! _.isObject(data.company.address) ) {
        return callback(null, profile, null);
      }

      new Address(data.company.address).save(function(err, address) {
        if ( err ) {
          return address.remove(function() {
            callback(err, null);
          });
        }

        return callback(null, profile, address);
      });
    },

    /**
     * Create the company
     */
    function(profile, address, callback) {
      if ( ! _.isObject(data.company) ) {
        return callback(null, null, null);
      }

      if ( ! _.isUndefined(data.company.skills) ) {
        data.company.skills = Helpers.parseSkills(data.company.skills);
      }

      new Company(_.extend({}, data.company, {
        address: (address) ? address._id : null
      })).save(function(err, company) {
        if ( err ) {
          // Remove the profile and address if error
          if (address) address.remove();
          if (profile) profile.remove();
          return callback(err, null, null);
        }

        return callback(null, profile, company);
      });
    },

    /**
     * Create the user
     */
    function(profile, company, callback) {
      new User(_.extend({}, data, {
        profile: (profile) ? profile._id : null,
        company: (company) ? company._id : null
      })).save(function(err, user) {
        if ( err ) {
          if (company) company.remove();
          if (profile) profile.remove();
          return callback(err, null);
        }

        callback(null, user, profile, company);
      });
    },

    /**
     * Set the access control perms on the company / profile
     *  - Everyone can read a profile / company
     *  - Only the user who created the profile / company can edit / delete
     */
    function(user, profile, company, callback) {
      async.seq(function(next) {
        if (profile) {
          profile.setAccess('*', ['read'])
          user.setAccess(profile, ['read', 'write', 'delete'])
          profile.save(function() {
            next();
          });
        } else {
          next();
        }
      }, function(next) {
        if (company) {
          company.setAccess('*', ['read'])
          user.setAccess(company, ['read', 'write', 'delete'])
          company.save(function() {
            callback(null, user);
          });
        } else {
          callback(null, user);
        }
      })();
    }

  ], done);

};