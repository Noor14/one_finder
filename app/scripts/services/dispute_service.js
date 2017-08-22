/**
 * Dispute Service 
 */

app.service('DisputeService', ['$http', '$q', 'Domain', 'UtilService','AuthService', 
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
   		
        var create = function(job_id,dispute){
            var url =  Domain + '/jobs/' + job_id + '/disputes';
            var headers = {headers:AuthService.get_request_headers()};
              return $http.post(url,dispute,headers)
              .then(returnData);       
        }

   		this.create_dispute = function(job_id,dispute,upload_pic){
   			
            if(!upload_pic){
                return create(job_id,dispute)
                .catch(errorCatch);
            }else{
                return UtilService.uploadPictures(dispute.images)
                .then(function(photo_ids){
                    dispute.disputeMessage.photos = [];
                    dispute.disputeMessage.photos = photo_ids;
                    delete dispute.images;
                    return create(job_id,dispute);
                })
                .catch(errorCatch)
            }
   		}

        var send = function(job_id,message){
            var url = Domain + '/jobs/' + job_id + '/disputes/dispute_messages';
            var headers = {headers:AuthService.get_request_headers()};
            return $http.post(url,message,headers)
            .then(returnData) 
        }

   		this.send_dispute_message = function(job_id,message,upload_pic){
            console.log(upload_pic)
            if(!upload_pic){
                return send(job_id,message)
                    .catch(errorCatch);                
            }else{
                return UtilService.uploadPictures(message.images)
                .then(function(photo_ids){
                    message.photos = photo_ids;
                    delete message .images;
                    return send(job_id,message)
                })
                .catch(errorCatch);
            }

   		}

   		this.edit_dispute_message = function(job_id,dispute_message){
   			var url =  Domain + '/jobs/' + job_id + '/disputes/dispute_messages/' + dispute_message.id;
			var headers = {headers:AuthService.get_request_headers()};
			return $http.put(url,dispute_message,headers)
			.then(returnData)
			.catch(errorCatch);
   		}

   		this.get_dispute_history = function(job_id){
   			var url = Domain + '/jobs/' + job_id + '/disputes';
   			var headers = {headers:AuthService.get_request_headers()};
        	return $http.get(url,headers)
        	.then(returnData)
        	.catch(errorCatch);   			
   		}

   		this.escalate_to_onefindr = function(job_id){
   			var url = Domain + '/jobs/' + job_id + '/disputes/escalate';
   			var headers = {headers:AuthService.get_request_headers()};
        	return $http.put(url,{},headers)
        	.then(returnData)
        	.catch(errorCatch);      			
   		}

   		this.resolve_dispute  = function(job_id){
   			var url = Domain  + '/jobs/' + job_id + '/disputes/resolve';
   			var headers = {headers:AuthService.get_request_headers()};
        	return $http.put(url,{},headers)
        	.then(returnData)
        	.catch(errorCatch);
   		}
 	}
]);