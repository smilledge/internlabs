angular.module('InternLabs.home', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/', {
        templateUrl: 'home/home.tpl.html',
        controller: 'HomeCtrl',
        pageTitle: 'InternLabs'
      })

      .when('/login', {
        templateUrl: 'home/home.tpl.html',
        controller: 'AboutCtrl',
        pageTitle: 'About InternLabs',
        resolve: {
          test: function($q) {
            // Testing the loading state
            var deferred = $q.defer();
            return deferred.promise;
          }
        }
      });


  })


  .controller('HomeCtrl', function($scope) {})


  /**
   * Change elements size to fill the screen
   */
  .directive('fillScreen', function () {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var headerHeight = angular.element('#primary-nav').height();

        var resizeElem = function() {
          var windowHeight = angular.element(window).height();
          elem.css('min-height', 0).css('min-height', windowHeight - headerHeight);
        };

        angular.element(window).on('resize', resizeElem);

        resizeElem();
      }
    };
  })


  ;