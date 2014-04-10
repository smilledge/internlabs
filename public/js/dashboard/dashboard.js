angular.module('InternLabs.dashboard', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/dashboard', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'DashboardCtrl',
        pageTitle: 'Dashboard',
        auth: true,
        state: {
          main: 'dashboard/dashboard.tpl.html'
        }
      })

      .when('/dashboard/internships', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'InternshipsCtrl',
        pageTitle: 'Active Internships',
        auth: true,
        state: {
          main: 'dashboard/internships.tpl.html'
        }
      })

      .when('/dashboard/applications', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'ApplicationsCtrl',
        pageTitle: 'Pending Applications',
        auth: true,
        state: {
          main: 'dashboard/applications.tpl.html'
        }
      })

      .when('/dashboard/roles', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'RolesCtrl',
        pageTitle: 'Available Roles',
        auth: true,
        state: {
          main: 'dashboard/roles.tpl.html'
        },
        resolve: {
          roles: function(Auth, Restangular) {
            return Restangular.one('companies', Auth.getUser().company).all('roles').getList();
          }
        }
      })

      .when('/dashboard/company-profile', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'CompanyProfileCtrl',
        pageTitle: 'Company Profile',
        auth: true,
        state: {
          main: 'dashboard/company-profile.tpl.html'
        }
      })

      ;

  })


  .controller('DashboardCtrl', function($route, $scope) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'dashboard';

  })


  .controller('InternshipsCtrl', function($route, $scope) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'internships';

  })


  .controller('ApplicationsCtrl', function($route, $scope) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'applications';

  })


  .controller('RolesCtrl', function($route, $scope, ModalFactory, roles, Restangular) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'roles';
    $scope.roles = roles;

    /**
     * Create a new role
     */
    $scope.add = function() {
      ModalFactory.create({
        scope: {
          title: "Add an Internship Role",
          role: {},
          save: function() {
            roles.post(this.role).then(function(newRole) {
              roles.unshift(newRole);
              this.close();
            }.bind(this));
          }
        },
        templateUrl: "dashboard/forms/role.tpl.html",
        className: "modal-add-role"
      });
    };

    /**
     * Edit a role
     */
    $scope.edit = function(role) {
      ModalFactory.create({
        scope: {
          title: "Edit Role",
          role: role,
          save: function() {
            this.role.put().then(function(newRole) {
              roles[_.indexOf(roles, role)] = newRole;
              this.close();
            }.bind(this));
          }
        },
        templateUrl: "dashboard/forms/role.tpl.html",
        className: "modal-edit-role"
      });
    };

    /**
     * Delete
     */
    $scope.delete = function(role) {
      ModalFactory.create({
        scope: {
          title: "Delete Role",
          delete: function() {
            role.remove().then(function() {
              roles.splice(_.indexOf(roles, role), 1);
              this.close();
            }.bind(this));
          }
        },
        templateUrl: "dashboard/forms/role-delete.tpl.html",
        className: "modal-delete-role"
      });
    };

  })


  .controller('CompanyProfileCtrl', function($route, $scope) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'profile';

  })


  ;