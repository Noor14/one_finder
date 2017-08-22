app.factory("RatingService", ["$http", "Domain", "$cookies",'$q',
	
	function ($http, Domain, $cookies,$q) {

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
	    };

	    function return_data(res){
	      return res.data;
	    }

	    function post(id,data){
			var url = Domain + "/users/" + id + "/ratings",
			headers = {headers:get_headers()};
	    	return $http.post(url,data,headers)
	    		.then(return_data)
	    		.catch(error_catch);
		}

		function list(id,query){
			var url = Domain + '/users/' + id +'/ratings' + query,
			headers = {headers:get_headers()};
			return $http.get(url,headers)
				.then(return_data)
				.catch(error_catch);
		}

		function get(id,rating_id){
			var url = Domain + '/users/' + id +'/ratings/' + rating_id,
			headers = {headers:get_headers()};
			return $http.get(url,headers)
				.then(return_data)
				.catch(error_catch);
		}

		function edit(id,data){
			var url =  Domain + '/users/' + id +'/ratings/' + data.id,
			headers =  {headers: get_headers()};
			return $http.put(url,data,headers)
				.then(return_data)
				.catch(error_catch);
		}

		function del(id,rating_id){
			var url = Domain + '/users/' + id +'/ratings/' + rating_id,
			headers = {headers:get_headers()};
			return $http.delete(url,headers)
				.then(function(){return 'Removed!'})
				.catch(error_catch)
		}

		return {
			create_rating: post,
			
			list_ratings:  list,
			
			get_rating:    get,
			
			edit_rating:   edit,
			
			delete_rating: del
		}

	}
]);