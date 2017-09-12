app.service('paymentListService', ['$http', 'Domain','$q', '$cookies',
  function ($http, Domain, $q, $cookies) {
    var vm = this;
    vm.getPaymentList = function(page, time){
      var deffered =$q.defer();
      var obj = {
        url :  Domain + "/payments/my_payments",
        method : "GET",
        headers: {
          'Content-type': 'application/JSON',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
        params : {
          page : page,
          timestamp: time
        }

      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    }




  }]);
