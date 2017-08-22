app.factory("CountryCitiesService", ["$http", "Domain", "$cookies", function ($http, Domain, $cookies) {

  return {
    get_countries: function () {
      return $http({
        method: 'GET',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/countries",
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },

    get_cities: function (id) {
      return $http({
        method: 'GET',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/countries/" + id + "/cities",
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },


    edit_cities: function (data) {
      return $http({
        method: 'PUT',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/users/cities_of_operation",
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
        data: data
      });
    }
  }

}]);
