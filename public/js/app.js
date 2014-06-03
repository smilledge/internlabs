angular.module('InternLabs', [
  'ngRoute',
  'ngAnimate',
  'angularFileUpload',
  'restangular',
  'angular-growl',
  'templates-app',
  'InternLabs.services',
  'InternLabs.common.directives',
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
    
    /**
     * Extract the response data
     */
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

  .run(function(Restangular, growl) {

    if (internlabs.user) {
      internlabs.isStudent = internlabs.user.type === "student";
      internlabs.isEmployer = internlabs.user.type === "employer";
      internlabs.isSupervisor = internlabs.user.type === "supervisor";
    }

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

    /**
     * Intercept responses and check for messages or errors
     */
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      if ( data.$$error ) {
        growl.addErrorMessage(data.$$error, {
          ttl: 10000
        });
      }

      if ( data.$$message ) {
        growl.addSuccessMessage(data.$$message, {
          ttl: 5000
        });
      }

      return data;
    });

  })

  .controller('AppCtrl', function($rootScope, $scope, $location, Auth) {

    $scope.appTitle = 'InternLabs';
    $rootScope.user = window.internlabs.user || {};
    $rootScope.loading = false;

    $scope.$on('$routeChangeStart', function(event, next, current) {
      $rootScope.loading = true;

      if( ( next.auth || _.isUndefined(next.auth) ) && ! Auth.check() ) {
        $location.path('/login');
      }
    });


    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $rootScope.loading = false;
      $(window).scrollTop(0);

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