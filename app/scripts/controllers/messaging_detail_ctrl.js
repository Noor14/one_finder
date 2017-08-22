app.controller('MessageDetailCtrl',['$scope','ConversationService','toastr','$state','ActionCableChannel','ActionCableSocketWrangler',
	function($scope,ConversationService,toastr,$state,ActionCableChannel,ActionCableSocketWrangler){

		$scope.input_text = "";
		$scope.myData = [];
		$scope.show_loading = true;
		$scope.status = ActionCableSocketWrangler.connected;
		$scope.wrangler = ActionCableSocketWrangler;
		var consumer = new ActionCableChannel("ConversationsChannel");
		var callback = function(message){
			$scope.myData.push(message);
			return message;
		};

		function setup_socket(data){
			ActionCableSocketWrangler.start();
			consumer.subscribe(callback)
			.then(function(d){
			});
		}

		function fetch_messages(da,q){
			if(!q) q = ' ';

			return ConversationService.get_messages($scope.conversation.id,q)
			.then(function(data){
				$scope.timestamp 	  = data.timestamp;
				$scope.more_available = data.moreAvailable;
				$scope.total_records  = data.totalRecords;
				return $scope.myData  = data.messages.reverse();
			})
		}

		function send(message){
			if(!message || message === "")
				return;

			var payload = {
				body:message,
				conversationId: $scope.conversation.id,
				mediaId: null
			}
			consumer.send(payload,'receive');
			$scope.input_text = "";
		};

		$scope.send_message = send;

		function error_catch(data){
			toastr.error(data,'Error');
		}
	    function change_page(){

	      if ($scope.more_available) {
	        $scope.previous_page = $scope.current_page;
	        fetch_messages(null,get_query_string($scope.current_page, $scope.timestamp))
	        	.catch(error_catch);
	      }
	      if ($scope.current_page < $scope.previous_page) {
	        fetch_messages(null,get_query_string($scope.current_page, $scope.timestamp))
	        	.catch(error_catch);
	      }
	    };

	    function get_query_string(page, time) {
	      return '?page=' + page + '&timestamp=' + time;
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
      if(!$scope.more_available){
				return;
			}
			else{
				$scope.current_page++;
				change_page();
			}
		}
		//reverse order because of how messages are being displayed
		$scope.prev_page = next_page;
		$scope.next_page = prev_page;
		$scope.timestamp = '';
		$scope.more_available = false;
		$scope.total_records  = 0;
		$scope.current_page   = 1;
		$scope.previous_page  = 1;

		function init(){
			$scope.user = $scope.$parent.user;
			$scope.show_loading = true;
			ConversationService.get($state.params.id)
			.then(function(data){
				$scope.conversation = data;
				$scope.show_loading = false;
				return data;
			})
			.then(fetch_messages)
			.then(setup_socket)
			.catch(function(data){
				$scope.show_loading = false;
				toastr.error('Error while fetching data','Error');
			})
		}

		init();
	}
])
