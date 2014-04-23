angular.module('InternLabs.services')

  .service('Auth', function($rootScope, $http, $q, $location, Options) {

    var _user = angular.fromJson(window.internlabs.user);

    this.check = function() {
      return !!_user;
    };

    this.getUser = function() {
      return _user || false;
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

        // Do a full page reload
        // Allows us to attached the user to the page
        window.location.href = "/";
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
          if (!data.success) {
            return deferred.reject(data.error);
          };

          deferred.resolve(data.data.user);
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
       * Activate
       */
      this.resendActivation = function(data) {
        return $http.post(Options.apiUrl('resend-activation'), data);
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
      };


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
      };


      /**
       * Logout
       */
      this.logout = function() {
        var httpPromise = $http({
          method: 'DELETE',
          url: Options.apiUrl('logout')
        });
        
        httpPromise.success(function(data) {
          // Do a page reload
          // Make sure any temp data is cleared
          window.location.href = "/";
        });
      };

  })

  ;