app.controller('PaymentCtrl', ['$scope', 'paymentListService', '$state', function ($scope, paymentListService, $state) {



  $scope.totalRecords = 0;
  $scope.itemsPerPage = 20;
  $scope.currentPage  = 1;
  $scope.previousPage = 1;
  $scope.timeStamp    = '';
  $scope.filter       = {};
  $scope.morePagesAvailable = false;
  $scope.job_status = [
    {id:1,val:'Pending'},
    {id:2,val:'Due'},
    {id:3,val:'Paid'}
  ];


  $scope.get_status = function(status){
    var ret = $scope.job_status.filter(function(fil){
      return fil.id === status;
    });
    return ret.length > 0 ? ret[0].val : "";
  };

  var time_stamp = new Date();
  function get_query_string(page, time) {
    return '?page=' + page + '&timestamp=' + time;
  }
  $scope.getPayment = function(query,filter){
    $scope.pageLoader = true;
    paymentListService.getPaymentList(query,filter).then(function(res){
      console.log("res",res.data.sp_payments);
      $scope.pageLoader = false;
      $scope.timeStamp = res.data.timestamp;
      $scope.totalRecords = res.data.totalRecords;
      $scope.page_no =  res.data.page;
      $scope.jobs = res.data.sp_payments;
    });
  };
  $scope.change_page = function(){
    if ($scope.morePagesAvailable) {
      $scope.previousPage = $scope.currentPage;
      get_all_jobs(get_query_string($scope.currentPage, $scope.timeStamp));
    }
    // going to a prev page
    if ($scope.currentPage < $scope.previousPage) {
      get_all_jobs(get_query_string($scope.currentPage, $scope.timeStamp));
    }
  };

  $scope.detail = function(id){
    $state.go('app.job_detail',{id : id})
  };


  $scope.getPayment(1, time_stamp);

}]);




