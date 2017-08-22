app.controller("vehicle_detailCtrl", ["$scope", "AuthService", "$log", "toastr", "document_service", 'ngDialog', '$rootScope', '$state', 'vehicleService',
  function ($scope, AuthService, $log, toastr, document_service, ngDialog, $rootScope, $state, vehicleService) {
    // Tabing for right Side
    $scope.setTab = function (newTab) {
      $scope.tab = newTab;
    };

    $scope.isSet = function (tabNum) {
      return $scope.tab === tabNum;
    };

    $scope.get_vehicle = function () {
      vehicleService.get_specific_vehicle($state.params.id)
      .then(function (data) {
        $scope.edit_vehicle = data;
      }).catch(function (error) {
        toastr.error(error);
      });
    };

    $scope.remove_vehicle = function () {
      vehicleService.delete_vehicle($state.params.id)
      .then(function () {
        $state.go("app.setting.vehicles");
        $scope.setTab(11);
        toastr.success("Selected Vehicle has been deleted successfully");
      }).catch(function (error) {
        toastr.error(error);
      });
    };


    function update_vehicle(vehicle){
      return vehicleService.update_vehicle(vehicle, $state.params.id)
    }

    $scope.submit_vehicle_update = function () {

      if ($scope.edit_vehicle.pictureId !== undefined) {
        delete $scope.edit_vehicle.picture;
        $scope.loader = true;
        var pic = {};
        $scope.picture = {};
        pic["input"] = "data:" + $scope.edit_vehicle.pictureId.filetype + ";base64," + $scope.edit_vehicle.pictureId.base64;
        document_service.create(pic)
        .then(function (data) {
          $scope.edit_vehicle.pictureId = data.id;
          return update_vehicle($scope.edit_vehicle)
        })
        .then(function (data) {
          $scope.edit_vehicle = data;
          $scope.loader = false;
          $state.reload();
          toastr.success('Your Vehicle information has been Updated Successfully', 'Success!');
        })
        .catch(function (error) {
          toastr.error(error);
        });
      }else {
        update_vehicle($scope.edit_vehicle)
        .then(function (data) {
          $scope.loader = false;
          $rootScope.bodyClass = 'loading-process';
          $scope.edit_vehicle = data;
          $scope.loader = false;
          $state.reload();
          toastr.success('Your Vehicle information has been Updated Successfully', 'Success!');
        })
        .catch(function (error) {
          toastr.error(error);
        });
      }
    };

    $scope.edit_vehicle_detail = function () {
      $scope.edit_vehicle_block = true;
    };

    $scope.cancel_vehicle_edit = function () {
      $scope.edit_vehicle_block = false;
    };

    $scope.new_vehicle_pic = function (data) {
      $scope.edit_vehicle.picture = 'data:image/' + data.filetype + ';base64,' + data.base64;
      $scope.del_btn = true;
    };


    $scope.init = function () {
      $scope.edit_vehicle_block = false;
      $scope.loader = false;
      $scope.get_vehicle();
    };

    $scope.init();
  }
]);

