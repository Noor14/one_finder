app.controller('JobStartCtrl',['$scope','jobsService','UserService','toastr','job',
    function($scope,jobsService,UserService,toastr,job,$state){
    
        $scope.job = job;
    
        $scope.start_the_job = function(code){
            var payload = {jobStartCode:code};
            jobsService.start_job($scope.job.id,payload)
            .success(function(res){
                toastr.success('Success!');
                $scope.closeThisDialog();        
                $scope.state.reload();
            })
            .error(function(res){
                toastr.error(res.errors[0]);
            })
        }
    }
]);