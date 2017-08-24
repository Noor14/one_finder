app.factory("NotificationService", ["$http","$q", "Domain", "AuthService",

	function ($http, $q, Domain, AuthService) {

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

			list_notifications: function(query){
				var url = Domain + '/notifications' + query;
				var headers = {headers:AuthService.get_request_headers()};
				return $http.get(url,headers)
				.then(return_data)
				.catch(error_catch);
			}

		}
	}
]);
