app.controller('JobBidsCtrl',['$scope','$state','toastr','jobsService','biddingService','$location','$window',
	function($scope,$state,toastr,jobsService,biddingService,$location,$window){

		$scope.bids = [];

		$scope.statuses = [
			{id:0,val:'Processing'},
			{id:1,val:'Assigned'},
			{id:2,val:'Rejected/Expired'},
			{id:3,val:'Shortlisted'}
		];

		$scope.statusFilter = undefined;

		$scope.page = 0;
		$scope.moreAvailable = false;
		$scope.timestamp = ' ';
		$scope.totalRecords = 0;
		$scope.itemsPerPage = 20;
		$scope.statusFilter = undefined;
		$scope.form_submit  = false;

		$scope.get_status = function(status){
			var filter = $scope.statuses.filter(function(stat){
				return stat.id === status;
			})
			return filter[0].val;
		}

		 function get_query_string(page, time,status) {
	    	var q = '?';
	    	var data = {};
	    	var str = [];
	    	if(page)
	    		data.page = page;
	    	if(time)
	    		data.timestamp = time;
	    	if(status)
	    		data.status = status;
	    	for (var d in data)
     			str.push(d + '=' + data[d]);
     		return '?' + str.join('&');
	    }

		function list_bids(query){
			if(!query)
				query = ' ';

			biddingService.list_bids($state.params.id,query)
			.then(function(data){
				$scope.bids = data.bids;
				$scope.page = data.page;
				$scope.moreAvailable = data.moreAvailable;
				$scope.totalRecords  = data.totalRecords;

			})
			.catch(function (data) {
				toastr.error(data);
      		});
		}

		$scope.$on('$viewContentLoaded',function(){
			list_bids();
		})

		function get_url(path){
			 return $location.$$protocol +'://'+$location.$$host +':' + $location.$$port +'/#' + path;
		}

		$scope.accept_bid = function(bid){

			var payload = {
				amount: bid.bidValue,
				return_url: get_url('/app/jobs/' + $state.params.id +'/bid/' + bid.id +'/transaction/success'),
				decline_url: get_url('/app/jobs/' + $state.params.id +'/bid-transaction/failed'),
				cancel_url: get_url('/app/jobs/' + $state.params.id +'/bid-transaction/cancelled')
			}
			biddingService.get_payment_url(payload)
			.then(function(data){
				$window.location = data.url;
			})
			.catch(function(data){
				toastr.error(data,'Error');
			})

		}

		$scope.shortlist_bid = function(bid){
			$scope.form_submit  = true;
			biddingService.shortlist_bid($state.params.id,bid.id)
			.then(function(data){
				toastr.success('Bid Shortlisted');
				$state.reload();
				$scope.form_submit  = false;
			})
			.catch(function(data){
				toastr.error('Error',data);
				$scope.form_submit  = false;
			})
		}

		$scope.remove_from_shortlist = function(bid){
			$scope.form_submit = true;
			biddingService.remove_from_shortlist_bid($state.params.id,bid.id)
			.then(function(data){
				$scope.form_submit = false;
				toastr.success('Bid Removed from the Shortlist!');
				$state.reload();
			})
			.catch(function(data){
				$scope.form_submit = false;
				toastr.error(data);
			})
		}

	  	$scope.change_page = function () {

	      //going to a next page
	      if ($scope.morePagesAvailable) {
	        $scope.previousPage = $scope.currentPage;
	        list_bids(get_query_string($scope.currentPage, $scope.timeStamp,$scope.statusFilter));
	      }
	      // going to a prev page
	      if ($scope.currentPage < $scope.previousPage) {
	        list_bids(get_query_string($scope.currentPage, $scope.timeStamp,$scope.statusFilter));
	      }
	    };

	    $scope.filter_bids =function(f){
    		if(f){
	    		$scope.statusFilter = f.status;
	    		list_bids(get_query_string(undefined,undefined,$scope.statusFilter));
    		}
	    }

	    $scope.clear_filter  = function(){
	    	$scope.statusFilter = undefined;
	    	$state.reload();
	    }
	}
])