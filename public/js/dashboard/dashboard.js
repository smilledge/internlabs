angular.module('InternLabs.dashboard', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/dashboard', {
        templateUrl: 'dashboard/dashboard.tpl.html',
        controller: 'DashboardCtrl',
        pageTitle: 'Dashboard',
        resolve: {
          user: function($q, $location, Auth) {
            var deferred = $q.defer();

            Auth.getUser().then(function(user) {
              deferred.resolve(user);
            }, function() {
              $location.path('/login');
            });
            
            return deferred.promise;
          }
        }
      });

  })


  .controller('DashboardCtrl', function($scope) {})


  ;