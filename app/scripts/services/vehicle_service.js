app.factory('vehicleService', ['$http', '$cookies', 'Domain', '$q',
  function ($http, $cookies, Domain,$q) {

    function get_headers(){
      return {
        'Content-Type': 'application/json',
        'sessionToken': $cookies.get('sessionToken'),
        'client': $cookies.get('client'),
        'email': $cookies.get('email')
      }
    }

    function error_catch(res){
      if(res.data)
          return $q.reject(res.data.errors.toString());
      else
          return $q.reject('Error');
    }

    function return_data(res){
      return res.data;
    }


    return {
      get_all_vehicles: function () {
        var url = Domain + "/vehicles";
        var headers = {headers: get_headers()};
        return $http.get(url,headers)
          .then(return_data)
          .catch(error_catch);
      },

      get_specific_vehicle: function (vehicle_id) {
        var url = Domain + "/vehicles/" + vehicle_id;
        var headers = {headers:get_headers()};
        return $http.get(url,headers)
         .then(return_data)
         .catch(error_catch);
      },

      add_vehicle: function (data) {
        var url = Domain + '/vehicles';
        var headers = {headers:get_headers()};
        return $http.post(url,data,headers)
          .then(return_data)
          .catch(error_catch)
      },

      delete_vehicle: function (vehicle_id) {
        var url =  Domain + "/vehicles/" + vehicle_id;
        var headers = {headers: get_headers()};
        return $http.delete(url,headers)
          .then(return_data)
          .catch(error_catch);
      },

      update_vehicle: function (data, vehicle_id) {
        var url = Domain + "/vehicles/" + vehicle_id;
        var headers = {headers: get_headers()};
        return $http.put(url,data,headers)
          .then(return_data)
          .catch(error_catch);
      }
    }
  }
]);
