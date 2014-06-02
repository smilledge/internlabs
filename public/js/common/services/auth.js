angular.module('InternLabs.services')

  .service('Auth', function($rootScope, $http, $q, $location, Options, Restangular) {

    var _user = angular.fromJson(window.internlabs.user);

    this.check = function() {
      return !!_user;
    };

    this.getUser = function() {
      return _user || false;
    };

    this.hasAccess = function(type) {
      return _user && type === _user.type;
    };

    /**
     * Register
     */
    this.register = function(user) {
      var deferred = $q.defer();
      var httpPromise = $http.post(Options.apiUrl('register'), user);
      
      httpPromise.success(function(data, status) {
        if (!data.success) {
          return deferred.reject(data.error);
        };

        deferred.resolve(data.data.user);
      });

      return deferred.promise;
    };

  })

  ;