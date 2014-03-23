angular.module('InternLabs.register', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/signup/:type', {
        templateUrl: 'register/register.tpl.html',
        controller: 'RegisterCtrl',
        pageTitle: 'Student Signup'
      })

      ;

  })


  .controller('RegisterCtrl', function($scope, $routeParams, $location, Auth) {

    if ( _.indexOf(['employer', 'student', 'supervisor'], $routeParams.type) === -1 ) {
      $location.path('/signup/student');
    }

    $scope.user = {
      type: $routeParams.type
    };

    $scope.submit = function() {
      Auth.register($scope.user).then(function(data) {
        $location.url('/login');
      }, function(error) {
        console.log(error);
        $scope.errors = error;
      });
    };

  })


  /**
   * Register form
   */
  .directive('registerForm', function () {
    return {
      restrict: 'A',
      templateUrl: 'register/register-form.tpl.html',
      scope: {
        user: '=',
        submit: '=?'
      },
      link: function(scope, elem, attrs) {

        scope.type = function() {
          return _(scope.user.type).capitalize();
        };

      }
    };
  })


  ;