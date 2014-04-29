'use strict';

var Internship = require('../models/internship'),
    InternshipService = require('../services/internship'),
    auth = require('../lib/auth'),
    _ = require('lodash');


module.exports = function(app) {


  /**
   * Get the current user's internships
   */
  app.get('/api/me/internships', auth.check(), function(req, res) {
    InternshipService.findByUser(req.user._id, function(err, internships) {
      if ( err || ! internships ) {
        return res.apiError(new Error('Could not find any matching internships.'));
      }
      return res.apiSuccess(internships);
    });
  });


  /**
   * Create an internships
   */
  app.get('/api/internships/:internshipId', auth.check(), function(req, res) {
    InternshipService.findById(req.params.internshipId, function(err, internship) {
      if ( err || ! internship ) {
        return res.apiError(new Error('Could not find internship'));
      }
      return res.apiSuccess(internship);
    });
  });


  /**
   * Create an internships
   */
  app.post('/api/internships', auth.check(), function(req, res) {
    var data = _.extend({}, req.body, {
      status: 'pending',
      student: req.user._id
    });

    InternshipService.create(data, function(err, internship) {
      if ( err ) {
        return res.apiError(err.message);
      }

      return res.apiSuccess("You have successfully applied for this internship.", internship);
    });
  });

};