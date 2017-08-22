app.controller("MessagingCtrl", ["$scope", 'ConversationService','toastr','$state',
	function ($scope,ConversationService,toastr,$state) {


		function get_conversations(query){
			if(!query) query = '';

			$scope.show_loading = true;
			ConversationService.list(query)
			.then(function(data){
				$scope.conversations  = data.conversations;
				$scope.more_available = data.moreAvailable;
				$scope.total_records  = data.totalRecords;

				$scope.show_loading = false;
			})
			.catch(function(data){
				toastr.error('Error while fetching data','Error');
				$scope.show_loading = false;
			})
		}


		function init(){
			$scope.user = $scope.$parent.user;
			get_conversations()
		}

	    function change_page(){

	      //going to a next page
	      if ($scope.more_available) {
	        $scope.previous_page = $scope.current_page;
	        get_conversations(get_query_string($scope.current_page, $scope.timestamp));
	      }
	      // going to a prev page
	      if ($scope.current_page < $scope.previous_page) {
	        get_conversations(get_query_string($scope.current_page, $scope.timestamp));
	      }
	    };

	    function get_query_string(page, time) {
	      return '?page=' + page + '&timestamp=' + time;
	    }

		function message_detail(convo){
			$state.go('app.messages.detail',{id:convo.id})
		}

		function prev_page(){
			if($scope.current_page === 1){
				return;
			}else{
				$scope.current_page--;
				change_page();
			}
		}

		function next_page(){
			if(!$scope.more_available)
				return
			else{
				$scope.current_page++;
				change_page();
			}
		}
		$scope.timestamp = '';
		$scope.more_available = false;
		$scope.total_records  = 0;
		$scope.current_page   = 1;
		$scope.previous_page  = 1;

		$scope.message_detail = message_detail;
		$scope.prev_page 	= prev_page;
		$scope.next_page 	= next_page;
		$scope.change_page 	= change_page;

		init();
	}
]);
