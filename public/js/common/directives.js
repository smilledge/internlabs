angular.module('InternLabs.common.directives', [])

  
  /**
   * Google map
   *  - Uses gmaps.js
   */
   .directive('googleMap', function () {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var mapId = _.uniqueId('map_'),
            gmap = null;

        elem.attr('id', mapId);

        var renderMap = function() {
          var lat = scope.$eval(elem.attr('lat')),
              lng = scope.$eval(elem.attr('lng'));
          
          elem.height(attrs.height || 350);

          gmap = new GMaps({
            div: mapId,
            lat: lat,
            lng: lng,
            zoom: 16,
            zoomControl: false,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            overviewMapControl: false
          });

          gmap.addMarker({
            lat: lat,
            lng: lng
          });
        }

        _.defer(renderMap);

        $(window).on('resize.gmap', _.debounce(function() {
          renderMap();
        }, 100));

        elem.on('$destroy', function() {
          $(window).off('resize.gmap');
        });
      }
    };
  })


  /**
   * Form errors
   *  - Displays errors at the top of a form
   */
   .directive('formErrors', function () {
    return {
      restrict: 'A',
      scope: {
        formErrors: '='
      },
      template: '<div class="form-errors">' +
                  '<div class="error" ng-repeat="error in errors">{{ error }}</div>' +
                '</div>',
      link: function(scope, elem, attrs) {
        elem.hide();

        scope.$watch('formErrors', function(errors) {
          if ( errors ) {
            if ( ! _.isArray(errors) ) {
              errors = [errors];
            }

            scope.errors = errors;
            return elem.fadeIn();
          }

          errors = [];
          elem.fadeOut();
        });
      }
    };
  })


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
   * Bootstrap: Popover
   */
  .directive('popover', function() {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, elem, attrs) {

        var options = {
          placement: attrs.popoverPlacement || 'top',
          trigger: attrs.popoverTrigger || 'hover',
          content: attrs.popoverContent || attrs.popover
        };

        if ( attrs.popoverTitle ) {
          options.title = attrs.popoverTitle;
        }

        elem.popover(options);
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
   * Formstone: Selecter
   */
  .directive('selecter', function() {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, elem, attrs) {

        elem.selecter({
          label: elem.attr('placeholder')
        });

        scope.$watch(function() {
          return scope.$eval(elem.attr('selecter'));
        }, function(newVal){
          _.defer(function() {
            elem.selecter("destroy");
            elem.selecter({
              label: elem.attr('placeholder')
            });
          });
        }, true);
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
          .staggerTo($items, 0.2, {
            autoAlpha: 1,
            bottom: 0,
            force3D: true,
            ease: Quad.easeOut
          }, 0.1, '+0.1')
          .resume();
      }
    };
  })


  /**
   * Stepped form
   *  - Step through a seriese of fieldsets
   *  - Give each a class of .form-step
   *  - Runs validation using parsley before moving to the next step
   */
  .directive('steppedForm', function ($q) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {

        var $fieldsets;

        var initialize = function() {
          $fieldsets = elem.find('.form-step').css({
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

          elem.find('a.next').on('click', next);
          elem.find('a.previous').on('click', previous);

          // Init parsley for validation
          elem.parsley({});

          setHeight();
        };


        /**
         * Set the height for the form based on the height of active from step
         * 
         * @return {void}
         */
        var setHeight = function() {
          var height = elem.find('.form-step.active').height();
          elem.css({
            'min-height': height 
          });
        };


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

            // Slide both
            .to(currentElem, 0.35, {
              autoAlpha: 0,
              left: (reverse) ? '110%' : '-110%'
            })
            .to(nextElem, 0.35, {
              autoAlpha: 1,
              left: 0
            }, '-=0.35')
            
            // Play!
            .resume();

          return deferred.promise;
        };


        /**
         * Run validation on each field in the provided fieldset
         *
         * @param {elem} fieldset element
         * @return {boolean} success?
         */
        var validateFieldset = function($fieldset) {
          var $inputs = $fieldset.find(":input");

          // Run validation on each field and return if that field is valid
          var validationResults = _.map($inputs, function($input) {
            var validator = new Parsley($input);
            validator.validate();
            return validator.isValid();
          });

          // Are all the fields valid
          return _.indexOf(validationResults, false) === -1;
        };


        /**
         * Next form step
         */
        var next = function() {

          var $current = elem.find('.form-step.active'),
              $next = $current.next('.form-step');

          // Validate the current fieldset
          if ( ! validateFieldset($current) ) {
            return;
          }

          // Play the transition animation
          transitionSteps($current, $next, false).then(function() {
            // Animtion done
            $current.removeClass('active');
            $next.addClass('active');
            setHeight();
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
            setHeight();
          });
        };


        _.defer(initialize);
      }
    };
  })

  
  /**
   * Validated Form
   *  - Adds validation to a form
   */
  .directive('form', function() {
    return {
      restrict: 'E',
      priority: -100,
      link: function(scope, elem, attrs) {

        // Stepped forms have their own validation
        if ( elem.find('[stepped-form]').length ) {
          return;
        }

        var validator = new Parsley(elem);

        elem.on('submit', function(e) {
          validator.validate();

          if ( ! validator.isValid() ) {
            e.preventDefault();
          }
        });
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
