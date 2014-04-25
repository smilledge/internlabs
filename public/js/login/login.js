angular.module('InternLabs.login', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/login', {
        templateUrl: 'login/login.tpl.html',
        controller: 'LoginCtrl',
        pageTitle: 'Login',
        className: 'background-primary'
      })

      .when('/activate', {
        templateUrl: 'login/activate.tpl.html',
        controller: 'ActivateCtrl',
        pageTitle: 'Account Activation',
        className: 'background-primary'
      })

      .when('/resend-activation', {
        templateUrl: 'login/resend-activation.tpl.html',
        controller: 'ResendActivationCtrl',
        pageTitle: 'Resend Activation Email',
        className: 'background-primary'
      })

      .when('/password-reset', {
        templateUrl: 'login/password-reset.tpl.html',
        controller: 'PasswordResetCtrl',
        pageTitle: 'Reset Password',
        className: 'background-primary'
      })

      .when('/logout', {
        pageTitle: 'Logout',
        resolve: {
          response: function(Auth, $q, $location) {
            var deferred = $q.defer();
            Auth.logout().then(function(data) {
              $location.path('/');
            });
            return deferred.promise;
          }
        }
      })

      ;

  })


  .controller('LoginCtrl', function($scope, $location, Auth) {
    $scope.credentials = {};

    $scope.submit = function() {
      Auth.login($scope.credentials).then(function(data) {
        $location.url('/');
      }, function(error) {
        $scope.errors = error;
      });
    };
  })


  .controller('ActivateCtrl', function($rootScope, $scope, $location, Auth) {
    $rootScope.loading = true;
    $scope.activated = false;
    var params = $location.search();

    Auth.activate({
      activationToken: params.token,
      userId: params.user
    }).then(function(response) {
      $rootScope.loading = false;
      $scope.activated = true;
    });
  })


  .controller('PasswordResetCtrl', function($rootScope, $scope, $location, Auth) {
    
    var params = $location.search();
    $scope.action = (_.isEmpty(params)) ? 'send' : 'reset';
    
    $scope.reset = {};
    $scope.sendSuccess = false;
    $scope.resetSuccess = false;

    /**
     * Send password reset email
     */
    $scope.send = function() {
      $rootScope.loading = true;
      
      Auth.sendPasswordReset({
        email: $scope.reset.email
      }).then(function(response) {
        $rootScope.loading = false;
        $scope.sendSuccess = true;
      });
    };

    /**
     * Reset the user's password using the provided token and credentials
     */
    $scope.reset = function() {
      $rootScope.loading = true;
      
      Auth.passwordReset({
        userId: params.user,
        password: $scope.reset.password,
        resetToken: params.token
      }).then(function(response) {
        $rootScope.loading = false;
        $scope.resetSuccess = true;
      });
    };
  })


  .controller('ResendActivationCtrl', function($rootScope, $scope, Auth) {
    $scope.resend = {};
    $scope.success = false;

    /**
     * Send password reset email
     */
    $scope.send = function() {
      $rootScope.loading = true;
      
      Auth.resendActivation({
        email: $scope.resend.email
      }).then(function(response) {
        $rootScope.loading = false;

        if ( ! response.data.success ) {
          return $scope.errors = response.data.error;
        }
        
        $scope.success = true;
      });
    };
  })


  /**
   * Login form
   */
  .directive('loginForm', function () {
    return {
      restrict: 'A',
      scope: {
        credentials: '=',
        submit: '&?'
      },
      link: function(scope, elem, attrs) {}
    };
  })


  ;