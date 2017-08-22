app.controller('SettingCtrl', ['$scope', 'AuthService', 'InfoService', 'toastr', '$state', 'CategoryService', 'SkillsService', 'vehicleService', 'locationsService','UserService','$cookies',
  
  function ($scope, AuthService, InfoService, toastr, $state, CategoryService, SkillsService, vehicleService, locationsService,UserService,$cookies) {

    $scope.get_user = function(){
      update_user();
    }
    $scope.selected_locations = [];
    $scope.del_btn = true;
    $scope.new_profile_picuture = {};

    // Tabing for right Side
    //if($state.params.section_id === true){
    //  $scope.tab = 1;
    //}
    $scope.setTab = function (newTab) {
      $scope.tab = newTab;
    };

    $scope.isSet = function (tabNum) {
      return $scope.tab === tabNum;
    };
    // End of Tabing
    $scope.user_skills = function () {
      SkillsService.list_skills()
        .then(function (data) {
          $scope.userSkills = data.data;
        }).catch(function (data) {
          toastr.error(data,'Error');
      });
    };
    function get_employees(){
      if($scope.user.serviceProviderDetails.type === 1){
        UserService.list_employees('')
        .then(function(res){
          $scope.employees = res;
        })
        .catch(function(data){
          toastr.error(data,'Error');
        });
      }
    };

    function get_employment_invitations(){
      $scope.employmentInvites = $scope.user.employmentInvitations;
    }

    function user_service_provider_dashboard(id) {
      InfoService.user_serviceprovider_dashboard(id)
      .then(function (data) {
        $scope.serviceProviderDashboard = data;
      }).catch(function (error) {
        console.log("Not a service provider");
      });
    };

    function get_vehicles(){
      $scope.vehicles = [];
      vehicleService.get_all_vehicles()
      .then(function (data) {
        $scope.vehicles = data;
      })
      .catch(function (error) {
        toastr.error('Errors');
      });

    };

    function update_user(){
      AuthService.validate_token()
      .then(function(res){
        $scope.user = res;
        $scope.$parent.user = res;
        $scope.edit_user = res;
        $scope.list_locations = $scope.user.citiesOfOperation;

        angular.forEach($scope.list_locations, function (value) {
          this.push(value.id);
        }, $scope.selected_locations);

        user_service_provider_dashboard($scope.user.id);
        $scope.serviceProviderDetails = {};

        //employers only
        if($scope.user.serviceProviderDetails){
          $scope.serviceProviderDetails.type = $scope.user.serviceProviderDetails.type;
          get_employees();
        }

        if($scope.user.employmentInvitations){
          get_employment_invitations();
        }
        return AuthService.setUserDetails(res);
      })

    };

    function get_cat_list(){
      $scope.cats = {};
      CategoryService.get_all_categories()
      .then(function (data) {
        $scope.cats = data;
      }).catch(function (data) {
        toastr.error(data,'Error');
      });
    };

    function init(){
      $scope.user_role = $cookies.get('user_current_role');
      $scope.get_user();
      $scope.user_skills();
      $scope.stringVal = '';
      get_vehicles();
      get_cat_list();
    };

    $scope.state = $state;
    init();
  }
]);