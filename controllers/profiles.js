'use strict';


var Profile = require('../models/profile'),
    auth = require('../lib/auth'),
    async = require('async');


module.exports = function(app) {

  app.get('/api/profiles', auth.check(), function(req, res) {
    Profile.find({_id:req.user.profile}, function(err, profile){
        return res.apiSuccess(profile);
    });
  });
   app.put('/api/profiles/:profileid', auth.check(), function(req, res) {
   Profile.findByIdAndUpdate(req.params.profileid, req.body, function (err, profile) {
  	if (err) return handleError(err);
  	return res.apiSuccess("Your profile has been updated", profile);
  });
});
};

