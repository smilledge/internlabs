angular.module('InternLabs.internships', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/internship/:internshipId/:slug?', {
        templateUrl: 'internships/details.tpl.html',
        controller: 'InternshipDetails',
        pageTitle: 'Internship Dashboard',
        resolve: {
          internship: function($route, Restangular) {
            return Restangular.one('internships', $route.current.params.internshipId).get();
          }
        }
      })

      ;

  })


  .controller('InternshipDetails', function($scope, $sce, internship, ModalFactory) {
    $scope.internship = internship;
    $scope.company = internship.company;
    $scope.student = internship.student;
    $scope.profile = internship.student.profile;
  })


  /**
   * Internship Application form
   */
  .directive('applyForm', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {

        scope.application.role = {};

        if (scope.role) {
          scope.application.role = scope.role;
          scope.existingRole = true;
        }

      }
    };
  })





  ;