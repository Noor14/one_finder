app.controller('NavigationCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.isCurrentPath = function (path) {
      return $location.path() == path;
    };
  }]);
