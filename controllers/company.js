'use strict';

var Company = require('../models/company'),
    CompanyService = require('../services/company'),
    Role = require('../models/role'),
    auth = require('../lib/auth'),
    async = require('async'),
    _ = require('lodash');


module.exports = function(app) {


  /**
   * Get a company's details
   */
  app.get('/api/companies/:companyId', function(req, res) {

    Company.findOne({
      _id: req.params.companyId
    }).populate('address roles').exec(function(err, company) {
      if ( err || ! company ) {
        return res.apiError("Sorry, the selected company cannot be found.");
      }

      return res.apiSuccess(company);
    });

  });


  /**
   * Get a companies roles
   */
  app.get('/api/companies/:companyId/roles', function(req, res) {
    Company.findOne({ _id: req.params.companyId }).populate('roles').exec(function(err, company) {
      if ( err || ! company ) {
        return callback(new Error("Sorry, the selected company could not be found."));
      }
      
      res.apiSuccess(company.roles);
    });
  });


  /**
   * Add a role to a company
   */
  app.post('/api/companies/:companyId/roles', function(req, res) {

    async.waterfall([

      // Find the company
      function(callback) {
        Company.findOne({ _id: req.params.companyId }, function(err, company) {
          if ( err || ! company ) {
            return callback(new Error("Sorry, the selected company could not be found."));
          }
          
          callback(null, company);
        });
      },

      // Create the role
      function(company, callback) {
        var role = new Role(req.body).save(function(err, role) {
          callback(err, company, role);
        });
      },

      // Add the role to the company
      function(company, role, callback) {
        company.roles.push(role._id);
        company.save(function(err, company) {
          callback(null, role)
        });
      }

    ], function(err, role) {
      if ( err ) {
        return res.apiError(err.message);
      }

      return res.apiSuccess("Role has been added successfully.", role);
    });

  });


  /**
   * Update a role
   */
  app.put(['/api/companies/:companyId/roles/:roleId', '/api/roles/:roleId'], function(req, res) {
    delete req.body._id;
    
    Role.findByIdAndUpdate(req.params.roleId, req.body, function(err, role) {
      if ( err || ! role ) {
        return res.apiError(err);
      }
      return res.apiSuccess("Role has been updated successfully.", role);
    });
  });


  /**
   * Delete a role
   */
  app.delete(['/api/companies/:companyId/roles/:roleId', '/api/roles/:roleId'], function(req, res) {
    async.parallel([
      // Delete the role
      function(callback) {
        Role.findOneAndRemove({
          _id: req.params.roleId
        }, function(err, role) {
          if ( err ) {
            return callback(new Error("Could not find the specified role."));
          }

          callback(null);
        })
      },
      // Delete the role relationship from the company
      function(callback) {
        Company.update({
          roles: {
            $in: [req.params.roleId]
          }
        }, {
          $pull: {
            roles: req.params.roleId
          }
        }, function(err) {
          callback(null);
        });
      }
    ], function(err) {
      if ( err ) {
        return res.apiError(err.message);
      }
      return res.apiSuccess("Role has been deleted successfully.");
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

      CompanyService.setLogo(company, req.files.file.path, function(err, company) {
        if (err) {
          return res.apiError(err);
        }
        return res.apiSuccess("Logo uploaded successfully.", { company: company });
      });
    });
  });


  /**
   * Remove a comanies logo
   */
  app.delete('/api/companies/:companyId/logo/:logoId?', auth.check(), function(req, res) {
    
  });


};