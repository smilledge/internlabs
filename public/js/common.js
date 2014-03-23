angular.module('InternLabs.common', [])


  /**
   * Floating labels
   *
   * Add the float-label attribute to an input elem
   * Previous elem must be the label
   */
  .directive('floatLabel', function () {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        
        $(elem).bind("checkval",function() {
          var label = $(this).prev("label").addClass('floating-label');
          if(this.value !== ""){
            label.addClass("open");
          } else {
            label.removeClass("open");
          }
        })
        .on("keyup",function() {
          $(this).trigger("checkval");
        })
        .on("focus",function() {
          $(this).prev("label").addClass("active");
        })
        .on("blur",function() {
            $(this).prev("label").removeClass("active");
        })
        .trigger("checkval");

      }
    };
  })


  /**
   * Formstone: Picker
   *
   * http://formstone.it/components/Picker/demo/index.html
   */
  .directive('fsPicker', function () {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem.picker();
      }
    };
  })


  /**
   * Animated form group
   */
  .directive('animatedForm', function () {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {

        var $items = $(elem).find('.animation-group');

        new TimelineLite({ onComplete: function() {
          elem.find('input.form-control').first().focus();
        }})
          .pause()
          .set($items, {
            autoAlpha: 0,
            position: 'relative',
            bottom: -20
          })
          .staggerTo($items, 0.3, {
            autoAlpha: 1,
            bottom: 0,
            force3D: true,
            ease: Quad.easeOut
          }, 0.15, '+0.1')
          .resume();
      }
    };
  })


  /**
   * Show / hide elements based on login status / user level
   *
   * Example: <div auth logged="true">Only logged in users will see this</div>
   */
  .directive('auth', function(Auth) {
    return {
      restrict: 'A',
      scope: {
        logged: '=?',
        group: '=?'
      },
      link: function(scope, elem, attrs) {

        elem = $(elem);
        
        // Show hide the elem depending on auth status
        var check = function() {
          if ( scope.logged ) {
            if ( Auth.check() ) {
              elem.removeClass('hide');
            } else {
              elem.addClass('hide');
            }
          } else {
            if ( ! Auth.check() ) {
              elem.removeClass('hide');
            } else {
              elem.addClass('hide');
            }
          }
        };

        check();

        scope.$on('auth:login', check);
        scope.$on('auth:logout', check);
      }
    };
  })


  ;
