app.controller("DashboardCtrl", ["$scope", 'ngDialog','DashboardService','NotificationService','AuthService','toastr','jobsService','UserService','$cookies','vehicleService','locationsService',
  function ($scope, ngDialog, DashboardService,NotificationService,AuthService,toastr,jobsService,UserService,$cookies,vehicleService,locationsService) {

    $scope.my_jobs = [];
    $scope.moreAvailable = false;
    $scope.pageSize = 0;
    $scope.timestamp = '';
    $scope.totalRecords = 0;
    $scope.filter = {};
    $scope.inprocss = true;
    var status = ' ';


	  $scope.signupForm = function(){
	    ngDialog.open({
	    	template: '/views/common/lightbox.html',
	    	className: 'ngdialog-theme-default dashboard-signup-form'
	    });
	  };

    function get_dashboard(user_id) {
      $scope.loader = true;
      DashboardService.dashboard_detail(user_id)
      .then(function (data) {
        $scope.dashboard = data.data;
        $scope.loader = false;
      })
      .catch(function (data) {
        toastr.error(data, 'Error');
      });
    };

    function get_notifications(query) {
      if(!query) query = ' ';

      NotificationService.list_notifications(query)
      .then(function(res){
        $scope.notifications = res.notifications;
      })
      .catch(function (data) {
        toastr.error(data, 'Error');
      });
    };

    function getUser_details(){

      AuthService.validate_token()
      .then(function(res){
        $scope.user = res;
      })
      .catch(function(data){
        toastr.error(data,'Error');
      })

    };

    $scope.job_status = [
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

      if(!query) query = ' ';

      if($scope.user_role === 'general_user'){
        jobsService.get_my_jobs_gu(query)
          .then(function(res){
            $scope.my_jobs = res.data.jobs;
          })
          .catch(function(data){
            toastr.error('Error while fetching data','Error');
          });
      }else if ($scope.user_role === 'service_provider'){
        jobsService.get_my_jobs_sp(query)
          .then(function(res){
            $scope.my_jobs = res.data.jobs;
          })
          .catch(function(data){
            toastr.error('Error while fetching data','Error');
          });
      }
    };

    $scope.get_status = function(status){
      var ret = $scope.job_status.filter(function(fil){
        return fil.id === status;
      })
      return ret.length > 0 ? ret[0].val : "";
    };

    $scope.filter_jobs = function(status){

      if(status == 1){
        $scope.inprocss = true;
        $scope.indispute = false;
        $scope.bidding_complete = false;
      }
      if(status == 8){
        $scope.indispute = true;
        $scope.inprocss = false;
      }

      if(status == 2){
        $scope.bidding_complete = true;
        $scope.inprocss = false;
      }

      get_my_jobs(get_query_string(undefined,undefined,status))
    };

    function get_employees(){
      if($scope.user.serviceProviderDetails){
        if($scope.user.serviceProviderDetails.type === 1){
          UserService.list_employees('')
            .then(function(data){
              $scope.employees = data;
              $scope.totalEmp = $scope.employees.length;
            })
            .catch(function(data){
              toastr.error(data,'Error');
            });
        }
      }
    };

    function get_vehicles() {

      vehicleService.get_all_vehicles()
        .then(function (data) {
          $scope.vehicles = data;
        })
        .catch(function (error) {
          toastr.error('Errors');
        });

    };

    function get_loc_list(){
      $scope.user_locations = {};
      locationsService.get_all_locations()
      .success(function (data) {
        $scope.user_locations = data;
      }).error(function (error) {
        console.log(error.errors[0]);
      });
    };

    $scope.$on('$viewContentLoaded',function(){
      $scope.user_role = $cookies.get('user_current_role');
      get_loc_list();
      getUser_details();
      get_dashboard($scope.user.id);
      get_notifications();
      get_vehicles();
      get_my_jobs(get_query_string(undefined,undefined,1));
      get_employees();

    });
	}
]);
