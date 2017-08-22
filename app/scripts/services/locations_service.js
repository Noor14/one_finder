app.factory('locationsService', ['$http', '$cookies', 'Domain', function ($http, $cookies, Domain) {
  return {
    get_all_locations: function () {
      return $http({
        method: 'GET',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/locations",
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        }
      });
    },

    get_a_location: function (location_id) {
      return $http({
        method: 'GET',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/locations/" + location_id,
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
      });
    },

    edit_a_location: function (location_id, data) {
      return $http({
        method: 'PUT',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/locations/" + location_id,
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
        data: data
      });
    },

    add_a_location: function (data) {
      return $http({
        method: 'POST',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/locations",
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
        data: data
      });
    },

    delete_a_location: function (location_id) {
      return $http({
        method: 'DELETE',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/locations/" + location_id,
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
      });
    },


  }
}]);
