angular.module('InternLabs', [
  'ngRoute',
  'templates-app',
  'InternLabs.home'
])

  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  })

  .run(function() {})

  .controller('AppCtrl', function($rootScope, $scope) {

    $scope.appTitle = 'InternLabs';
    $rootScope.loading = false;

    $scope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.loading = true;
    });


    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $rootScope.loading = false;

      if ( ! angular.isDefined( current ) ) {
        return;
      }

      if ( angular.isDefined( current.$$route.pageTitle ) ) {
        $scope.pageTitle = current.$$route.pageTitle;
      } else {
        $scope.pageTitle = $scope.appTitle;
      }
    });
    
    $scope.isLoading = function() {
        return $rootScope.loading;
    };

  })

  ; // Don't delete me!