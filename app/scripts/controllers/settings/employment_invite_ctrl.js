app.controller('SettingsEmploymentInviteCtrl', ['$scope', 'toastr', '$state',
    function ($scope, toastr, $state) {

        $scope.accept_employment = function (invite) {
            UserService.accept_employment(invite.id)
                .then(function (data) {
                    toastr.success('Success!');
                    $state.reload();
                })
                .catch(function (data) {
                    toastr.error(data,'Error');
                })
        };

        $scope.reject_employment = function (invite) {
            UserService.reject_employment(invite.id)
                .then(function (data) {
                    toastr.success('Success!');
                    $state.reload();
                })
                .catch(function (data) {
                    toastr.error(data,'Error');
                })
        };
        $scope.$parent.tab = 40;
    }
])