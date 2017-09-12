
app.controller("MyJobsGUCtrl", ["$scope", "jobsService", "toastr", "$state",

	function ($scope, jobsService, toastr, $state) {

		$scope.my_jobs = [];
		$scope.moreAvailable = false;
		$scope.pageSize = 0;
		$scope.timestamp = '';
		$scope.totalRecords = 0;
		$scope.filter = {};
		var status = ' ';

		$scope.job_status = [
			{id:1,val:'In Bidding'},
			{id:2,val:'Bidding Closed'},
			{id:3,val:'Not Started'},
			{id:4,val:'Started'},
			{id:5,val:'Not Assigned'},
			{id:6,val:'Assigned'},
			{id:7,val:'Recently Completed'},
			{id:8,val:'In dispute'},
      {id:9,val:'Signed Off'},
      {id:10,val:'Refunded'}
		];

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

		function get_my_jobs(query){
      		$scope.loader = true;
			if(!query) query = ' ';

			jobsService.get_my_jobs_gu(query)
			.then(function(res){
				$scope.loader = false;
				$scope.my_jobs = res.data.jobs;
				$scope.my_jobs.forEach(function(job){
          			job.end_time =  moment(job.biddingEnds).toNow(true);
        		});
				$scope.moreAvailable = res.data.moreAvailable;
				$scope.totalRecords  = res.data.totalRecords;
				$scope.timestamp 	 = res.data.timestamp;
			})
			.catch(function(data){
	      		$scope.loader = false;
				toastr.error('Error while fetching data','Error');
			})

		}

		$scope.clear_filter = function(){
	      $scope.filter = {};
	      $state.reload();
	      status = undefined;
	    }

	    $scope.change_page = function () {

	      //going to a next page
	      if ($scope.morePagesAvailable) {
	        $scope.previousPage = $scope.currentPage;
	        get_my_jobs(get_query_string($scope.currentPage, $scope.timeStamp,status));
	      }
	      // going to a prev page
	      if ($scope.currentPage < $scope.previousPage) {
	        get_my_jobs(get_query_string($scope.currentPage, $scope.timeStamp,status));
	      }
	    };

	    $scope.get_status = function(status){
	    	var ret = $scope.job_status.filter(function(fil){
	    		return fil.id === status;
	    	})
	    	return ret.length > 0 ? ret[0].val : "";
	    }

		$scope.filter_jobs = function(filter){
	      console.log(filter);
			if(filter.status)
				status = filter.status;

			get_my_jobs(get_query_string(undefined,undefined,status))
		}

		$scope.$on('$viewContentLoaded',function(){
			get_my_jobs();
		});

		$scope.is_empty_object = function(map){
	       for(var key in map)
	          return !map.hasOwnProperty(key);
	       return true;
	    }
	}
]);
