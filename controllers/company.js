'use strict';

var Company = require('../models/company'),
    auth = require('../lib/auth'),
    async = require('async');


module.exports = function(app) {


  /**
   * Add a logo to a company's profile
   */
  app.post('/api/companies/:companyId/logo', function(req, res) {
    
    console.log("Files");
    console.log(req.files);

    Company.findOne({
      _id: req.params.companyId
    }, function(err, company) {
      if ( err || ! company ) {
        return res.apiError("Could not find your company.");
      }

      console.log("Company");
      console.log(company);

    });
    res.send();
  });


  /**
   * Remove a comanies logo
   */
  app.delete('/api/companies/:companyId/logo/:logoId?', auth.check(), function(req, res) {
    
  });


};