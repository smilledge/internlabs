angular.module('InternLabs.services', [])


  .service('Options', function() {

    var apiBase = '/api/';

    /**
     * Generate a api resource url
     */
    this.apiUrl = function(resource) {
      return apiBase + resource.replace(/^\/|\/$/g, '');
    };

    this.timeOptions = [
      '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', 
      '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', 
      '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
    ];

    this.dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  })


  .service('Utils', function() {

    /**
     * Convert DD/MM/YYYY dates to a date object
     */
    this.toDate = function(input) {
      var parts = input.split('/');
      if ( parts.length !== 3 ) {
        return new Date();
      }
      return new Date(parts[2], parts[1] - 1, parts[0]);
    };

    /**
     * Convert date object to display string DD/MM/YYYY
     */
    this.fromDate = function(input) {
      if ( ! _.isDate(input) ) {
        input = new Date();
      }
      return [input.getDate(), input.getMonth(), input.getFullYear()].join('/');
    };

  })


  .filter('titlecase', function() {
    return function(s) {
      s = ( s === undefined || s === null ) ? '' : s;
      return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
        return ch.toUpperCase();
      });
    };
  });
  

  ;