app.controller("ServiceProviderDocCtrl", ["ServiceProviderService", "$scope", "toastr", "document_service",'service_provider','type',
	function (ServiceProviderService, $scope, toastr, document_service,service_provider,type) {

	  	$scope.serviceProviderDetails = service_provider;

	    $scope.submit_edit_document_form = function(){

	     	if ($scope.document.input != null) {
	        	var doc = {};
	        	doc["input"] = "data:" + $scope.document.input.filetype + ";base64," + $scope.document.input.base64;

		        document_service.create(doc)
		        .then(function (data) {
		          
		          if (type == 'tradeLicense') {
		            $scope.serviceProviderDetails.tradeLicenseId = data.id;
		          }

		          if (type == 'addressProof') {
		            $scope.serviceProviderDetails.addressProofId = data.id;
		          }

		          if (type == 'insuranceCoverNote') {
		            $scope.serviceProviderDetails.insuranceCoverNoteId = data.id;
		          }

		          if (type == 'visa') {
		            $scope.serviceProviderDetails.visaId = data.id;
		          }

		          if (type == 'identification') {
		            $scope.serviceProviderDetails.identificationId = data.id;
		          }

		          final();

		        });
	      	}
	      	delete $scope.document.input;
	    };

	    function final(){
	    	ServiceProviderService.edit_reg_serviceprovider($scope.serviceProviderDetails)
	      	.then(function (data) {
	        	$scope.closeThisDialog();
	        	toastr.success("Document has been successfully updated");
	        	$scope.state.reload();
	      	}).catch(function (error) {
	        	toastr.error(error);
	      	});
	    };
	}
]);