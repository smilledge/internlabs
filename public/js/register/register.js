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


  .controller('RegisterCtrl', function($scope, $rootScope, $routeParams, $location, $fileUploader, Restangular, Options, ModalFactory) {

    if ( _.indexOf(['employer', 'student', 'supervisor'], $routeParams.type) === -1 ) {
      $location.path('/signup/student');
    }

    $scope.user = _.extend({}, $location.search(), {
      type: $routeParams.type
    });

    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope
    });

    $scope.submit = function() {
      $scope.loading = true;

      Restangular.one('register').customPOST($scope.user).then(function(user) {
        if (!user.$$success) {
          $scope.loading = false;
          return;
        }

        if ( ! user.company ) {
          return $location.url('/login');
        }

        // Upload the logo
        var logoEndpoint = Options.apiUrl('companies/'+user.company._id+'/logo');

        _.each(uploader.queue, function(file) {
          file.url = logoEndpoint;
        });

        uploader.uploadAll();

        $scope.loading = false;

        $location.url('/login');

      });
    };

  })


  /**
   * Register form
   */
  .directive('registerForm', function(Options) {
    return {
      restrict: 'A',
      templateUrl: 'register/register-form.tpl.html',
      scope: {
        user: '=',
        submit: '=?'
      },
      link: function(scope, elem, attrs) {
        scope.universityOptions = Options.universityOptions;

        scope.type = function() {
          return _(scope.user.type).capitalize();
        };
      }
    };
  })


  ;