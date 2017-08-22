app.controller('MainCtrl',['$scope','AuthService','$cookies','toastr','$state','ngDialog',
	function($scope,AuthService,$cookies,toastr,$state,ngDialog){

		$scope.user        = AuthService.getUserDetails();
		$scope.user_role   = $cookies.get('user_current_role');
	    $scope.signout_btn = false;
	    $scope.form_submit = false;

    	$scope.submit_logout = function(){
			$scope.form_submit = true;
			AuthService.log_out()
		    .then(function(){
		    	AuthService.setUserDetails(undefined);
				$cookies.remove('client');
				$cookies.remove('sessionToken');
				$cookies.remove('email');
				$cookies.remove('user');
				$cookies.remove('user_current_role');
		       	$scope.form_submit = false;
		        $state.go('auth.login');
		      	toastr.success('You logged out Successfully', 'Success!');
		    })
		    .catch(function (error) {
      	    	$scope.form_submit = false;
		      	toastr.error(error, 'Error');
		    });
	  	};

	    $scope.open_create_job_dialog = function () {
	      ngDialog.open({
	        template: '/views/common/create_job_lightbox.html',
	        className: 'ngdialog-theme-default ngdialog-theme-mine dashboard-signup-form',
	        controller:'createjobCtrl'
	      });
	    };

	    $scope.view_profile = function (data) {
	      //$scope.signout_btn = $scope.signout_btn === false ? true : false;
	      $scope.signout_btn = false;
	      $state.go('app.setting.public_profile');
	    };

	    $scope.change_pass = function (data) {
	      $scope.signout_btn = $scope.signout_btn === false ? true : false;
	      $state.go('app.setting.change_password');
	    };

		$scope.togglebtn = function () {
			$scope.signout_btn = $scope.signout_btn === false ? true : false;
		};
	}

]);
