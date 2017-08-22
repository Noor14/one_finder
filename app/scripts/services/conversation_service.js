/**
 * Conversation Service 
 */

 app.service('ConversationService', ['$http', '$q', 'Domain', 'UtilService','AuthService', 
    function ($http, $q, Domain,UtilService,AuthService) {
	    
	    var errorCatch  = function(res){
            if(res.data)
                return $q.reject(res.data.errors.toString());
            else
                return $q.reject('Error');
        };

        var returnData = function(res){
            return res.data;
		};

		this.start = function(data){
			var url = Domain + '/conversations';
   			var headers = {headers:AuthService.get_request_headers()};
   			return $http.post(url,data,headers)
   				.then(returnData)
   				.catch(errorCatch);
		}

		this.list = function(q){
			var url = Domain + '/conversations' + q;
   			var headers = {headers:AuthService.get_request_headers()};
   			return $http.get(url,headers)
   				.then(returnData)
   				.catch(errorCatch);
		}

		this.get = function(id){
			var url = Domain + '/conversations/' + id;
   			var headers = {headers:AuthService.get_request_headers()};
   			return $http.get(url,headers)
   				.then(returnData)
   				.catch(errorCatch);
		}

		this.get_messages = function(id,q){
			var url = Domain + '/conversations/' + id + '/messages' + q;
   			var headers = {headers:AuthService.get_request_headers()};
   			return $http.get(url,headers)
   				.then(returnData)
   				.catch(errorCatch);			
		}

		this.send_message = function(id,data){
			var url = Domain + '/conversations/' + id + '/messages';
   			var headers = {headers:AuthService.get_request_headers()};
   			return $http.post(url,data,headers)
   				.then(returnData)
   				.catch(errorCatch);	
		}

		this.clarification_public = function(conversation_id,message_id){
			var url = Domain + '/conversations/'+ conversation_id + '/messages/' + message_id;
   			var headers = {headers:AuthService.get_request_headers()}; 
   			return $http.put(url,{},headers)
   				.then(returnData)
   				.catch(errorCatch);
		}
	}
]);