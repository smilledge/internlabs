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


  /**
   * Post message widget
   */
  .directive('messageWidget', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'internships/widgets/message.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {
        scope.message = "";

        scope.save = function() {
          scope.internship.post('messages', {
            message: scope.message
          }).then(function(response) {
            scope.message = "";
            scope.internship.activity.unshift(response);
          });
        };
      }
    }
  })


  /**
   * Interview widget
   */
  .directive('interviewWidget', function(ModalFactory, Options) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'internships/widgets/interview.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {

        scope.edit = function() {
          ModalFactory.create({
            scope: {
              title: "Edit Interview",
              internship: scope.internship,
              _interview: _.extend({}, {
                date: new Date(),
                startTime: '12:00 PM',
                endTime: '2:00 PM',
              }, _.compactObject(scope.internship.interview)),
              timeOptions: Options.timeOptions,
              save: function() {
                var self = this,
                    data = this.scope._interview;

                this.scope.internship.post('interview', data).then(function(internship) {
                  scope.internship.interview = internship.interview;
                  self.close();
                });
              }
            },
            templateUrl: "internships/forms/interview.tpl.html"
          });
        };

        scope.remove = function() {
          ModalFactory.create({
            scope: {
              title: "Cancel Interview",
              delete: function() {
                var self = this;
                scope.internship.customDELETE('interview/').then(function(internship) {
                  scope.internship.interview = null;
                  self.close();
                });
              }
            },
            templateUrl: "internships/forms/interview-delete.tpl.html"
          });
        };

      }
    }
  })


  /**
   * Widget to show the internship activity feed
   */
  .directive('activityWidget', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'internships/widgets/activity.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {
        scope.canEdit = function(item) {
          return ! item.author || window.internlabs.user._id === item.author._id;
        };

        scope.remove = function(activity) {
          scope.internship.all('activity').customDELETE(activity._id).then(function() {
            scope.internship.activity = _.without(scope.internship.activity, activity);
          });
        };
      }
    }
  })



  /**
   * Widget for internship supervisors
   */
  .directive('supervisorsWidget', function(ModalFactory) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'internships/widgets/supervisors.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {

        var mergeSupervisors = function(newVal, oldVar) {
          scope._supervisors = _.union(scope.internship.supervisors, scope.internship.invitedSupervisors);
        };

        scope.add = function() {
          ModalFactory.create({
            scope: {
              title: "Add Internship Supervisor",
              internship: scope.internship,
              newSupervisor: "",
              save: function() {
                var self = this;
                this.scope.internship.post('supervisors', { email: this.scope.newSupervisor }).then(function(internship) {
                  scope.internship.supervisors = internship.supervisors;
                  scope.internship.invitedSupervisors = internship.invitedSupervisors;
                  self.close();
                });
              }
            },
            templateUrl: "internships/forms/supervisor-add.tpl.html"
          });
        };

        scope.remove = function(email) {
          ModalFactory.create({
            scope: {
              title: "Remove Supervisor",
              delete: function() {
                var self = this;
                scope.internship.customDELETE('supervisors/' + email).then(function(internship) {
                  scope.internship.supervisors = internship.supervisors;
                  scope.internship.invitedSupervisors = internship.invitedSupervisors;
                  self.close();
                });
              }
            },
            templateUrl: "internships/forms/supervisor-delete.tpl.html"
          });
        };

        scope.$watch('internship.supervisors', mergeSupervisors, true);
        scope.$watch('internship.invitedSupervisors', mergeSupervisors, true);
      }
    }
  })



  /**
   * Display the user's schedule
   */
  .directive('scheduleWidget', function(ModalFactory, Options) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'internships/widgets/schedule.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {

        scope.edit = function() {
          ModalFactory.create({
            scope: {
              title: "Edit Internship Schedule",
              internship: scope.internship,
              schedule: scope.internship.schedule,
              _schedule: angular.copy(scope.internship.schedule),
              newSchedule: {
                date: '2014-06-01',
                startTime: '9:00 AM',
                endTime: '5:00 PM',
              },
              timeOptions: Options.timeOptions,
              showForm: false,
              add: function(schedule) {
                if (!schedule.date) {
                  return;
                }

                var parts = schedule.date.split('-');
                var newSchedule = _.union(this.scope._schedule, _.extend({}, schedule, {
                  date: new Date(parts[0], parts[1] - 1, parts[2]).toISOString()
                }));

                // Sort the dates                
                this.scope._schedule = _.sortBy(newSchedule, function(item) {
                  return new Date(item.date).getTime();
                });

                this.scope.showForm = false;
              },
              remove: function(item) {
                this.scope._schedule = _.without(this.scope._schedule, item)
              },
              save: function() {
                var self = this;
                this.scope.internship.post('schedule', this.scope._schedule).then(function() {
                  scope.internship.schedule = angular.copy(self.scope._schedule);
                  self.close();
                });
              }
            },
            templateUrl: "internships/forms/schedule.tpl.html"
          });
        };

      }
    };
  })



  ;

