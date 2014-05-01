angular.module('InternLabs.company', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/company/:companyId/:slug?', {
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


  .controller('CompanyDetailsCtrl', function($scope, $sce, Restangular, company, ModalFactory) {

    $scope.company = company;
    $scope.company.displayAddress = $sce.trustAsHtml(company.getDisplayAddress());
    $scope.application = {
      company: company._id
    };

    $scope.apply = function(role) {
      ModalFactory.create({
        scope: {
          title: "Apply for internship",
          application: $scope.application,
          role: role,
          save: function() {
            Restangular.all("internships").post(this.application).then(function(response) {
              console.log(response);
              this.close();
            }.bind(this));
          }
        },
        templateUrl: "internships/forms/apply.tpl.html",
        className: "modal-lg modal-create-application"
      });
    };

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