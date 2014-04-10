angular.module('InternLabs', [
  'ngRoute',
  'angularFileUpload',
  'restangular',
  'templates-app',
  'InternLabs.services',
  'InternLabs.common.directives',
  'InternLabs.home',
  'InternLabs.login',
  'InternLabs.register',
  'InternLabs.dashboard',
  'InternLabs.company'
])

  .config(function($locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);

    RestangularProvider.setBaseUrl('/api');
    
    RestangularProvider.setResponseExtractor(function(response, operation) {
      return response.data;
    });

    RestangularProvider.setRestangularFields({
      id: "_id"
    });

  })

  .run(function() {
    
    // Underscore mixins
    _.mixin({
      capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      }
    });

  })

  .controller('AppCtrl', function($rootScope, $scope, $location, Auth) {

    $scope.appTitle = 'InternLabs';
    $rootScope.loading = false;

    $scope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.loading = true;

      if( next.auth && ! Auth.check() ) {
        event.preventDefault();
        $location.path('/login');
      }
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