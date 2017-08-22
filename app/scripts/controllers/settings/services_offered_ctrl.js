app.controller('SettingsServicesOfferedCtrl',['$scope','$state','toastr','CategoryService','SkillsService',
  function($scope,$state,toastr,CategoryService,SkillsService){
    
    $scope.get_skills = function (cat) {

      if(cat && !cat.hasChildren){
        CategoryService.get_category_skills(cat.id)
        .then(function (data) {
          $scope.skills = data;
        }).catch(function (error) {
          toastr.error(error,'Error');
        })
      }
    };

    $scope.add_new_skills = function (selected_skills) {
      if( selected_skills === {} || typeof  selected_skills === 'undefined' || selected_skills === null )
        return;

      var s = {};
      s.skills = selected_skills;
      SkillsService.create_skill(s)
      .then(function (data) {
        $scope.get_user();
        toastr.success("New skill(s) have been added successfully");
        $state.reload();
      }).catch(function (error) {
        toastr.error(error.errors[0]);
      });
    };

    $scope.remove_skill = function (id) {
      SkillsService.delete_user_skill(id)
        .then(function (data) {
          $scope.user_skills();
          toastr.success('Service has been Removed Successfully', 'Success!');
        })
        .catch(function (error) {
          console.log("Service provider not found");
        });
    };

    $scope.category = {};
    $scope.category_child = {};
    $scope.category_grand_child = {};
    $scope.skills = [];
    $scope.$parent.tab = 10;
  }
]);