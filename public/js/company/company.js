angular.module('InternLabs.company', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/company/:companyId', {
        templateUrl: 'company/details.tpl.html',
        controller: 'CompanyDetailsCtrl',
        pageTitle: 'Company Details',
        resolve: {
          company: function(CompanyService, $q, $route) {
            return CompanyService.get($route.current.params.companyId);
          }
        }
      })

      ;

  })


  .controller('CompanyDetailsCtrl', function($scope, $sce, company) {

    console.log("company details");
    console.log(company);

    $scope.company = company;
    $scope.company.displayAddress = $sce.trustAsHtml(company.getDisplayAddress());

  })


  ;