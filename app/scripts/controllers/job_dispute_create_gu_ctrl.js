app.controller('JobDisputeCreateGUCtrl',['$scope','job','DisputeService','toastr',
	function($scope,job,DisputeService,toastr){

		var job_id = job.id;

		function create(dispute){
			var payload = {
				title: dispute.title,
				disputeMessage:{
					description: dispute.description
				}
			}

			var upload_pic = false;
			if(dispute.photos){
				if(dispute.photos.length > 0){
					upload_pic = true;
					payload.images = dispute.photos;
				}
			}

			DisputeService.create_dispute(job_id,payload,upload_pic)
			.then(function(data){
				$scope.closeThisDialog();
				$scope.state.reload();
			})
			.catch(function(data){
				toastr.error(data,'Error');
			})
		}

		function add(photo){
      		if(jQuery.isEmptyObject(photo) || typeof photo === 'undefined')
        		return;
      		if(!$scope.dispute.photos)
        		$scope.dispute.photos = [];
      		if($scope.dispute.photos.length === 5){
        		toastr.error('You can only upload five photos');
        		return;
      		}
      		$scope.dispute.photos.push(photo);
      		$scope.dispute.photo = undefined;
		}

		function remove(index){
			$scope.dispute.photos.splice(index,1);
		}
		$scope.dispute = {};
		$scope.add_photo = add;
		$scope.remove_photo = remove;
		$scope.create_dispute = create;

	}
]);