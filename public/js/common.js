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
   * Stepped form
   *  - Step through a seriese of fieldsets
   *  - Give each a class of .form-step
   */
  .directive('steppedForm', function ($q) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {

        var $fieldsets = elem.find('.form-step').css({
          position: 'absolute',
          width: '100%',
          top: 0
        });

        elem.css({
          position: 'relative'
        });


        // Set first fieldset as active and hide others
        $fieldsets.first().addClass('active');
        TweenLite.set($fieldsets.not(':first'), {
          autoAlpha: 0
        });


        /**
         * Transition out a slide and transiton in next slide
         * 
         * @param  {object} currentElem   The active form step
         * @param  {object} nextElem      The from step to transion in
         * @param  {bool}   reverse       Is the animation playing in reverse
         * @return {promise}
         */
        var transitionSteps = function(currentElem, nextElem, reverse) {
          var deferred = $q.defer();

          var timeline = new TimelineLite({ onComplete: function() {
            deferred.resolve();
          }}).pause()

            // Animation initial state for elems
            .set(currentElem, {
              left: 0
            })
            .set(nextElem, {
              left: (reverse) ? '-110%' : '110%'
            })

            // Fade in next
            // .to(nextElem, 0.15, {
            //   autoAlpha: 1
            // })

            // Slide both
            .to(currentElem, 0.35, {
              autoAlpha: 0,
              left: (reverse) ? '110%' : '-110%'
            })
            .to(nextElem, 0.35, {
              autoAlpha: 1,
              left: 0
            }, '-=0.35')

            // Fade out previous
            // .to(currentElem, 0.15, {
            //   autoAlpha: 0
            // })
            
            // Play!
            .resume();

          return deferred.promise;
        };


        /**
         * Next form step
         */
        var next = function() {

          var $current = elem.find('.form-step.active'),
              $next = $current.next('.form-step');

          transitionSteps($current, $next, false).then(function() {
            // Animtion done
            $current.removeClass('active');
            $next.addClass('active');
  
          });
        };

        /**
         * Previous form step
         */
        var previous = function() {
          var $current = elem.find('.form-step.active'),
              $prev = $current.prev('.form-step');

          transitionSteps($current, $prev, true).then(function() {
            // Animtion done
            $current.removeClass('active');
            $prev.addClass('active');
          });
        };


        elem.find('a.next').on('click', next);
        elem.find('a.previous').on('click', previous);
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
