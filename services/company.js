var Company = require('../models/company'),
    async = require('async'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

/**
 * Get the uploads directory
 */
var getUploadsDir = function() {
  return __dirname + '/../public/uploads/';
}


/**
 * Find a company by id
 * @param  {string}  Company ID
 * @param  {func}    callback
 * @return {void}
 */
module.exports.findById = function(companyId, done) {
  Company.findById(companyId).populate('address roles').exec(function(err, company) {
    if ( err || ! company ) {
      return done(new Error("Company could not be found."));
    }
    done(null, company);
  });
};


/**
 * Add a logo to a company
 *
 * @param  {User}
 * @param  {Company}   or company id
 * @param  {string}    path
 * @param  {func}      callback
 * @return {void}
 */
module.exports.setLogo = function(user, company, file, done) {

  async.waterfall([

    /**
     * Get the Company
     */
    function(callback) {
      if ( _.isObject(company) ) {
        return callback(null, company);
      }

      Company.findOne({ _id: company }, function(err, company) {
        if ( err || ! company ) {
          return callback(new Error("The company specified could not be found."));
        }
        callback(null, company);
      });
    },

    /**
     * Does the user have write access to the company
     */
    function(company, callback) {
      if ( ! company.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to manage this company.'));
      }
      callback(null, company);
    },

    /**
     * If the company has a logo already - delete it
     */
    function(company, callback) {
      if ( ! _.isEmpty(company.logo) ) {
        module.exports.deleteLogo(user, company, function(err, company) {
          callback(null, company);
        });
      } else {
        callback(null, company);
      }
    },

    /**
     * Move the file to the uploads dir
     */
    function(company, callback) {

      if ( _.isObject(file) ) {
        var ext = path.extname(file.name);
        file = file.path;
      }

      fs.readFile(file, function (err, data) {
        if ( err ) {
          return callback(err, null);
        }

        var fileName = 'logo-' + company._id + '-' + new Date().getTime() + (ext || path.extname(file));
        var newUri = getUploadsDir() + fileName;

        fs.writeFile(newUri, data, function (err) {
          company.logo = fileName;
          company.save(function(err, company) {
            callback(err, company);
          });
        });

      });
    },
  ], done);

};


/**
 * Remove a logo from a company
 *
 * @param  {mixed}    Company ID or company object
 * @param  {func}     callback
 * @return {void}
 */
module.exports.deleteLogo = function(user, company, done) {


  async.waterfall([

    /**
     * Get the Company
     */
    function(callback) {
      if ( _.isObject(company) ) {
        return callback(null, company);
      }

      Company.findOne({ _id: company }, function(err, company) {
        if ( err || ! company ) {
          return callback(new Error("The company specified could not be found."));
        }
        callback(null, company);
      });
    },

    /**
     * Does the user have write access to the company
     */
    function(company, callback) {
      if ( ! company.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to manage this company.'));
      }
      callback(null, company);
    },

    /**
     * Remove the logo url from the company 
     */
    function(company, callback) {
      var logo = company.logo;

      Company.findByIdAndUpdate(company._id, {
        logo: null
      }, function(err, company) {
        if ( err || ! company ) {
          return callback(err, null);
        }
        callback(null, company, logo);
      });
    },

    /**
     * Delete the logo file
     */
    function(company, logo, callback) {
      if ( logo && logo.length ) {
        fs.unlink(getUploadsDir() + logo, function(err) {
          callback(null, company);
        });
      } else {
        callback(null, company);
      }
    }

  ], done);

};