app.controller('SettingsDocumentCtrl',['$scope','ngDialog',
    function($scope,ngDialog){
        
        $scope.edit_document = function (document_name) {
          ngDialog.open({
            template: '/views/common/document_update.html',
            className: 'ngdialog-theme-default dashboard-signup-form',
            controller: 'ServiceProviderDocCtrl',
            scope: $scope,
            resolve:{
              service_provider: function fn(){
                return $scope.serviceProviderDetails;
              },
              type: function fn(){
                return document_name;
              }
            }
          });
        };

        $scope.fancyBoxmodel = function (data) {
            $scope.data_link = {};
            $scope.data_link.data = data;
            ngDialog.open({
                template: '/views/common/fancybox.html',
                className: 'ngdialog-theme-default fancybox',
                data: $scope.data_link
            });
        };

        $scope.$parent.tab = 70;
    }
])
