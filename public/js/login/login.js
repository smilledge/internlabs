angular.module('InternLabs.login', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/login', {
        templateUrl: 'login/login.tpl.html',
        controller: 'LoginCtrl',
        pageTitle: 'Login'
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