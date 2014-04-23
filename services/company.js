var Company = require('../models/company'),
    async = require('async'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash');


/**
 * Add a logo to a company
 *
 * @param  {Company}
 * @param  {string}    path
 * @param  {func}      callback
 * @return {void}
 */
module.exports.setLogo = function(company, uri, done) {

  // Move the file to the uploads dir
  fs.readFile(uri, function (err, data) {
    if ( err ) {
      return done(err, null);
    }

    var fileName = 'logo-' + company._id + path.extname(uri);
    var newUri = __dirname + "/../public/uploads/" + fileName;

    fs.writeFile(newUri, data, function (err) {
      company.logo = fileName;
      company.save(function(err, company) {
        done(err, company);
      });
    });

  });

};