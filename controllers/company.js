'use strict';

var Company = require('../models/company'),
    auth = require('../lib/auth'),
    async = require('async'),
    fs = require('fs');


module.exports = function(app) {


  /**
   * Get a company's details
   */
  app.get('/api/companies/:companyId', function(req, res) {

    Company.findOne({
      _id: req.params.companyId
    }).populate('address').exec(function(err, company) {
      if ( err || ! company ) {
        return res.apiError("Sorry, the selected country cannot be found.");
      }

      return res.apiSuccess({ company: company });
    });

  });



  /**
   * Add a logo to a company's profile
   */
  app.post('/api/companies/:companyId/logo', function(req, res) {
    Company.findOne({
      _id: req.params.companyId
    }, function(err, company) {
      
      if ( err || ! company ) {
        return res.apiError("Could not find your company.");
      }

      // Move the file to the uploads dir
      fs.readFile(req.files.file.path, function (err, data) {
        var fileName = company._id + '-logo-' + req.files.file.name;
        var newPath = __dirname + "/../public/uploads/" + fileName;
        fs.writeFile(newPath, data, function (err) {
          company.logo = fileName;
          company.save(function() {
            return res.apiSuccess("Logo uploaded successfully.", { company: company });
          });
        });
      });

    });
  });


  /**
   * Remove a comanies logo
   */
  app.delete('/api/companies/:companyId/logo/:logoId?', auth.check(), function(req, res) {
    
  });


};