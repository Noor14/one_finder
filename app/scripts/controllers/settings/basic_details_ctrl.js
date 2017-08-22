app.controller('SettingBasicDetailsCtrl',['$scope','$state','toastr','EditInfoService','document_service',

    function($scope,$state,toastr,EditInfoService,document_service){
    
        $scope.submit_info_form = function(edit_user){

            delete edit_user.p_picture;
            $scope.form_submit = true;

            EditInfoService.user_basic_info(edit_user)
            .then(function (data) {
                $scope.form_submit = false;
                $scope.loader = false;
                toastr.success('You information has been Successfully updated', 'Success!');
                $state.reload();
            }).catch(function (data) {
                toastr.error(data);
                $scope.form_submit = false;
            });
        };
    
        $scope.submit_updated_pic = function (new_p_picture) {

            $scope.new_profile_picuture = new_p_picture;

            var pic = {};
            $scope.picture = {};
            pic["input"] = "data:" + $scope.new_profile_picuture.filetype + ";base64," + $scope.new_profile_picuture.base64;

            document_service.create(pic)
            .then(function(data){
                $scope.new_profile_picuture.pictureId = data.id;
                var new_pic = {
                    pictureId : data.id
                };
                return EditInfoService.user_profile_picture(new_pic)
            })
            .then(function(data){
                toastr.success('Your Profile Picture has been updated successfully', 'Success!');
                $state.reload();                
            })
            .catch(function (data) {
                toastr.error(data,'Error');
            });
        };

        $scope.remove_profile_pic =  function () {
            $scope.edit_user.picture = '';
            $scope.del_btn = false;
        };

        $scope.new_profile_pic = function (data) {
            if(data){
                $scope.edit_user.picture = 'data:image/' + data.filetype + ';base64,' + data.base64;
                $scope.del_btn = true;                
            }
        };    
        $scope.form_submit = false;
        $scope.$parent.tab = 4;
    }
]);