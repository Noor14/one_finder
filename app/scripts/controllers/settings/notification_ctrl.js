app.controller('SettingNotificationsCtrl',['$scope','NotificationService',
  function($scope,NotificationService){
    
    function get_query_string(page, time) {
      return '?page=' + page + '&timestamp=' + time;
    }

    $scope.change_page_notif = function(curr){
      //going to a next page
      if ($scope.more_available_notif){
        $scope.previous_page_notif = curr;
        get_notifications(get_query_string(curr, $scope.timestamp_notif));
      }
      // going to a prev page
      if (curr < $scope.previous_page_notif) {
        get_notifications(get_query_string(curr, $scope.timestamp_notif));
      }
    };

    function get_notifications(query){
      if(!query) query = ' ';
      NotificationService.list_notifications(query)
      .then(function(res){
        $scope.notifications        = res.notifications;
        $scope.more_available_notif = res.moreAvailable;
        $scope.total_records_notif  = res.totalRecords;
        $scope.timestamp_notif      = res.timestamp;
        $scope.current_page_notif   = res.page;
        $scope.num_pages_notif      = Math.round(res.totalRecords / res.pageSize);
      })
      .catch(function (data) {
        toastr.error(data,'Error');
      })
    }

    $scope.$parent.tab = 50;      
    $scope.total_records_notif  = 0;
    $scope.items_per_page_notif = 20;
    $scope.current_page_notif   = 1;
    $scope.previous_page_notif  = 1;
    $scope.timestamp_notif      = '';
    $scope.more_available_notif = false;
    get_notifications();
  }
]);