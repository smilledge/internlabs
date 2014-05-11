angular.module('InternLabs.home', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/', {
        templateUrl: 'home/home.tpl.html',
        controller: 'HomeCtrl',
        pageTitle: 'InternLabs',
        className: 'background-primary'
      });

  })


  .controller('HomeCtrl', function($rootScope, $scope, $location, Auth) {

    if ( Auth.check() ) {
      return $location.path('/dashboard');
    }

    // $rootScope.altNav = true;
    
  })


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


  /**
   * Animations for the homepage hero
   */
  .directive('homepageHero', function () {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {

        var $title = $(elem).find('.hero-title'),
            $callToAction = $(elem).find('.call-to-action'),
            $actions = $(elem).find('.actions');


        new TimelineLite({ onComplete: function() {} })
          .pause()
          .set($title, {
            autoAlpha: 0
          })
          .set([$callToAction, $actions], {
            autoAlpha: 0,
            position: 'relative',
            bottom: -30
          })
          .to($title, 0.5, {
            autoAlpha: 1,
            ease: Quad.easeIn
          }, '+0.1')
          .staggerTo([$callToAction, $actions], 0.45, {
            autoAlpha: 1,
            bottom: 0,
            force3D: true,
            ease: Quad.easeOut
          }, 0.45, '+0.75')
          .resume();
      }
    };
  })


  ;