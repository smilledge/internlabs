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
    InternshipService.findByUser(req.user._id, req.query, function(err, internships) {
      if ( err || ! internships ) {
        return res.apiError(new Error('Could not find any matching internships.'));
      }
      return res.apiSuccess(internships);
    });
  });


  /**
   * Get an internship by ID
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
   * Get a comapnies internships
   */
  app.get('/api/companies/:companyId/internships', auth.check(), function(req, res) {

    var company = req.params.companyId;

    InternshipService.findByCompany(company, req.query, function(err, internships) {
      if ( err || ! internships ) {
        return res.apiError(new Error('Could not find any matching internships.'));
      }
      return res.apiSuccess(internships);
    });
  });


  /**
   * Get a supervisors internships
   */
  app.get('/api/supervisors/:supervisorId/internships', auth.check(), function(req, res) {
    InternshipService.findBySupervisor(req.params.supervisorId, req.query, function(err, internships) {
      if ( err || ! internships ) {
        return res.apiError(new Error('Could not find any matching internships.'));
      }
      return res.apiSuccess(internships);
    });
  });


  /**
   * Create an internship
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
   * Change an internship's status
   */
  var changeStatus = function(req, res) {
    var status = req.url.split('/').pop();

    // Change status verb to an adjective(?)
    switch (status) {
      case ('approve') : 
        status = 'active';
        break;
      case ('reject') : 
        status = 'rejected';
        break;
      case ('complete') : 
        status = 'completed';
        break;
      case ('unapprove') :
        status = 'pending';
        break;
    }

    InternshipService.changeStatus(req.params.internshipId, req.user._id, status,  function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("The internships status has been changed successfully.");
    });
  };

  app.post('/api/internships/:internshipId/approve', auth.check(), changeStatus);
  app.post('/api/internships/:internshipId/unapprove', auth.check(), changeStatus);
  app.post('/api/internships/:internshipId/reject', auth.check(), changeStatus);
  app.post('/api/internships/:internshipId/complete', auth.check(), changeStatus);


  /**
   * Add to schedule
   */
  app.post('/api/internships/:internshipId/schedule', auth.check(), function(req, res) {
    InternshipService.createSchedule(req.params.internshipId, req.user._id, req.body, function(err, schedule) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Your schedule has been updated successfully.", schedule);
    });
  });


  /**
   * Delete schedule
   */
  app.delete('/api/internships/:internshipId/schedule/:scheduleId', auth.check(), function(req, res) {
    InternshipService.deleteSchedule(req.params.internshipId, req.user._id, req.params.scheduleId, function(err, schedule) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Your schedule has been updated successfully.", schedule);
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

      InternshipService.findById(internship._id, function(err, internship) {
        return res.apiSuccess("Your message has been saved successfully.", internship);
      });
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


  /**
   * Add a supervisor
   */
  app.post('/api/internships/:internshipId/supervisors', auth.check(), function(req, res) {
    InternshipService.createSupervisor(req.params.internshipId, req.user._id, req.body.email, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      InternshipService.findById(internship._id, function(err, internship) {
        return res.apiSuccess("Supervisor has been added successfully.", internship);
      });
    });
  });

  /**
   * Delete a supervisor
   */
  app.delete('/api/internships/:internshipId/supervisors/:email', auth.check(), function(req, res) {
    InternshipService.deleteSupervisor(req.params.internshipId, req.user._id, req.params.email, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      InternshipService.findById(internship._id, function(err, internship) {
        return res.apiSuccess("Supervisor has been removed successfully.", internship);
      });
    });
  });

  /**
   * Upload a document
   */
  app.post('/api/internships/:internshipId/documents', auth.check(), function(req, res) {
    InternshipService.uploadDocument(req.params.internshipId, req.user._id, req.files.file, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Document has been uploaded sucessfully.", internship);
    });
  });

  /**
   * Edit a document
   */
  app.put('/api/internships/:internshipId/documents/:documentId', auth.check(), function(req, res) {
    InternshipService.editDocument(req.params.internshipId, req.user._id, req.body, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Document has been saved sucessfully.", internship);
    });
  });

  /**
   * Delete a document
   */
  app.delete('/api/internships/:internshipId/documents/:documentId', auth.check(), function(req, res) {
    InternshipService.deleteDocument(req.params.internshipId, req.user._id, req.params.documentId, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      return res.apiSuccess("Document has been deleted sucessfully.", internship);
    });
  });

  /**
   * Set a the interview
   */
  app.post('/api/internships/:internshipId/interview', auth.check(), function(req, res) {
    InternshipService.createInterview(req.params.internshipId, req.user._id, req.body, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      InternshipService.findById(internship._id, function(err, internship) {
        return res.apiSuccess("Interview has been scheduled successfully.", internship);
      });
    });
  });


  /**
   * Cancel an interview
   */
  app.delete('/api/internships/:internshipId/interview', auth.check(), function(req, res) {
    InternshipService.deleteInterview(req.params.internshipId, req.user._id, function(err, internship) {
      if ( err ) {
        return res.apiError(err);
      }

      InternshipService.findById(internship._id, function(err, internship) {
        return res.apiSuccess("Interview has been scheduled successfully.", internship);
      });
    });
  });

};