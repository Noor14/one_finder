app.controller('SettingsEmployeeCtrl',['$scope','$state','toastr','CategoryService','UserService','ngDialog',

  function($scope,$state,toastr,CategoryService,UserService,ngDialog){
      
      $scope.get_skillz = function (cat) {

        if(cat && !cat.hasChildren){
          CategoryService.get_category_skills(cat.id)
          .then(function (data) {
            $scope.skills = data;
          }).catch(function (data) {
            toastr.error(data,'Error');
          })
        }
      };

      $scope.open_calendar = function(){
        $scope.open_new_emp_date.opened = true;
      };
    
      $scope.open_calendar2 = function(){
        $scope.open_employee_edit_date.opened = true;
      };

      $scope.add_employee = function(new_emp){
        if(Object.keys(new_emp).length === 0){
          toastr.error('Please fill out the details','Error',{timeOut:1000});
          return;
        }

        if(!new_emp.email){
          toastr.error('Email is required','Error',{timeOut:1000});
          return;
        }

        UserService.add_employee(new_emp)
        .then(function(data){
          toastr.success('Success!');
          $state.reload();
        })
        .catch(function (data) {
          toastr.error(data,'Error');
        })
      }


      $scope.edit_employee = function(edit_em){
        var em = angular.copy(edit_em);
        if(em.joiningDate)
          em.joiningDate = new Date(em.joiningDate);

        $scope.employee_edit = em;
        ngDialog.open({
          template: '/views/common/employee_edit_lightbox.html',
          className: 'ngdialog-theme-default dashboard-signup-form',
          controller: 'SettingsEmployeeCtrl',
          scope: $scope
        });
      }

      $scope.remove_specialization = function(em){
        delete em.specialization;
      }

      $scope.edit_the_employee = function(edit_em){
        
        if(!edit_em.email){
          toastr.error('Email is required','Error');
          return;
        }

        var em = {
          id: edit_em.id,
          email: edit_em.email,
        }

        
        if(edit_em.joiningDate){
          em.joiningDate = edit_em.joiningDate;
        }

        if(edit_em.specialization_new){
          em.specialization = edit_em.specialization_new.id;
        }


        UserService.edit_employee_details(em.id,em)
        .then(function (data) {
          toastr.success('Employee details saved successfully!','Success');
          $scope.closeThisDialog();
          $state.reload();
        })
        .catch(function(data){
          toastr.error(data,'Error');
        })

      }

      $scope.remove_employee = function(em){
        UserService.remove_employee(em.id)
        .then(function(data){
          toastr.success('Success!');
          $state.reload();
        })
        .catch(function (data) {
          toastr.error(data,'Error');
        })
      }

      var employment_statuses = [
        {id:0,val:'Invitation is pending'},
        {id:1,val:'Employee has accepted invitation'},
        {id:1,val:'Invitation is rejected'},
      ];

      $scope.get_employment_status = function(status){
        var filter = employment_statuses.filter(function(stat){
          return stat.id === status;
        })
        return filter[0].val;
      };

      $scope.category = {};
      $scope.category_child = {};
      $scope.category_grand_child = {};
      $scope.skills = [];
      $scope.selected_skill = '';
      $scope.open_new_emp_date = {
        opened:false
      };
      $scope.open_employee_edit_date = {
        opened:false
      };
      $scope.$parent.tab = 30;
  }
])
