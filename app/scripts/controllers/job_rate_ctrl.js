app.controller('JobRateCtrl',['$scope','RatingService','ratings','toastr', 
	function($scope,RatingService,ratings,toastr){

		$scope.rating = {};
		if(ratings.rating){
			$scope.rating = {
				id:          ratings.rating.id, 
				overall: 	 parseInt(ratings.rating.overall),
				punctuality: parseInt(ratings.rating.punctuality),
				politeness:  parseInt(ratings.rating.politeness),
				quality:     parseInt(ratings.rating.quality),
				service:     parseInt(ratings.rating.service),
				review: 	 ratings.rating.review
			}
		}

		function res_success(){
			toastr.success('Success');
			$scope.closeThisDialog();
			$scope.state.reload();
		}

		function res_error(){
			toastr.error(data,'Error');
		}

		$scope.submit_rating = function(rating){

			if(!rating.overall){
				toastr.error('Overall can not be blank','Error');
				return;
			}

			if(!rating.review){
				toastr.error('Review can not be blank!','Error');
				return;
			}

			rating.jobId = ratings.job_id;
			
			if(rating.id){
				return RatingService.edit_rating(ratings.user_id,rating)
					.then(res_success)
					.catch(res_error)
			}else{
				return RatingService.create_rating(ratings.user_id,rating)
					.then(res_success)
					.catch(res_error)
			}
		}

	}
]);