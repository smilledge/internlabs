angular.module('InternLabs.register', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/signup/:type', {
        templateUrl: 'register/register.tpl.html',
        controller: 'RegisterCtrl',
        pageTitle: 'Signup'
      })

      ;

  })


  .controller('RegisterCtrl', function($scope, $routeParams, $location, $fileUploader, Auth, Options) {

    if ( _.indexOf(['employer', 'student', 'supervisor'], $routeParams.type) === -1 ) {
      $location.path('/signup/student');
    }

    $scope.user = {
      type: $routeParams.type
    };

    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope
    });

    $scope.submit = function() {
      Auth.register($scope.user).then(function(user) {

        // Upload the logo
        var logoEndpoint = Options.apiUrl('companies/'+user.company._id+'/logo');

        _.each(uploader.queue, function(file) {
          file.url = logoEndpoint;
        });

        uploader.uploadAll();

        $location.url('/login');

      }, function(error) {
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