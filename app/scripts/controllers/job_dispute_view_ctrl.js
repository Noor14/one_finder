app.controller('JobDisputeViewCtrl',['$scope','job','DisputeService','toastr',
	function($scope,job,DisputeService,toastr){

		var job = job;
		var statuses = [
			{id:1,val:'Open'},
			{id:2,val:'Escalated to OneFindr'},
			{id:3,val:'Resolved'}];
		
		$scope.messages = [];
		$scope.status;
		$scope.title;
		$scope.send_message = send;
		$scope.resolve   = resolve;
		$scope.escalate  = escalate;
		$scope.get_status= get_status;
		$scope.is_my_job = job.jobAwardDetails.jobStartCode ? true : false;

		function get_status(status){
	    	var ret = statuses.filter(function(fil){
	    		return fil.id === status;
	    	})
	    	return ret.length > 0 ? ret[0].val : "";
	    }

		function get(id){
			DisputeService.get_dispute_history(id)
			.then(function(data){
				$scope.messages = data.disputeMessages;
				$scope.status   = data.status;
				$scope.title    = data.title;
			})
			.catch(function(data){
				toastr.error(data,'Error');
			})
		}

		function send(dispute){
			var payload = {
				description: dispute.description
			}
			var photos = [];
			var upload_pic = false;
			if(dispute.photo){
				photos.push(dispute.photo);
				upload_pic = true;
				payload.images = photos;			
			}

			DisputeService.send_dispute_message(job.id,payload,upload_pic)
			.then(function(data){
				$scope.closeThisDialog();
				$scope.state.reload();
			})
			.catch(function(data){
				toastr.error(data,'Error');
			})			
		}

		function resolve(){
			DisputeService.resolve_dispute(job.id)
			.then(function(data){
				toastr.success('Resolved!');
				$scope.closeThisDialog();
				$scope.state.reload();
			})
			.catch(function(data){
				toastr.error(data,'Error');
			})			
		}

		function escalate(){
			DisputeService.escalate_to_onefindr(job.id)
			.then(function(data){
				toastr.success('Escalated to OneFindr!');				
				$scope.closeThisDialog();
				$scope.state.reload();
			})
			.catch(function(data){
				toastr.error(data,'Error');
			})				
		}
		get(job.id);

	}
]);