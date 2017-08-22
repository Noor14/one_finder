app.controller('VehicleCtrl',['$scope','vehicleService','document_service','toastr','$state',
  function($scope,vehicleService,document_service,toastr,$state){

    $scope.new_vehicle = {};

    $scope.submit_new_vehicle = function(new_vehicle){
      if(new_vehicle.pictureId != null){
        var pic = {};
        $scope.picture = {};
        pic["input"] = "data:" + new_vehicle.pictureId.filetype + ";base64," + new_vehicle.pictureId.base64;
        document_service.create(pic)
        .then(function (data) {
          new_vehicle.pictureId = data.id;
          return vehicleService.add_vehicle(new_vehicle)
        })
        .then(function (data){
          $scope.new_vehicle = data;
          toastr.success('Your Vehicle information has been Added Successfully', 'Success!');
          $scope.closeThisDialog();
          $state.reload();
          $scope.loader = false;
        })
        .catch(function (error) {
            toastr.error(error, 'Error');
        });
      }else{
        toastr.error('Picture is required','Error');
        return;
      }

    };
  }
])
