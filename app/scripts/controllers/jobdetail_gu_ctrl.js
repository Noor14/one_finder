app.controller("JobDetailGUCtrl", ["$scope", "jobsService",'toastr', "$state", "ngDialog", "biddingService", "NgMap",'ConversationService','DisputeService',

 	function ($scope, jobsService, toastr, $state, ngDialog, biddingService, NgMap,ConversationService,DisputeService) {

        $scope.slides = [];

	    $scope.get_status = function(status){
	    	var ret = $scope.job_status.filter(function(fil){
	    		return fil.id === status;
	    	})
	    	return ret.length > 0 ? ret[0].val : "";
	    }

		$scope.job_status = [
			{id:1,val:'In Bidding'},
			{id:2,val:'Bidding Closed'},
			{id:3,val:'Not Started Yet'},
			{id:4,val:'Started'},
			{id:5,val:'Not Assigned'},
			{id:6,val:'Assigned'},
			{id:7,val:'Recently Completed'},
			{id:8,val:'In dispute'},
			{id:9,val:'Signed Off'}
		];

		$scope.start_dispute = function(){
	      	ngDialog.open({
	        	template: '/views/common/dispute_create_lightbox.html',
	        	className: 'ngdialog-theme-default dashboard-signup-form',
	        	controller:'JobDisputeCreateGUCtrl',
	        	scope: $scope,
	        	resolve: {
	        		job: function(){
	        			return $scope.my_job_detail;
	        		}
	        	}
	      	});
		}

		$scope.view_dispute = function(){
			ngDialog.open({
				template: '/views/common/dispute_view_lightbox.html',
	        	className: 'ngdialog-theme-default dashboard-signup-form',
	        	controller: 'JobDisputeViewCtrl',
	        	scope: $scope,
	        	resolve:{
	        		job: function(){
	        			return $scope.my_job_detail;
	        		}
	        	}
			})
		}

		$scope.start_convo = function(){
			var payload = {
				userId: $scope.my_job_detail.jobAwardDetails.awardedTo.id,
				jobId:  $scope.my_job_detail.id
			};
			ConversationService.start(payload)
			.then(function(data){
				$state.go('app.messages.detail',{id:data.id});

			})
			.catch(function(data){
				toastr.error(data,'Error');
			})
		}

	  	$scope.job_detail = function () {
			$scope.loader = true;
			jobsService.get_job_detail($state.params.id)
			.success(function (data) {
				$scope.my_job_detail = data;
        if(!$scope.my_job_detail.location){
          $scope.fullWidth = "full-width";
        }
				$scope.my_job_detail.end_time = moment($scope.my_job_detail.biddingEnds).toNow(true);
				$scope.end_date = $scope.my_job_detail.end_time;
		        $scope.my_job_detail.photos.forEach(function(pic,index){
		          $scope.slides.push({id:index,image:pic.url})
		        });
		        if($scope.slides.length === 0)
		          $scope.slides.push({id:0,image:'images/placeholder.jpg'});
				$scope.loader = false;
			}).error(function (error) {
				$scope.loader = false;
				toastr.error(error.errors[0]);
			});
	    };

	    $scope.sign_off_job = function(){
	    	$scope.loader = true;
	    	jobsService.sign_off_job($state.params.id)
	    	.success(function(res){
	    		toastr.success('Signed Off!');
	    		$state.reload();
	    		$scope.loader = false;
	    	})
	    	.error(function(res){
				$scope.loader = false;
				toastr.error(error.errors[0]);
	    	})
	    };

	    $scope.delete_job = function(){
	      	ngDialog.open({
	        	template: '/views/common/dialog_lightbox.html',
	        	className: 'ngdialog-theme-default dashboard-signup-form',
	        	controller:'JobDetailGUCtrl'
	      	});
	    };

	    $scope.open_completion_details = function(type){
	     	var templatePath = '/views/partials/jobs-sp/completion_'+ type + '.html';
	      	ngDialog.open({
	        	template: templatePath,
	        	className: 'ngdialog-theme-default dashboard-signup-form',
	        	controller: 'JobCompletionDetailsCtrl',
	        	resolve: {
	            	job_completion_details: function depFactory() {
	              		return $scope.my_job_detail.jobCompletionDetails;
	          		}
	        	}
	      	});
	    };

	    $scope.dialog_yes = function(){
	    	jobsService.delete_job($state.params.id)
	    	.success(function(){
	    		$scope.closeThisDialog();
	    		toastr.success('Job Removed!');
	    		$state.go('app.jobs-gu');
	    	})
	    	.error(function(res){
				toastr.error(res.toString());
	    		$scope.closeThisDialog();
	    	})
	    }

	    $scope.dialog_no = function(){
	    	$scope.closeThisDialog();
	    }

	    $scope.edit_job = function(){
	      	ngDialog.open({
	        	template: '/views/common/job_edit_lightbox.html',
	        	className: 'ngdialog-theme-default dashboard-signup-form',
	        	controller:'JobEditCtrl',
	        	scope: $scope,
	        	resolve: {
	        		job_detail: function fn(){
	        			return $scope.my_job_detail;
	        		}
	        	}
	      	});
	    }

	    $scope.rate_sp = function(){
	    	ngDialog.open({
	    		template: '/views/common/rating_lightbox.html',
	    		className: 'ngdialog-theme-default dashboard-signup-form',
	    		controller: 'JobRateCtrl',
	    		scope: $scope,
	    		resolve: {
	    			ratings: function fn() {
						return {
							job_id:  $state.params.id,
							rating:  $scope.my_job_detail.review,
							user_id: $scope.my_job_detail.jobAwardDetails.awardedTo.id
						}
	    			}
	    		}
	    	})
	    }

	  	function init(){
	    	$scope.job_detail();
	      	$scope.isOpen = false
	      	$scope.loader = false;
	      	$scope.user   = $scope.$parent.user;
	      	$scope.state  = $state;
	    };
	    init();
  	}
]);
