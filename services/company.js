var User = require('../models/user'),
    Profile = require('../models/profile'),
    Company = require('../models/company'),
    Address = require('../models/address'),
    async = require('async'),
    _ = require('lodash');


/**
 * Create a new company
 *
 * @param  {object} data comany data
 * @return {[type]}      [description]
 */
module.exports.create = function(data, done) {

  if ( ! data ) {
    return done(null, null);
  }

  async.waterfall([

    // Create the address
    function(callback) {

      if ( ! data.address || _.isEmpty(data.address) ) {
        return callback(null, null);
      }

      new Address(data.address).save(function(err, address) {
        if ( err ) {
          return done(err, null);
        }

        delete data.address;
        return callback(null, address);
      });
    },

    // Create the company
    function(address, callback) {

      // Add the address id
      data.address = address._id;

      // Make sure skills is an array
      if ( _.isString(data.skills) ) {
        data.skills = data.skills.split(',');
      }

      // Trim skills, remove empty strings and remove duplicates
      data.skills = _.uniq(_.compact(_.map(data.skills, function(skill) {
        return skill.trim();
      })));

      // Create the company
      new Company(data).save(function(err, company) {
        // If error also remove the address
        if ( err ) {
          return address.remove(function() {
            done(err, null);
          });
        }

        return callback(null, company);
      });
    }

  ], function(err, company) {
    return done(err, company)
  });

};