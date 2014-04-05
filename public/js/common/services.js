angular.module('InternLabs.services', [])


  .service('Options', function() {

    var apiBase = '/api/';

    /**
     * Generate a api resource url
     */
    this.apiUrl = function(resource) {
      return apiBase + resource.replace(/^\/|\/$/g, '');
    };

  })
  

  ;