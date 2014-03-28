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

};