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


  .service('Auth', function($rootScope, $http, $q, Options) {

    var _user = null;

    this.check = function() {
      return !!_user;
    };

    this.getUser = function() {
      var deferred = $q.defer();

      if ( _user ) {
        deferred.resolve(_user);
      } else {
        $http.get(Options.apiUrl('me')).success(function(data) {
          if ( ! data.success ) {
            return deferred.reject();
          }
          deferred.resolve(data.data.user);
        });
      }

      return deferred.promise;
    };

    /**
     * login
     */
    this.login = function(credentials) {
      var deferred = $q.defer();
      var httpPromise = $http.post(Options.apiUrl('login'), credentials);
      
      httpPromise.success(function(data, status) {
        if ( ! data.success ) {
          return deferred.reject(data.error);
        }

        _user = data.data.user;
        $rootScope.$broadcast('auth:login');
        deferred.resolve(_user);
      });

      return deferred.promise;
    };


      /**
       * Register
       */
      this.register = function(user) {
        var deferred = $q.defer();
        var httpPromise = $http.post(Options.apiUrl('register'), user);
        
        httpPromise.success(function(data, status) {
          deferred.resolve();
        });

        return deferred.promise;
      };


      /**
       * Activate
       */
      this.activate = function(data) {
        var deferred = $q.defer();

        $http.put(Options.apiUrl('activate'), data)
          .success(function(data, status) {
            deferred.resolve(data);
          });

        return deferred.promise;
      };


      /**
       * Send password reset
       */
      this.sendPasswordReset = function(data) {
        var deferred = $q.defer();

        $http.post(Options.apiUrl('password-reset'), data)
          .success(function(data, status) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }


      /**
       * Reset password
       */
      this.passwordReset = function(data) {
        var deferred = $q.defer();

        $http.put(Options.apiUrl('password-reset'), data)
          .success(function(data, status) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }


      /**
       * Logout
       */
      this.logout = function() {
        var deferred = $q.defer();
        var httpPromise = $http({
          method: 'DELETE',
          url: Options.apiUrl('logout')
        });
        
        httpPromise.success(function(data) {
          _user = null;
          $rootScope.$broadcast('auth:logout');
           deferred.resolve();
        });

        return deferred.promise;
      };

  })

  ;