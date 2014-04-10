angular.module('InternLabs.services')


  /**
   * Role Model
   */
  .factory('Role', function() {

    var Role = function(data) {
      angular.extend(this, data);
    };

    return Role;
  })


  /**
   * Role Service
   */
  .service('RoleService', function($http, $q, Role, Options) {

    /**
     * Delete a role
     */
    this.delete = function(role) {
      var deferred = $q.defer();

      $http.delete(Options.apiUrl('/roles/' + role._id))
        .success(function(data) {
          if ( ! data.success ) {
            return deferred.reject(data.error);
          }
          deferred.resolve(data.message);
        });

      return deferred.promise;
    };

  })

  ;