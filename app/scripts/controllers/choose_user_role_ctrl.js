app.controller('ChooseUserRoleCtrl',['$scope','$cookies','$state','action',
	
	function($scope,$cookies,$state,action){

		//action resolve
		//type 0 => state reload
		//type 1 => state change, value ==> ToState

		function choose_role(user_type){
	    	$cookies.put('user_current_role',user_type);
	     	$scope.closeThisDialog();
	     	if(action.type === 0){
	     		$state.reload();
	     	}else if (action.type === 1){
				$state.go(action.value);
	     	}		
		}

	    $scope.choose_user_type = choose_role;
	}
])