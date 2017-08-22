app.controller('SettingPublicProfileCtrl',['$scope','ngDialog','$state',

    function($scope,ngDialog,$state){

        if($state.params.section_id === true){
            $state.go($state.current, {section_id:null}, {reload: true});
        }
    
        $scope.switch_user_role = function(){
            ngDialog.open({
                template: '/views/common/usertype_lightbox.html',
                className: 'ngdialog-theme-default dashboard-signup-form login_lightbox',
                scope: $scope,
                controller:'ChooseUserRoleCtrl',
                resolve:{
                  action: function(){  //type 0 ==> state reload
                    return {
                      type: 0
                    };
                  }
                }
            });
        };
        $scope.$parent.tab = 1;
    }
]);