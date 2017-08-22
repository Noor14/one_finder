app.factory("InfoService", ["$http", "Domain", "AuthService","$q",

    function ($http, Domain, AuthService, $q) {

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
            user_serviceprovider_dashboard: function (id) {
                var url = Domain + "/users/" + id + "/service_provider_dashboard";
                var headers = {headers:AuthService.get_request_headers()};
                return $http.get(url,headers)
                .then(return_data)
                .catch(error_catch);
            }
        }
    }
]);
