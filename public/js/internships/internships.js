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
            scope.internship.activity.unshift(response.activity.shift());
          });
        };
      }
    }
  })


  /**
   * Applicant profile widget
   */
  .directive('profileWidget', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'internships/widgets/profile.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {
        scope.profile = scope.internship.student.profile;
      }
    }
  })


  /**
   * Availability
   */
  .directive('availabilityWidget', function(Options) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'internships/widgets/availability.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {
        var days = Options.dayOptions,
            avail = scope.internship.availability;

        var getAvailability = function() {
          scope._availability = _.map(days, function(day) {
            return {
              day: day,
              available: _.indexOf(avail, day) !== -1
            }
          });
        };

        scope.$watch('internship.availability', function(newVal, oldVal) {
          if (newVal) {
            getAvailability();
          }
        }, true);
      }
    }
  })


  /**
   * Internship status
   */
  .directive('statusWidget', function(ModalFactory) {
    return {
      replace: true,
      templateUrl: 'internships/widgets/status.tpl.html',
      scope: {
        internship: '='
      },
      link: function(scope, elem, attrs) {

        scope.changeStatus = function(status) {
          scope.internship.status = status;

          var verb = (status == 'active') ? 'approve' :
                     (status == 'rejected') ? 'reject' :
                     (status == 'pending') ? 'unapprove' :
                     'complete';

          scope.internship.customPOST({
            message: null
          }, verb).then(function(internship) {
            if ( internship.$$success) {
              scope.internship.activity = internship.activity;
            }
          });
        };

        scope.change = function(status) {
          ModalFactory.create({
            scope: {
              title: "Change internship status",
              internship: scope.internship,
              status: status,
              save: function() {
                scope.changeStatus(status);
                this.close();
              }
            },
            templateUrl: "internships/forms/internship-status.tpl.html"
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
                  if ( internship.$$success) {
                    scope.internship.activity = internship.activity;
                    scope.internship.interview = internship.interview;
                  }
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
                  if ( internship.$$success) {
                    scope.internship.activity = internship.activity;
                  }
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
                  if ( internship.$$success) {
                    scope.internship.activity = internship.activity;
                    scope.internship.supervisors = internship.supervisors;
                    scope.internship.invitedSupervisors = internship.invitedSupervisors;
                  }
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
                  if ( internship.$$success) {
                    scope.internship.activity = internship.activity;
                    scope.internship.supervisors = internship.supervisors;
                    scope.internship.invitedSupervisors = internship.invitedSupervisors;
                  }
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

        var save = function() {

        }

        scope.add = function() {
          ModalFactory.create({
            scope: {
              title: "Add to Schedule",
              internship: scope.internship,
              newSchedule: {
                date: new Date(),
                startTime: '9:00 AM',
                endTime: '5:00 PM',
              },
              timeOptions: Options.timeOptions,
              save: function() {
                var self = this;
                scope.internship.post('schedule', this.newSchedule).then(function(internship) {
                  if ( internship.$$success) {
                    scope.internship.activity = internship.activity;
                    scope.internship.schedule = internship.schedule;
                  }
                  self.close();
                });
              }
            },
            templateUrl: "internships/forms/schedule-add.tpl.html"
          });
        };

        scope.edit = function() {
          ModalFactory.create({
            scope: {
              title: "Edit Internship Schedule",
              schedule: scope.internship.schedule,
              remove: function(item) {
                var self = this;
                scope.internship.one('schedule', item._id).remove().then(function(internship) {
                  if ( internship.$$success) {
                    scope.internship.activity = internship.activity;
                    scope.internship.schedule = internship.schedule;
                    self.scope.schedule = internship.schedule;
                  }
                })
              }
            },
            templateUrl: "internships/forms/schedule.tpl.html"
          });
        };

      }
    };
  })



  ;

