app.factory("EditInfoService", ["$http", "Domain", "AuthService", 
  function ($http, Domain, AuthService) {

    var error_catch  = function(res){
      if(res.data)
          return $q.reject(res.data.errors.toString());
      else
          return $q.reject('Error');
    };

    var return_data = function(res){
      return res.data;
    };
  
    return {
      user_basic_info: function (data) {
        var url = Domain + "/users/basic_info";
        var headers = {headers:AuthService.get_request_headers()};
        return $http.put(url,data,headers)
        .then(return_data)
        .catch(error_catch);
      },

      user_profile_picture: function (data) {
        var url = Domain + "/users/profile_picture";
        var headers = {headers:AuthService.get_request_headers()};
        return $http.put(url,data,headers)
        .then(return_data)
        .catch(error_catch);
      }

    }

  }
]);
