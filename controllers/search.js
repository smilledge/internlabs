'use strict';

var Company = require('../models/company'),
    SearchOptions = require('../models/searchOptions'),
    async = require('async'),
    fs = require('fs'),
    _ = require('lodash'),
    Helpers = require('../helpers'),
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


};