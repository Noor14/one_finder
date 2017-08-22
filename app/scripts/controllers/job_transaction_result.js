app.controller('JobBidTransSuccessCtrl',['$scope','DisputeService','toastr','$state','biddingService',
	function($scope,DisputeService,toastr,$state,biddingService){
		$scope.state = $state;
		biddingService.accept_bid($state.params.id,$state.params.bid_id,{
			web: true
		})
		.then(function(data){
			toastr.success('Bid accepted');
			$state.go('app.job_detail-gu',{id:$state.params.id})
		})
		.catch(function(data){
			toastr.error(data);
		})
	}
])


app.controller('JobBidTransFailureCtrl',['$scope','DisputeService','toastr','$state',
	function($scope,DisputeService,toastr,$state){
		$scope.state = $state;
	}
])

app.controller('JobBidTransCancelledCtrl',['$scope','DisputeService','toastr',
	function($scope,DisputeService,toastr,$state){
		$scope.state = $state;
	}
])