app.controller('SettingVehiclesCtrl',['$scope','ngDialog',

  function($scope,ngDialog){
      	$scope.add_vehicle = function(vehicle_model) {
        	ngDialog.open({
          		template: '/views/common/vehicle_lightbox.html',
          		className: 'ngdialog-theme-default dashboard-signup-form',
          		controller: 'VehicleCtrl'
        	});
    	};
    	$scope.$parent.tab = 11;
  }

]);