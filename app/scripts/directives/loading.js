
function loadingShow() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      loader: '=ngModel'
    },
    templateUrl: 'views/common/loading.html'
  };
}

app.directive('loadingShow', loadingShow);
