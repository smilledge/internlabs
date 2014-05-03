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
          return window.internlabs.user._id === item.author._id;
        };

        scope.remove = function(activity) {
          console.log(activity);
          scope.internship.all('activity').customDELETE(activity._id).then(function() {
            scope.internship.activity = _.without(scope.internship.activity, activity);
          });
        };
      }
    }
  })



  /**
   * Display the user's schedule
   */
  .directive('scheduleWidget', function(ModalFactory) {
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
              timeOptions: [
                '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
                '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', 
                '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', 
                '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
              ],
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

