var _ = require('lodash');

'use strict';


/**
 * Adds some helper methods to the res object
 */
module.exports = function() {


  var parseErrors = function(error) {
    var errors = [];

    // Make sure error is an array
    if ( ! _.isArray(error) ) {
      error = [error];
    }

    if ( _.isArray(error) ) {
      _.each(error, function(error) {

        // String
        if ( _.isString(error) ) {
          errors.push(error);
        }

        // Error object
        if ( error.message ) {
          errors.push(error.message);
        }

        // Mongoose errors object
        if ( _.isObject(error.errors) ) {
          errors.push(_.map(error.errors, function(error) {
            return error.message;
          }));
        }

      });
    }

    return errors;

  };


  return function(req, res, next) {


    res.apiSuccess = function(data, msg, meta) {
      // Allow params to be in any order
      if (typeof data == 'string' || data instanceof String) {
        var swap = data;
        data = msg;
        msg = swap;
      }

      return this.send(200, {
        success: true,
        status: 200,
        message: msg || null,
        data: data,
        meta: meta
      });
    }


    res.apiError = function(error) {
      // Use a 200 response and put the actual status in the response body
      //  - Makes it easier to user angular http interceptors
      //  - Prevents errors in console
      return this.send(200, {
        success: false,
        status: 400,
        error: parseErrors(error)
      });
    }


    res.apiAuth = function(error) {
      return this.send(200, {
        success: false,
        status: 401,
        error: error || null
      });
    }


    next();
  }
}