app.controller("location_detailCtrl", ["$scope", "$http", "toastr", 'ngDialog', '$rootScope', '$state', 'CountryCitiesService', "$timeout", 'NgMap', '$filter', '$rootScope', 'locationsService', 'uiGmapGoogleMapApi', '$log', function ($scope, $http, toastr, ngDialog, $rootScope, $state, CountryCitiesService, $timeout, NgMap, $filter, $rootScope, locationsService, uiGmapGoogleMapApi, $log) {


  $scope.get_specific_loc = function () {
    locationsService.get_a_location($state.params.id).success(function (data) {
      console.log(data);

      $scope.view_location = data;
      $scope.latlng = [$scope.view_location.latitude, $scope.view_location.longitude];


    }).error(function (error) {
      toastr.error(error.errors[0]);
    })
  };


  $scope.remove_location = function (id) {
    locationsService.delete_a_location(id).success(function () {
      $state.go("app.setting.locations");
      toastr.success("Location has been deleted successfully");
    }).error(function (error) {
      toastr.error(error.errors[0]);
    })

  };


  $scope.init = function () {
    $scope.get_specific_loc();
    $scope.view_location = {};
    $scope.loader = false;

  };

  $scope.init();

}
])
;

