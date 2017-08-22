
app.controller("MyJobsSPCtrl", ["$scope", "jobsService", "toastr", "$state",

	function ($scope, jobsService, toastr, $state) {

		$scope.my_jobs       = [];
		$scope.moreAvailable = false;
		$scope.pageSize      = 0;
		$scope.timestamp 	 = '';
		$scope.totalRecords  = 0;
		$scope.itemsPerPage  = 20;
		$scope.currentPage   = 1;
	    $scope.previousPage  = 1;
		$scope.filter 		 = {};
		$scope.job_status    = [
			{id:1,val:'In Bidding'},
			{id:2,val:'Bidding Closed'},
			{id:3,val:'Not Started'},
			{id:4,val:'Started'},
			{id:5,val:'Not Assigned'},
			{id:6,val:'Assigned'},
			{id:7,val:'Recently Completed'},
			{id:8,val:'In dispute'},
			{id:9,val:'Signed Off'}
		];

		$scope.job_status_employee = [
			{id:3,val:'Not Started'},
			{id:4,val:'Started'},
			{id:7,val:'Recently Completed'}
		];

		function error_catch(res){
			$scope.loader = false;
			toastr.error('Error while fetching data','Error');
		}
		function get_filtered_jobs(q){
			return 	jobsService.get_my_jobs_sp(q);
		}

		function get_assigned_jobs(q){
			return jobsService.get_my_jobs_employee(q);
		}

		function fill_data(res){
			$scope.loader = false;
			$scope.my_jobs = res.data.jobs;
			$scope.my_jobs.forEach(function(job){
	  			job.end_time =  moment(job.biddingEnds).toNow(true);
			})
			$scope.moreAvailable = res.data.moreAvailable;
			$scope.totalRecords = res.data.totalRecords;
			$scope.timestamp = res.data.timestamp;
			$scope.currentPage = res.data.page;
		}

		function fetch_data(is_user_employee,query){

			if(!query)
				query = ' ';

			$scope.loader = true;
			if(is_user_employee){
				get_assigned_jobs(query)
					.then(fill_data)
					.catch(error_catch)
			}else{
				get_filtered_jobs(query)
					.then(fill_data)
					.catch(error_catch)
			}
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

	    $scope.get_status = function(status){
	    	var ret = $scope.job_status.filter(function(fil){
	    		return fil.id === status;
	    	})
	    	return ret[0].val;
	    }

		$scope.filter_the_jobs = function(filt){
			fetch_data($scope.is_user_employee,get_query_string(undefined,undefined,$scope.filter.status))
		}

		$scope.clear_filter = function(){
			$scope.filter.status = undefined;
			$state.reload();
		}

	    $scope.change_page = function () {

	      //going to a next page
	      if ($scope.moreAvailable) {
	        $scope.previousPage = $scope.currentPage;
	        fetch_data($scope.is_user_employee,get_query_string($scope.currentPage, $scope.timestamp));
	      }
	      // going to a prev page
	      if ($scope.currentPage < $scope.previousPage) {
	        fetch_data($scope.is_user_employee,get_query_string($scope.currentPage, $scope.timestamp));
	      }
	    };

		$scope.$on('$viewContentLoaded',function(){
			$scope.user  = $scope.$parent.user;
			//Employer || Freelancer can see all type of jobs (1,2)
			//Employee can only see assigned jobs (3)

        $scope.is_user_employee  =  $scope.user.serviceProviderDetails.type === 3;
			fetch_data($scope.is_user_employee);
		});
	}
]);
