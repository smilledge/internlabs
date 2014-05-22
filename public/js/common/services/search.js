angular.module('InternLabs.services')

  /**
   * Search Query
   */
  .service('SearchQuery', function() {

    /**
     * Convert a params object to an search query object
     */
    this.parse = function(params) {
      params = _.clone(params);

      if ( params.locations ) {
        params.locations = params.locations.split(',');
      }

      if ( params.skills ) {
        params.skills = params.skills.split(',');
      }

      return params;

    };

    /**
     * Convert a search query object to a params object
     */
    this.serialize = function(query) {
      query = _.clone(query);

      if ( query.locations && _.isArray(query.locations) ) {
        query.locations = _.compact(query.locations).join(',');
      }

      if ( query.skills && _.isArray(query.skills) ) {
        query.skills = _.compact(query.skills).join(',');
      }

      return _.compactObject(query);

    };

  })

  /**
   * Search Service
   */
  .service('Search', function($http, Options, Restangular) {

    this.query = function(query) {
      return $http.get(Options.apiUrl('search'), {
        params: query
      }).then(function(data) {
        return Restangular.restangularizeCollection(false, data.data.data.results, 'companies');
      });
    };

  })

  ;