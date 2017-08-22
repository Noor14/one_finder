app.controller("SettingLocationsCtrl", ["$scope", "$http", "toastr", 'ngDialog', '$rootScope', '$state', 'CountryCitiesService', "$timeout", 'Map', '$filter', '$rootScope', 'locationsService', 'uiGmapGoogleMapApi', '$log', 
  function ($scope, $http, toastr, ngDialog, $rootScope, $state, CountryCitiesService, $timeout, Map, $filter, $rootScope, locationsService, uiGmapGoogleMapApi, $log) {

    $scope.$parent.tab = 12;
    var vm = this;
    $scope.map = {
      center: {
        latitude: 25.2048493,
        longitude: 55.270782800000006
      },
      control: {},
      zoom: 14
    };

    var markerEvents = {
      dragend: function (marker, eventName, args) {
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();

        $scope.marker.options = {
          draggable: true,
          // labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };

        $scope.new_loc.latitude = $scope.marker.coords.latitude;
        $scope.new_loc.longitude = $scope.marker.coords.longitude;
        Map.setCoords($scope.marker.coords);

      }
    };

    $scope.marker = {
      id: 0,
      coords: {
        latitude: 0,
        longitude: 0
      },
      options: {draggable: true},
      events: markerEvents
    };

    $scope.getmyLocation = function () {
      getLocation();
    };

    function getLocationSuccFn(position) {
      $scope.map.center.latitude = position.coords.latitude;
      $scope.map.center.longitude = position.coords.longitude;
      $scope.marker.coords.latitude = position.coords.latitude;
      $scope.marker.coords.longitude = position.coords.longitude;
      $scope.map.control.refresh({latitude: $scope.map.center.latitude, longitude: $scope.map.center.longitude});

      $scope.new_loc.latitude = $scope.map.center.latitude;
      $scope.new_loc.longitude = $scope.map.center.longitude;

      Map.setCoords($scope.marker.coords);

      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";
      $http.get(url)
        .then(function (result) {


          var results = result.data.results;
          var status = result.data.status;

          if (status == google.maps.GeocoderStatus.OK) {
            var myLocation;

            for (var i = 0; i < results[0].address_components.length; i++) {
              var addr = results[0].address_components[i];
              var getCountry;
              var getAdministrative;
              var getLocality;

              if (addr.types[0] == 'locality') {
                getLocality = addr.long_name;
                $rootScope.input_city = getLocality;
                myLocation = getLocality + ', ';
              }
              if (addr.types[0] == 'administrative_area_level_1') {
                getAdministrative = addr.long_name;
                // console.log(getAdministrative);
                myLocation += getAdministrative + ', ';
              }
              if (addr.types[0] == 'country') {
                getCountry = addr.long_name;
                var input_country = getCountry;
                myLocation += getCountry;
              }
            }
            $scope.locality = myLocation;
            // console.log(myLocation);
          }
          ;


          CountryCitiesService.get_countries().success(function (data) {
            $scope.countries = data;


            angular.forEach($scope.countries, function (country) {
              if (input_country === country.name) {
                $scope.new_loc.countryId = country.id;


                $scope.get_cities_name($scope.new_loc.countryId);

              }


            });

          }).error(function (error) {
            toastr.error(error.errors[0]);
          });


        });
    };

    function getLocationErrFn(error) {
      console.log("fail");
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          $scope.map = {
            center: {latitude: 39.8282, longitude: -98.5795},
            zoom: 4
          };
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          $scope.map = {
            center: {latitude: 39.8282, longitude: -98.5795},
            zoom: 4
          };
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          $scope.map = {
            center: {latitude: 39.8282, longitude: -98.5795},
            zoom: 4
          };
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          $scope.map = {
            center: {latitude: 39.8282, longitude: -98.5795},
            zoom: 4
          };
          break;
      }
    };

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocationSuccFn, getLocationErrFn, {timeout: 10000});
      }
    }

    function getLatitudeLongitude(callback, address) {
      // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
      address = address || 'Ferrol, Galicia, Spain';
      // Initialize the Geocoder
      geocoder = new google.maps.Geocoder();
      if (geocoder) {
        geocoder.geocode({
          'address': address
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            callback(results[0]);
          }
        });
      }
    }

    $scope.chng_location = function (id) {

      $scope.req_id = id;

      angular.forEach($scope.cities, function (city) {
        if ($scope.req_id === city.id) {

          $scope.req_city_name = city.name;
          getLatitudeLongitude(showResult, $scope.req_city_name);
          console.log($scope.req_city_name);
        }
      });

    };

    function showResult(result) {
      $scope.marker.coords.latitude = result.geometry.location.lat();
      $scope.marker.coords.longitude = result.geometry.location.lng();
      $scope.new_loc.latitude = result.geometry.location.lat();
      $scope.new_loc.longitude = result.geometry.location.lng();
      $scope.map.control.refresh({latitude: result.geometry.location.lat(), longitude: result.geometry.location.lng()});
    }


    $scope.get_cities_name = function (id) {
      CountryCitiesService.get_cities(id).success(function (data) {
        $scope.cities = data;
        angular.forEach($scope.cities, function (city) {
          if ($rootScope.input_city === city.name) {

            $scope.new_loc.cityId = city.id;

          }
        });

      });
    };

    $scope.add_new_location = function () {
      locationsService.add_a_location($scope.new_loc).success(function (data) {
        $scope.new_loc = data;
        toastr.success("Location has Been Added Successfully");
        $state.reload();
      }).error(function (error) {
        toastr.error(error.errors[0]);
      });
    };

    $scope.get_loc_list = function () {
      $scope.locations = {};
      locationsService.get_all_locations().success(function (data) {
        $scope.locations = data;
      }).error(function (error) {
        console.log(error.errors[0]);
      });
    };

    $scope.get_specific_loc = function (id) {
      locationsService.get_a_location(id).success(function (data) {
        console.log(data);
        $scope.location = data;
      }).error(function (error) {
        toastr.error(error.errors[0]);
      })
    };


    $scope.init = function () {
      $scope.new_loc = {};
      $scope.get_loc_list();

      CountryCitiesService.get_countries().success(function (data) {
        $scope.countries = data;
      }).error(function (error) {
        toastr.error(error.errors[0]);
      });

    };

    $scope.init();

  }
]);

