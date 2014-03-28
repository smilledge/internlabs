'use strict';

var _ = require('lodash');

module.exports = function(app) {

    app.get('*', function (req, res, next) {

      // Skip /api/* requests
      var pathArray = _.compact(req.path.split('/'));
      if ( _.isArray(pathArray) && pathArray[0] === "api" ) {
        return next();
      }

      res.render('index.ejs');
    });
    
};
