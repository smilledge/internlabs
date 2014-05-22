'use strict';

var auth = require('../lib/auth'),
    Company = require('../models/company'),
    Profile = require('../models/profile'),
    SearchOptions = require('../models/searchOptions'),
    async = require('async'),
    fs = require('fs'),
    _ = require('lodash'),
    Helpers = require('../helpers'),
    geoip = require('geoip-lite'),
    SearchQuery = require('../services/query');


module.exports = function(app) {

  app.get('/api/search/options', function(req, res) {
    SearchOptions.get(function(err, options) {
      res.apiSuccess(options);
    });
  });


  app.get('/api/search', function(req, res) {

    var input = req.query,
        query = SearchQuery.make(req.query);

    Company.search(query, {
      populate: 'address'
    }, function(err, results) {
      if ( err || ! results ) {
        return res.apiError("Sorry, no results were found.");
      }

      return res.apiSuccess({
        results: results.hits
      }, null, {
        totalResults: results.total
      });
    });

  });

  /**
   * Get reccomended internships for a user
   */
  app.get('/api/recommendations', auth.check(), function(req, res) {

    Profile.findById(req.user.profile, function(err, profile) {

      var query = SearchQuery.recommend({
        query: profile.skills.join(' '),
        lat: req.query.lat,
        lng: req.query.lng
      });

      Company.search(query, {
        populate: 'address'
      }, function(err, results) {
        if ( err || ! results ) {
          return res.apiError("Sorry, we could not reccomend any internships.");
        }

        return res.apiSuccess({
          results: results.hits
        }, null, {
          totalResults: results.total
        });
      });

    });
  });


};