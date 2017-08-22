app.factory("UserService", ["$http", "Domain", 'AuthService','$q',
	
	function ($http, Domain,AuthService,$q) {
	    
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

			switch_role: function(){
				var url = '/users/switch_role';
   				var headers = {headers:AuthService.get_request_headers()};
   				return $http.put(url,headers)
   				.then(returnData)
   				.catch(errorCatch);
			},

		  	list_employees: function(query){
		  		
		  		var url = Domain  + '/employments' + query;
   				var headers = {headers:AuthService.get_request_headers()};
		  		return $http.get(url,headers)
		  		.then(returnData)
		  		.catch(errorCatch);
		  	},

		  	add_employee: function(data){
		  		var url = Domain  + '/employments';
   				var headers = {headers:AuthService.get_request_headers()};
   				return $http.post(url,data,headers)
   				.then(returnData)
   				.catch(errorCatch);
		  	},

		  	edit_employee_details: function(id,data){
		  		var url =  Domain  + '/employments/' + id;
   				var headers = {headers:AuthService.get_request_headers()};
   				return $http.put(url,data,headers)
   				.then(returnData)
   				.catch(errorCatch);
		  	},

		  	remove_employee: function(id){
		  		var url =  Domain  + '/employments/' + id;
   				var headers = {headers:AuthService.get_request_headers()};
   				return $http.delete(url,headers)
   				.then(returnData)
   				.catch(errorCatch);
		  	},

		  	accept_employment: function(id){
		  		var url = Domain  + '/employments/'+ id + '/accept';
   				var headers = {headers:AuthService.get_request_headers()};
   				return $http.put(url,{},headers)
   				.then(returnData)
   				.catch(errorCatch);
		  	},
		  	
		  	reject_employment: function(id){
		  		var url = Domain + '/employments/' + id + '/reject_employment';
   				var headers = {headers:AuthService.get_request_headers()};
   				return $http.delete(url,headers)
   				.then(returnData)
   				.catch(errorCatch)
		  	}

		}
	}
]);
