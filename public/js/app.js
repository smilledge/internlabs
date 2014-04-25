angular.module('InternLabs', [
  'ngRoute',
  'ngAnimate',
  'angularFileUpload',
  'restangular',
  'akoenig.deckgrid',
  'templates-app',
  'InternLabs.services',
  'InternLabs.common.directives',
  'InternLabs.home',
  'InternLabs.login',
  'InternLabs.register',
  'InternLabs.search',
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

    _.mixin({
      compactObject : function(o) {
        _.each(o, function(v, k){
          if(!v) delete o[k];
        });
        return o;
      }
    });

  })

  .animation('.reveal-animation', function() {
    var $body = $('body');

    return {
      enter: function(element, done) {
        TweenLite.set(element, {
          autoAlpha: 0
        });
        TweenLite.to(element, 0.35, {
          delay: 0.2,
          autoAlpha: 1,
          onComplete: function() {
            $body.css({ minHeight: 0 });
            done();
          }
        });
      },
      leave: function(element, done) {
        $body.css({ minHeight: $body.height() });
        TweenLite.to(element, 0.2, {
          autoAlpha: 0,
          onComplete: function() {
            $(window).scrollTop(0);
            done();
          }
        });
      }
    }
  })

  .controller('AppCtrl', function($rootScope, $scope, $location, Auth) {

    $scope.appTitle = 'InternLabs';
    $rootScope.loading = false;

    $scope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.loading = true;

      if( next.auth && ! Auth.check() ) {
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