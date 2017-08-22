app.factory("document_service", ["$http", "Domain","$q","AuthService", 
  function ($http, Domain, $q,AuthService) {

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
      create: function(image){
        var url = Domain + '/documents';
        var headers = {headers:AuthService.get_request_headers()};
        return $http.post(url,image,headers)
          .then(return_data)
          .catch(error_catch)
      }
    }
  }
]);
