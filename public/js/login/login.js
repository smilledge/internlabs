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

      ;

  })


  .controller('LoginCtrl', function($rootScope, $scope, $location, Restangular) {
    $scope.credentials = {};

    $scope.submit = function() {
      console.log($scope);
      Restangular.one('login').customPOST($scope.credentials).then(function(response) {
        if (response.$$success) {
          window.location.href = '/';
        }
      });
    };
  })


  .controller('ActivateCtrl', function($rootScope, $scope, $location, Restangular) {
    $scope.activated = false;
    var params = $location.search();

    Restangular.one('password-reset').customPUT({
      activationToken: params.token,
      userId: params.user
    }).then(function(response) {
      if (response.$$success) {
        $scope.activated = true;
      }
    });
  })


  .controller('PasswordResetCtrl', function($rootScope, $scope, $location, Restangular) {
    
    var params = $location.search();
    $scope.action = (_.isEmpty(params)) ? 'send' : 'reset';
    
    $scope.reset = {};
    $scope.sendSuccess = false;
    $scope.resetSuccess = false;

    $scope.send = function() {
      Restangular.one('password-reset').customPOST({
        email: $scope.reset.email
      }).then(function(response) {
        if (response.$$success) {
          $scope.sendSuccess = true;
        }
      });
    };

    $scope.reset = function() {
      Restangular.one('password-reset').customPUT({
        userId: params.user,
        password: $scope.reset.password,
        resetToken: params.token
      }).then(function(response) {
        if (response.$$success) {
          $scope.resetSuccess = true;
        }
      });
    };
  })


  .controller('ResendActivationCtrl', function($rootScope, $scope, Restangular) {
    $scope.resend = {};
    $scope.success = false;

    $scope.send = function() {
      Restangular.one('resend-activation').customPOST({
        email: $scope.resend.email
      }).then(function(response) {
        if (response.$$success) {
          $scope.success = true;
        }
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