app.factory("ServiceProviderService", ["$http", "Domain",'AuthService','$q',

   function ($http, Domain,AuthService,$q) {

    function error_catch(res){
      if(res.data)
          return $q.reject(res.data.errors.toString());
      else
          return $q.reject('Error');
    };

    function return_data(res){
      return res.data;
    }


  return {
    reg_serviceprovider: function (data) {
      var url = Domain + '/users/service_provider_details';
      var headers = {headers:AuthService.get_request_headers()};
      return $http.post(url,data,headers)
      .then(return_data)
      .catch(error_catch);
    },

    edit_reg_serviceprovider: function (data) {
      var url =  Domain + "/users/service_provider_details";
      var headers = {headers:AuthService.get_request_headers()};
      return $http.put(url,data,headers)
      .then(return_data)
      .catch(error_catch);
    },
  }
  }
]);
