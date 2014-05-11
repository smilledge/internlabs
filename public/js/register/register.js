angular.module('InternLabs.register', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/signup/:type', {
        templateUrl: 'register/register.tpl.html',
        controller: 'RegisterCtrl',
        pageTitle: 'Signup',
        className: 'background-primary'
      })

      ;

  })


  .controller('RegisterCtrl', function($scope, $rootScope, $routeParams, $location, $fileUploader, Auth, Options, ModalFactory) {

    if ( _.indexOf(['employer', 'student', 'supervisor'], $routeParams.type) === -1 ) {
      $location.path('/signup/student');
    }

    $rootScope.altNav = true;

    $scope.user = {
      type: $routeParams.type
    };

    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope
    });

    $scope.submit = function() {
      $rootScope.loading = true;

      Auth.register($scope.user).then(function(user) {

        if ( ! user.company ) {
          return $location.url('/login');
        }

        // Upload the logo
        var logoEndpoint = Options.apiUrl('companies/'+user.company._id+'/logo');

        _.each(uploader.queue, function(file) {
          file.url = logoEndpoint;
        });

        uploader.uploadAll();

        $rootScope.loading = false;

        $location.url('/login');

      }, function(errors) {
        $rootScope.loading = false;
        ModalFactory.create({
          scope: {
            title: "An error occured",
            errors: errors
          },
          templateUrl: "register/modal-error.tpl.html",
          className: "modal-register-error"
        });
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