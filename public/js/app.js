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
  'InternLabs.company',
  'InternLabs.internships'
])

  .config(function($locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);

    RestangularProvider.setBaseUrl('/api');
    
    RestangularProvider.setResponseExtractor(function(response, operation) {
      var extractedData;

      if (operation === "getList") {
        extractedData = response.data || [];
      } else {
        extractedData = response.data || {};
      }
      extractedData.$$success = response.success;
      extractedData.$$message = response.message;
      extractedData.$$error = response.error;
      
      return extractedData;
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

    _.mixin({
      slugify: function(title){
        var replace = '-';
        var str = title.toString()
              .replace(/[\s\.]+/g,replace)
              .toLowerCase()
              .replace(new RegExp('[^a-z0-9'+replace+']','g'), replace)
              .replace(new RegExp(replace+'+','g'),replace)
            ;
     
        if( str.charAt(str.length-1) == replace ) str = str.substring(0,str.length-1);
        if ( str.charAt(0) == replace ) str = str.substring(1);
     
        return str;
      }
    });

  })

  // .animation('.reveal-animation', function() {
  //   var $body = $('body');

  //   return {
  //     enter: function(element, done) {
  //       TweenLite.set(element, {
  //         autoAlpha: 0
  //       });
  //       TweenLite.to(element, 0.2, {
  //         delay: 0.1,
  //         autoAlpha: 1,
  //         onComplete: function() {
  //           $body.css({ minHeight: 0 });
  //           done();
  //         }
  //       });
  //     },
  //     leave: function(element, done) {
  //       $body.css({ minHeight: $body.height() });
  //       TweenLite.to(element, 0.1, {
  //         autoAlpha: 0,
  //         onComplete: function() {
  //           $(window).scrollTop(0);
  //           done();
  //         }
  //       });
  //     }
  //   }
  // })

  .controller('AppCtrl', function($rootScope, $scope, $location, Auth) {

    $scope.appTitle = 'InternLabs';
    $rootScope.user = window.internlabs.user || {};
    $rootScope.loading = false;

    $scope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.loading = true;

      if( next.auth && ! Auth.check() ) {
        $location.path('/login');
      }
    });


    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $rootScope.loading = false;

      // $('body').removeClass();
      $(window).scrollTop(0);

      if ( ! angular.isDefined( current ) ) {
        return;
      }

      if ( angular.isDefined( current.$$route.pageTitle ) ) {
        $scope.pageTitle = current.$$route.pageTitle;
        // $('body').addClass(_.slugify($scope.pageTitle));
      } else {
        $scope.pageTitle = $scope.appTitle;
      }

      if (current.$$route.className) {
        // $('body').addClass(current.$$route.className);
      }

      // Remove alt style from nav
      $rootScope.altNav = false;
    });
    
    $scope.isLoading = function() {
        return $rootScope.loading;
    };

  })

  ; // Don't delete me!