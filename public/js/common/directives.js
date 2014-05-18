angular.module('InternLabs.common.directives', [])

  /**
   * Creates models
   */
  .service('ModalFactory', function($rootScope, $templateCache, $http, $compile) {

    // tempalte for the modal container
    var modalTemplate = '<div class="modal fade">' +
                          '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                              '<div class="modal-header">' +
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                                '<h4 class="modal-title">{{ title }}</h4>' +
                              '</div>' +
                              '<div class="modal-body">' +
                              '</div>' +
                            '</div>' +
                          '</div>' +
                        '</div>';

    // Default options
    var defaultOptions = {
      className: false,
      scope: false,
      tempalte: false,
      templateUrl: false
    };

    /**
     * Load the provided templateUrl
     * @param  {[type]} tmpl [description]
     * @return {[type]}      [description]
     */
    var loadTemplate = function(templateUrl) {
      return $templateCache.get(templateUrl);
    };

    var renderModal = function() {

    }

    /**
     * Create a new modal
     * @param  {object} options
     * @return {void}
     */
    this.create = function(options) {
      options = _.extend({}, defaultOptions, options);

      var scope = $rootScope.$new(),
          $body = $('body'),
          $modal = $(modalTemplate),
          template;

      if (_.isObject(options.scope)) {
        _.extend(scope, {
          scope: scope
        }, options.scope);
      }

      if ( options.template ) {
        template = options.template;
      }

      if ( options.templateUrl ) {
        template = loadTemplate(options.templateUrl);
      }

      $modal.find('.modal-body').append(template);

      if ( options.className ) {
        $modal.find('.modal-dialog').addClass(options.className);
      }

      var complied = $compile($modal)(scope);
      complied.appendTo('body').modal({});

      _.extend(scope, {
        close: function() {
          $(complied).modal('hide')
        }
      });

      // Remove the modal after it is hidden
      complied.on('hidden.bs.modal', function(e) {
        $(this).remove();
      });

      scope.$on('$destroy', function () {
        $modal.remove();
      });
    };
  })


  /**
   * Primary navigation
   */
   .directive('primaryNav', function($location) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var isOpen = false,
            $mobileMenu = elem.find('.nav-mobile');

        scope.search = {
          query: ""
        };

        scope.focus = function() {
          elem.find('input').focus();
        };

        scope.blur = function() {
          elem.find('input').blur();
        };

        scope.search = function() {
          $location.url('/search?query=' + (scope.search.query || ""));
          scope.search.query = "";
        };

        scope.toggle = function(close) {
          if ( isOpen ) {
            $mobileMenu.removeClass('active');
            isOpen = false;
            $('body').removeAttr('style');
          } else if ( ! close ) {
            $mobileMenu.addClass('active');
            isOpen = true;
            $('body').css({
              overflow: 'hidden'
            })
          }
        };

        $mobileMenu.find('a').on('click', function() {
          scope.toggle(true);
        });
      }
    }
  })


  /**
   * Dropdown menu
   */
  .directive('dropdownMenu', function() {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, elem, attrs) {
        elem.addClass('dropdown');
        var $menu = elem.find('ul').first(),
            $toggle = elem.find('a').first();
        $menu.addClass('dropdown-menu');
        var uniqId = _.uniqueId('menu-');
        var isOpen = false;
        
        scope.toggle = function(close) {
          if ( isOpen ) {
            $menu.hide();
            $toggle.removeClass('active');
            isOpen = false;
          } else if ( ! close ) {
            $menu.show();
            $toggle.addClass('active');
            isOpen = true;
          }
        };

        elem.find('li > a').on('click', function() {
          scope.toggle(true);
        });

        $(window).on('click.' + uniqId, function(e) {
          if ($(e.target).parents('.dropdown')[0] === elem[0]) {
            return;
          }
          scope.toggle(true);
        });

        elem.on('$destroy', function() {
          $(window).off('click.' + uniqId);
        });
      }
    }
  })



  /**
   * Upload Form
   */
  .directive('uploadForm', function($fileUploader) {
    return {
      restrict: 'A',
      scope: {
        uploader: '=?',
        allow: '@?',
        url: '@'
      },
      templateUrl: 'common/forms/file-upload.tpl.html',
      link: function(scope, elem, attrs) {

        if (elem.attr('hide-buttons') !== "undefined") {
          scope.hideButtons = scope.$eval(elem.attr('hide-buttons'));
        }

        var uploader = scope._uploader = $fileUploader.create({
          scope: scope,
          url: scope.url
        });

        // Public uploader facade
        // DO NOT $WATCH THIS OBJECT
        // Bind to the events instead
        scope.uploader = {
          queue: uploader.queue,
          uploadAll: _.bind(uploader.uploadAll, uploader),
          cancelAll: _.bind(uploader.cancelAll, uploader),
          clearQueue: _.bind(uploader.clearQueue, uploader),
          bind: _.bind(uploader.bind, uploader),
          setUrl: function(url) {
            _.each(uploader.queue, function(file) {
              file.url = url;
            });
          }
        };

        scope.selectFiles = function() {
          elem.find('.input-file').trigger('click');
        };

        uploader.bind('completeall', function (event, items) {
          // console.info('Complete all', items);
        });
      }
    }
  })


  /**
   * Datepicker input field
   */
  .directive('datePicker', function(Utils) {
    return {
      restrict: 'A',
      scope: {
        datePicker: '='
      },
      link: function(scope, elem, attrs) {
        elem.datepicker({
          format: 'dd/mm/yyyy'
        });

        elem.attr('readonly', 'readonly');

        elem.on('changeDate', function() {
          scope.datePicker = Utils.toDate(elem.val());
          scope.$apply();
        });

        scope.$watch('datePicker', function() {
          elem.val(Utils.fromDate(scope.datePicker));
        });
      }
    }
  })


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
          $fieldsets.first().addClass('active').css({
            position: 'relative'
          });
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
        var setHeight = function($elem) {
          var height;

          if ($elem) {
            height = $elem.height();
          } else {
            height = elem.find('.form-step.active').height();
          }

          TweenLite.to(elem, 0.3, {
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
            nextElem.css({
              position: 'relative',
              minHeight: 0
            });

            deferred.resolve();
          }}).pause()

            // Animation initial state for elems
            .set(currentElem, {
              position: 'absolute',
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
            if ( _.has(validator, 'validate') ) {
              validator.validate();
              return validator.isValid();
            }
            return true;
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

          setHeight($next);

          // Play the transition animation
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

          setHeight($prev);

          transitionSteps($current, $prev, true).then(function() {
            // Animtion done
            $current.removeClass('active');
            $prev.addClass('active');
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

        if ( attrs.validate ) {
          var validator = new Parsley(elem);

          elem.on('submit', function(e) {
            validator.validate();

            if ( ! validator.isValid() ) {
              e.preventDefault();
            }
          });
        }        
      }
    };
  })

  /**
   * Show / hide elements based on login status
   *
   * Example: <div logged-in="true">Only logged in users will see this</div>
   */
  .directive('loggedIn', function(Auth) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem = $(elem);
  
        var check = function() {
          var logged = scope.$eval(elem.attr('logged-in'));

          if ( (logged && !Auth.check()) || (!logged && Auth.check()) ) {
            return elem.addClass('hide');
          }

          elem.removeClass('hide');
        };

        check();
      }
    };
  })


  /**
   * Show / hide elements based on users type ('employer', 'student', 'supervisor')
   *
   * Example: <div auth-group="student">Only students will see this</div>
   */
  .directive('authGroup', function(Auth) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem = $(elem);

        var check = function() {
          var group = attrs.authGroup;

          if ( ! Auth.hasAccess(group) ) {
            return elem.addClass('hide');
          }

          elem.removeClass('hide');
        };

        check();
      }
    };
  })



  /**
   * Checkbox list input (filter search filter)
   */
  .directive('checkboxList', function() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        options: '=',
        selected: '=',
        filterable: '=?'
      },
      template: '<div class="checkbox-list">' +
                  '<input ng-show="filterable" type="text" ng-model="query" placeholder="Filter results...">' +
                  '<div class="scroll-box">' +
                    '<div class="group" ng-repeat="group in _options">' +
                      '<strong ng-if="group.group" class="group-title">{{ group.group }}</strong>' +
                      '<div class="checkbox" ng-repeat="item in group.children | filter:query"><label><input type="checkbox" ng-checked="isSelected(item)" ng-click="toggle(item)"> {{ item }}</label></div>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      link: function(scope, elem, attrs) {

        scope.toggle = function(value) {
          var index = _.indexOf(scope.selected, value);

          if ( index > -1 ) {
            scope.selected = _.without(scope.selected, value);
          } else {
            scope.selected.push(value);
          }
        };

        scope.isSelected = function(value) {
          return _.indexOf(scope.selected, value) > -1;
        };

        scope.$watch('selected', function(newVal) {
          if ( _.isString(newVal) ) {
            newVal = [newVal];
          }
          scope.selected = newVal || [];
        }, true);

        scope.$watch('options', function(newVal) {
          if ( _.isArray(newVal) && _.isUndefined(newVal[0].children) ) {
            scope._options = [{
              children: newVal
            }]
          } else {
            scope._options = newVal;
          }
        }, true);
      }
    };
  })


  ;
