/**
 * Dashboard Service
 */

app.service('DashboardService', ['$http', '$q', 'Domain','AuthService',
  function ($http, $q, Domain, AuthService) {

    var errorCatch  = function(res){
      if(res.data)
        return $q.reject(res.data.errors.toString());
      else
        return $q.reject('Error');
    };

    var returnData = function(res){
      return res.data;
    };

    return {

      dashboard_detail: function (user_id) {
        var url = Domain + '/users/' + user_id + '/service_provider_dashboard';
        var headers = {headers:AuthService.get_request_headers()};
        return $http.get(url,headers)
        .then(returnData)
        .catch(errorCatch);
      }

    };

  }
]);
