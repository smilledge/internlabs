angular.module('InternLabs.search', [])


  .config(function($routeProvider) {

    $routeProvider

      .when('/search/', {
        templateUrl: 'search/search.tpl.html',
        controller: 'SearchCtrl',
        pageTitle: 'Search',
        resolve: {
          results: function($route, Search, SearchQuery) {
            return Search.query(SearchQuery.serialize($route.current.params));
          },
          options: function($http) {
            return $http.get('/api/search/options').then(function(data) {
              return data.data.data;
            });
          }
        },
        reloadOnSearch: false
      })

      ;

  })


  .controller('SearchCtrl', function($scope, $routeParams, $location, Search, SearchQuery, results, options) {
    var initial = true;
    
    $scope.results = (results.data) ? results.data.results : [];
    $scope.query = SearchQuery.parse($routeParams);
    $scope.query.view = 'list';
    $scope.options = options;

    $scope.search = function() {
      if ( initial ) {
        return initial = false;
      }

      $location.search(SearchQuery.serialize($scope.query));

      Search.query($scope.query).then(function(data) {
        $scope.results = [];
        $scope.results = (data.data) ? data.data.results : [];
      })
    };

    $scope.$watch('query', $scope.search, true);
  
    $scope.query = $location.search();
  })


  /**
   * Search from
   */
  .directive('searchWidget', function() {
    return {
      restrict: 'A',
      templateUrl: 'search/widgets/search.tpl.html',
      scope: {
        _query: '=query',
        options: '=?'
      },
      link: function(scope, elem, attrs) {
        scope.showAdvanced = false;

        scope.toggleAdvanced = function() {
          scope.showAdvanced = !scope.showAdvanced;
        };

        scope.search = function() {
          scope._query = angular.copy(scope.query);
        }

        scope.$watch('_query', function(newVal) {
          if (newVal) {
            scope.query = angular.copy(scope._query);
          }
        }, true);

      }
    };
  })



  /**
   * Toggle between map and list view
   */
  .directive('resultsViewToggle', function() {
    return {
      restrict: 'A',
      template: '<div class="btn-group results-view-toggle">' +
                  '<button type="button" ng-class="{\'btn\': query.view!=\'list\', \'btn active\': query.view == \'list\'}" ng-click="set(\'list\')"><i class="fa fa-list"></i> List View</button>' +
                  '<button type="button" ng-class="{\'btn\': query.view!=\'map\', \'btn active\': query.view == \'map\'}" ng-click="set(\'map\')"><i class="fa fa-map-marker"></i> Map View</button>' +
                '</div>',
      scope: {
        query: '='
      },
      link: function(scope, elem, attrs) {
        scope.set = function(view) {
          scope.query.view = view;
        };
      }
    };
  })



  /**
   * Results map view
   */
  .directive('resultsMap', function($compile) {
    return {
      restrict: 'A',
      templateUrl: 'search/results-map.tpl.html',
      replace: true,
      scope: {
        query: '=',
        results: '='
      },
      link: function(scope, elem, attrs) {

        var infoWindowTemplate = elem.find('#infoWindowTemplate').html();

        /**
         * GMaps Object
         */
        var gmap = null;

        /**
         * Render Map
         */
        var initMap = function() {
          gmap = new GMaps({
            div: '#map',
            lat: -12.043333,
            lng: -77.028333,
            mapTypeControl: false,
            minZoom: 5,
            visible: true,
            idle: function() {
              console.log('idle');
            },
            click: function() {
              _.each(gmap.markers, function(marker) {
                marker.infoBox.close();
              });
            }
          });

          addMarkers();
        }

        /**
         * Add markers to the map for all results
         */
        var addMarkers = function() {
          _.each(scope.results, function(result, key) {

            // Marker Options
            var markerOptions = {
              lat: result.address.lat,
              lng: result.address.lng,
              animation: google.maps.Animation.DROP,
              click: function() {
                // Hide other infoboxes
                var self = this;
                _.each(gmap.markers, function(marker) {
                  if ( marker != self ) {
                    marker.infoBox.close();
                  }
                });

                // Show the infobox
                this.infoBox.open(this.map, this);

                // Center on the map
                gmap.setCenter(this.getPosition().lat(), this.getPosition().lng(), function() {});
              }
            }

            var marker = gmap.addMarker(markerOptions);

            // Attach the listing data to the marker
            marker.result = result;
            marker.infoBox = getInfoBox(marker);
          });

          fitBounds();
        }

        /**
         * Get the bounds of all the results and resize the map
         */
        var fitBounds = function() {
          var bounds = new google.maps.LatLngBounds();
          _.each(scope.results, function(result, key){
            if ( ! result.address.lat || ! result.address.lng ) { return; };
            bounds.extend( new google.maps.LatLng( result.address.lat , result.address.lng ) );
          });
          gmap.fitBounds(bounds);
        }
        

        /**
         * Add an infobox to a map mapker
         */
        var getInfoBox = function(marker) {
          var content = getInfoBoxContent(marker);

          var options = {
             content: content,
             alignBottom: true,
             closeBoxURL: "",
             pixelOffset: new google.maps.Size(-160, 0),
             infoBoxClearance: new google.maps.Size(1, 1)
          }

          return new InfoBox(options);
        }

        /**
         * Get the content for an infobox
         */
        var getInfoBoxContent = function(marker) {
          var boxScope = scope.$new(true);
          boxScope.result = marker.result;

          // Create the infobox
          var elem = $compile(infoWindowTemplate)(boxScope);

          elem.find('.close-button').on('click', function() {
            marker.infoBox.close();
          });

          return elem[0];
        }


        $(window).on('resize', fitBounds);

        initMap();

      }
    };
  })


  ;