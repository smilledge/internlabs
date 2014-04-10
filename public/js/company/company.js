angular.module('InternLabs.company', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/company/:companyId', {
        templateUrl: 'company/details.tpl.html',
        controller: 'CompanyDetailsCtrl',
        pageTitle: 'Company Details',
        resolve: {
          company: function($route, Restangular) {
            return Restangular.one('companies', $route.current.params.companyId).get();
          }
        }
      })

      ;

  })


  .controller('CompanyDetailsCtrl', function($scope, $sce, company, ModalFactory) {

    $scope.company = company;
    $scope.company.displayAddress = $sce.trustAsHtml(company.getDisplayAddress());

    $scope.showRoleDetails = function(role) {
      ModalFactory.create({
        scope: {
          title: role.title
        },
        template: role.description
      });
    }

  })


  ;