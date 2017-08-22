app.controller("skillsCtrl", ["$log", 'SkillsService', "$scope", "$cookies", "$state", "toastr", function ($log, SkillsService, $scope, $cookies, $state, toastr) {

  $scope.init = function () {

  };

  $scope.init();


  $scope.create_skill = function () {
    SkillsService.craete_new_skill($scope.serviceProviderDetails.skills).success(function (data) {
      $scope.serviceProviderDetails.skills = data.skills;
      consle.log(data.skills);
      toastr.success("New skill has been added successfully");
    }).error(function (error) {
      toastr.error(error.errors[0]);
    });
  };

  $scope.location_req = function (val) {
    if (val == "True") {
      $scope.serviceProviderDetails.skills.locationRequired = true;
    } else {
      $scope.serviceProviderDetails.skills.locationRequired = false;
    }
  };

  $scope.vehicle_req = function (val) {
    if (val == "True") {
      $scope.serviceProviderDetails.skills.vehicleRequired = true;
    } else {
      $scope.serviceProviderDetails.skills.vehicleRequired = false;
    }
  };


}]);
