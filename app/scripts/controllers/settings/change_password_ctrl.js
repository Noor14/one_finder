app.controller('SettingChangePasswordCtrl', ['$scope', '$state', 'toastr', 'AuthService',

    function ($scope, $state, toastr, AuthService) {

        $scope.edit_password = function (edit_user_password) {
            $scope.loader = true;
            AuthService.edit_password(edit_user_password)
                .then(function (data) {
                    $scope.loader = false;
                    $scope.edit_user_passowrd = data;
                    $scope.user = data;
                    toastr.success('Your password has been changed!', 'Success!');
                    $state.reload();
                }).catch(function (data) {
                    $scope.loader = false;
                    toastr.error(data, 'Error');
                });
        };
        $scope.$parent.tab = 5;
    }
]);