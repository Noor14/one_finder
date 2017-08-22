app.controller("SettingBecomeServiceProviderCtrl", ["ServiceProviderService", "$scope", "$cookies", "$state", "toastr", "CountryCitiesService", "document_service",'AuthService',
  function (ServiceProviderService, $scope, $cookies, $state, toastr, CountryCitiesService, document_service,AuthService) {

    $scope.init = function () {
        
      $scope.serviceProviderDetails = {};
      $scope.tab1 = 'active';
      $scope.tab2 = '';
      $scope.company_reg_form = '';
      $scope.freelancer_reg_form = '';
      $scope.serviceProviderDetails.national = false;
      $scope.addressProof = {};
      $scope.trade = {};
      $scope.insurance = {};
      $scope.identification = {};
      $scope.visa = {};
      $scope.form_submit = false;
      CountryCitiesService.get_countries()
      .success(function (data) {
      $scope.countries = data;
      }).error(function (error) {
      toastr.error(error.errors[0]);
      });
      $scope.$parent.tab = 60;
        // $scope.tab = 1;
    };

    $scope.init();

    $scope.get_cities = function (id) {

      CountryCitiesService.get_cities(id)
      .success(function (data) {
        $scope.cities = data;
      }).error(function (error) {
        toastr.error(error.errors[0]);
      });

    };


    $scope.goto_type_selection = function () {
      $scope.tab1 = '';
      $scope.tab2 = 'active';
      $scope.company_reg_form = '';
      $scope.freelancer_reg_form = '';
    };

    $scope.goto_company_reg_form = function () {
      $scope.serviceProviderDetails.type = 1;
      $scope.tab1 = '';
      $scope.tab2 = '';
      $scope.company_reg_form = 'active';
      $scope.freelancer_reg_form = '';
    };

    $scope.goto_freelancer_reg_form = function () {
      $scope.serviceProviderDetails.type = 2;
      $scope.tab1 = '';
      $scope.tab2 = '';
      $scope.company_reg_form = '';
      $scope.freelancer_reg_form = 'active';
    };

    $scope.address_proof_upload = function () {
      if ($scope.addressProof.input != null) {
        var pic = {};
        pic["input"] = "data:" + $scope.addressProof.input.filetype + ";base64," + $scope.addressProof.input.base64;
        document_service.create(pic)
        .then(function (data) {
          $scope.serviceProviderDetails.addressProofId = data.id;
          $scope.total++;
          if ($scope.total == 5) {
            $scope.final();
          }
        });
      } else {
        $scope.total++;
        if ($scope.total == 5) {
          $scope.final();
        }
      }
    };

    $scope.trade_upload = function () {
      
      if ($scope.trade.input != null) {
        var pic = {};
        pic["input"] = "data:" + $scope.trade.input.filetype + ";base64," + $scope.trade.input.base64;

        document_service.create(pic).then(function (data) {
          $scope.serviceProviderDetails.tradeLicenseId = data.id;
          $scope.total++;
          if ($scope.total == 5) {
            $scope.final();
          }
        });
      }else {
        $scope.total++;
        if ($scope.total == 5) {
          $scope.final();
        }
      }
    };

    $scope.insurance_upload = function () {
      if ($scope.insurance.input != null) {
        var pic = {};
        pic["input"] = "data:" + $scope.insurance.input.filetype + ";base64," + $scope.insurance.input.base64;

        document_service.create(pic)
        .then(function (data) {
          $scope.serviceProviderDetails.insuranceCoverNoteId = data.id;
          $scope.total++;
          if ($scope.total == 5) {
            $scope.final();
          }
        });
      } else {
        $scope.total++;
        if ($scope.total == 5) {
          $scope.final();
        }
      }
    };

    $scope.visa_upload = function () {
      if ($scope.visa.input != null) {
        var pic = {};
        pic["input"] = "data:" + $scope.visa.input.filetype + ";base64," + $scope.visa.input.base64;

        document_service.create(pic)
        .then(function (data) {
          $scope.serviceProviderDetails.visaId = data.id;
          $scope.total++;
          if ($scope.total == 5) {
            $scope.final();
          }
        });
      } else {
        $scope.total++;
        if ($scope.total == 5) {
          $scope.final();
        }
      }
    };

    $scope.identification_upload = function () {
      if ($scope.identification.input != null) {
        var pic = {};
        pic["input"] = "data:" + $scope.identification.input.filetype + ";base64," + $scope.identification.input.base64;

        document_service.create(pic)
        .then(function (data) {
          $scope.serviceProviderDetails.identificationId = data.id;
          $scope.total++;
          if ($scope.total == 5) {
            $scope.final();
          }
        });
      } else {
        $scope.total++;
        if ($scope.total == 5) {
          $scope.final();
        }
      }

    };
        
    $scope.submit_service_provider = function () {
      $scope.total = 0;
      $scope.form_submit = true;
      $scope.address_proof_upload();
      $scope.trade_upload();
      $scope.insurance_upload();
      $scope.visa_upload();
      $scope.identification_upload();

    };
    $scope.final = function () {
      ServiceProviderService.reg_serviceprovider($scope.serviceProviderDetails)
      .then(function (data) {
        $scope.form_submit = false;
        AuthService.setUserDetails(data);
        $cookies.put('user',JSON.stringify(data));
        toastr.success("Service Provider Request has been sent to the Admin successfully");
        $state.go('app.setting.public_profile',{section_id:true});
      }).catch(function (data) {
        $scope.form_submit = false;
        toastr.error(data);
      });
    };

  }
]);
