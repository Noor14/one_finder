app.controller('SettingsCitiesOperationCtrl',['$scope','toastr','$state','CountryCitiesService',

    function($scope,toastr,$state,CountryCitiesService){

        $scope.add_new_cities = function(){
            CountryCitiesService.edit_cities($scope.add_cities)
            .success(function (data) {
                $state.reload();
                toastr.success("Cities has been added successfully", 'Success');
            }).error(function (error) {
                toastr.error(error.errors[0]);
            });
        }
        
        function get_countries(){
            CountryCitiesService.get_countries()
            .success(function (data) {
                $scope.countries = data;
            }).error(function (error) {
                toastr.error(error.errors[0]);
            });          
        }

        function get_cities(id){
            CountryCitiesService.get_cities(id)
            .success(function (data) {
                $scope.cities = data;
            }).error(function (error) {
                toastr.error(error.errors[0]);
            });
        };
        get_countries();
        $scope.add_cities = {};
        $scope.add_cities.countryId = 220;
        get_cities($scope.add_cities.countryId);
        $scope.$parent.tab = 8;
    }
]);