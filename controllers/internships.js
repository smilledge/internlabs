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
        return res.apiError(err);
      }

      return res.apiSuccess("You have successfully applied for this internship.", internship);
    });
  });


  /**
   * Update the users schedule
   */
  app.post('/api/internships/:internshipId/schedule', auth.check(), function(req, res) {
    InternshipService.createSchedule(req.params.internshipId, req.user._id, req.body, function(err, schedule) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Your schedule has been saved successfully.", schedule);
    });
  });


  /**
   * Add a new message
   */
  app.post('/api/internships/:internshipId/messages', auth.check(), function(req, res) {
    InternshipService.createMessage(req.params.internshipId, req.user._id, req.body.message, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Your message has been saved successfully.", internship);
    });
  });


  /**
   * Delete something from the activity feed
   */
  app.delete('/api/internships/:internshipId/activity/:activityId', auth.check(), function(req, res) {
    InternshipService.deleteActivity(req.params.internshipId, req.user._id, req.params.activityId, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Activity post has been deleted successfully.", internship);
    });
  });

};