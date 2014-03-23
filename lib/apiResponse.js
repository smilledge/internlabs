'use strict';


/**
 * Adds some helper methods to the res object
 */
module.exports = function() {
  return function(req, res, next) {


    res.apiSuccess = function(data, msg) {

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
        data: data
      });
    }


    res.apiError = function(error) {

      // Use a 200 response and put the actual status in the response body
      //  - Makes it easier to user angular http interceptors
      //  - Prevents errors in console
      return this.send(200, {
        success: false,
        status: 400,
        error: error || null
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