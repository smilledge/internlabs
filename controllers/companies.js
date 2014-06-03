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
  app.post('/api/companies/:companyId/roles', auth.check(), function(req, res) {
    CompanyService.addRole(req.params.companyId, req.body, function(err, role) {
      if ( err ) {
        return res.apiError(err.message);
      }

      return res.apiSuccess("Role has been added successfully.", role);
    });
  });


  /**
   * Update a role
   */
  var updateRole = function(req, res) {
    delete req.body._id;
    
    Role.findByIdAndUpdate(req.params.roleId, req.body, function(err, role) {
      if ( err || ! role ) {
        return res.apiError(err);
      }
      return res.apiSuccess("Role has been updated successfully.", role);
    });
  };
  app.put('/api/roles/:roleId', auth.check(), updateRole);
  app.put('/api/companies/:companyId/roles/:roleId', auth.check(), updateRole);


  /**
   * Delete a role
   */
  var deleteRole = function(req, res) {
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
  };
  app.delete('/api/companies/:companyId/roles/:roleId', auth.check(), deleteRole);
  app.delete('/api/roles/:roleId', auth.check(), deleteRole);


  /**
   * Add a logo to a company's profile
   */
  app.post('/api/companies/:companyId/logo', auth.check(), function(req, res) {
    CompanyService.setLogo(req.user, req.params.companyId, req.files.file, function(err, company) {
      if (err) {
        return res.apiError(err);
      }
      return res.apiSuccess("Logo uploaded successfully.", company);
    });
  });


  /**
   * Remove a comanies logo
   */
  app.delete('/api/companies/:companyId/logo/:logoId?', auth.check(), function(req, res) {    
    CompanyService.deleteLogo(req.user, req.params.companyId, function(err, company) {
      if (err) {
        return res.apiError(err);
      }
      return res.apiSuccess("Logo removed successfully.", company);
    });
  });


};