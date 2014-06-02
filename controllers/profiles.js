'use strict';


var Profile = require('../models/profile'),
    ProfileService = require('../services/profile'),
    auth = require('../lib/auth'),
    async = require('async');


module.exports = function(app) {

  app.get('/api/profiles', auth.check(), function(req, res) {
    Profile.find({_id:req.user.profile}, function(err, profile){
      return res.apiSuccess(profile);
    });
  });

  app.put('/api/profiles/:profileId', auth.check(), function(req, res) {
    ProfileService.updateProfile(req.params.profileId, req.user._id, req.body, function(err, profile) {
      if (err || ! profile) {
        return res.apiError("An error occurred while saving profile. Please try again later.");
      }

      res.apiSuccess("Profile has been updated successfully.", profile);
    });
  });

};