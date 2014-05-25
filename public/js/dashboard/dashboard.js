angular.module('InternLabs.dashboard', [])


  .config(function($routeProvider) {


    var resolveInternships = function(Restangular, status) {
      if (internlabs.isStudent) {
        return Restangular.one('me').all('internships').getList({
          status: status
        });
      } else if (internlabs.isEmployer) {
        return Restangular.one('companies', internlabs.user.company).getList('internships', {
          status: status
        });
      } else if (internlabs.isSupervisor) {
        return Restangular.one('suporvisors', internlabs.user._id).getList('internships', {
          status: status
        });
      }
    };


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
        },
        resolve: {
          internships: function(Restangular) {
            return resolveInternships(Restangular, 'active')
          }
        }
      })

      .when('/dashboard/internships/archived', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'ArchivedInternshipsCtrl',
        pageTitle: 'Archived Internships',
        auth: true,
        state: {
          main: 'dashboard/internships.tpl.html'
        },
        resolve: {
          internships: function(Restangular) {
            return resolveInternships(Restangular, 'completed')
          }
        }
      })

      .when('/dashboard/applications', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'ApplicationsCtrl',
        pageTitle: 'Pending Applications',
        auth: true,
        state: {
          main: 'dashboard/internships.tpl.html'
        },
        resolve: {
          internships: function(Restangular) {
            return resolveInternships(Restangular, 'pending')
          }
        }
      })

      .when('/dashboard/applications/declined', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'DeclinedApplicationsCtrl',
        pageTitle: 'Declined Applications',
        auth: true,
        state: {
          main: 'dashboard/internships.tpl.html'
        },
        resolve: {
          internships: function(Restangular) {
            return resolveInternships(Restangular, 'rejected')
          }
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
        },
        resolve: {
          company: function(Auth, Restangular) {
            return Restangular.one('companies', Auth.getUser().company).get();
          }
        }
      })

      .when('/dashboard/profile', {
        templateUrl: 'dashboard/layout.tpl.html',
        controller: 'ProfileCtrl',
        pageTitle: 'Edit Profile',
        auth: true,
        state: {
          main: 'dashboard/profile.tpl.html'
        },
        resolve: {
          profile: function(Restangular) {
            return Restangular.one('me').customGET('profile');
          }
        }
      })

      ;

  })


  .controller('DashboardCtrl', function($route, $scope, $http, Options, Restangular) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'dashboard';
    $scope.searching = true;

    if (internlabs.isStudent) {
      $scope.searching = true;

      navigator.geolocation.getCurrentPosition(function(geo) {
        $http({
          method: "GET",
          url: Options.apiUrl('recommendations'),
          params: {
            lat: geo.coords.latitude,
            lng: geo.coords.longitude
          }
        }).success(function(response) {
          $scope.searching = false;
          if (!response.data.results.length) {
            $scope.noResults = true;
          }
          $scope.recommendations = Restangular.restangularizeCollection(false, response.data.results, 'companies');
        }); 
      });
    }
  })


  .controller('InternshipsCtrl', function($route, $scope, internships) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'internships';
    $scope.title = "Active Internships";
    $scope.internships = internships;
  })


  .controller('ArchivedInternshipsCtrl', function($route, $scope, internships) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'archived';
    $scope.title = "Archived Internships";
    $scope.internships = internships;
  })


  .controller('ApplicationsCtrl', function($route, $scope, internships) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'applications';
    $scope.title = "Pending Applications";
    $scope.internships = internships;
  })


  .controller('DeclinedApplicationsCtrl', function($route, $scope, internships) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'declined';
    $scope.title = "Declined Applications";
    $scope.internships = internships;
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


  .controller('CompanyProfileCtrl', function($route, $scope, $fileUploader, Options, company, ModalFactory) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'profile';
    $scope.company = company;

    /**
     * Upload Logo
     */
    $scope.uploadLogo = function() {
      var uploader;
      ModalFactory.create({
        scope: {
          title: "Upload Company Logo",
          initialize: function() {
            uploader = $fileUploader.create({
              scope: this,
              url: Options.apiUrl('companies/' + company._id + '/logo')
            });

            // Make sure its an image
            uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
              var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
              type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|svg|'.indexOf(type) !== -1;
            });
          },
          upload: function() {
            uploader.uploadAll();
            uploader.bind('complete', function (event, xhr, item, response) {
              $scope.$apply(function() {
                $scope.company = response.data;
              });
              this.close();
            }.bind(this));
          }
        },
        templateUrl: "dashboard/forms/logo-upload.tpl.html",
        className: "modal-upload-logo"
      });
    };


    /**
     * Delete Logo
     */
    $scope.deleteLogo = function() {
      ModalFactory.create({
        scope: {
          title: "Remove Company Logo",
          delete: function() {
            company.customDELETE('logo').then(function(data) {
              $scope.company = data.data;
              this.close();
            }.bind(this));
          }
        },
        templateUrl: "dashboard/forms/logo-delete.tpl.html",
        className: "modal-delete-logo"
      });
    };
    
  })


  .controller('ProfileCtrl', function($route, $scope, profile) {
    $scope.state = $route.current.$$route.state;
    $scope.active = 'profile';
    $scope.profile = profile;
  })


  .directive('editProfileWidget', function(Options, Restangular) {
    return {
      templateUrl: 'dashboard/widgets/edit-profile.tpl.html',
      replace: true,
      scope: {
        profile: '='
      },
      link: function(scope, elem, attrs) {
        scope.universityOptions = Options.universityOptions;

        scope.save = function() {
          Restangular.all('profiles').customPUT(_.extend({}, scope.profile, {
            skills: scope.profile._skills
          }), scope.profile._id).then(function(repsonse) {
            scope.profile = repsonse;
          });
        };

        scope.$watch('profile.skills', function() {
          scope.profile._skills = scope.profile.skills.join(',');
        });
      }
    };
  })

  ;