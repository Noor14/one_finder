app.controller('JobAssignCtrl',['$scope','jobsService','UserService','toastr',
    function($scope,jobsService,UserService,toastr){

        $scope.employees = [];

        UserService.list_employees('?status=2')
        .then(function(data){
          $scope.employees = data;
        })
        .catch(function(data){
            toastr.error(data, 'Error');
        });

        $scope.assign_employee = function(employee){
            var job_id = $scope.$parent.my_job_detail.id;
            var payload = {employeeId:employee.user.id};
            jobsService.assign_job(job_id,payload)
            .success(function(){
                toastr.success('Assigned!');
                $scope.closeThisDialog();
                $scope.state.reload();
            })
            .error(function(res){
                toastr.error(res.errors[0], 'Error');
            });
        }

    }
]);