/**
 * AuthService - service
 */

angular
  .module('onefindrApp')
  .service('newJobService', ['$http', '$q', 'Domain', 'UtilService','$cookies', 
    function ($http, $q, Domain,UtilService,$cookies) {
    
      var createRequest = function(job){
        var requestHeaders = {
            'Content-Type': 'application/json',
            'sessionToken': $cookies.get('sessionToken'),
            'client': $cookies.get('client'),
            'email': $cookies.get('email')
        };
        return $http.post(Domain + '/jobs',job,{headers: requestHeaders})
        .then(returnData)
      }

      this.createJob = function (job) {

        if (job.imagesBase64 == null || job.imagesBase64 == undefined || job.imagesBase64 == "") {
          return createRequest(job)
            .catch(errorCatch)
        }else{
          return UtilService.uploadPictures(job.imagesBase64)
            .then(function (imgObj) {
              delete job.imagesBase64;
              job.photos = imgObj;
              return createRequest(job);
            })
            .catch(errorCatch)
        }
      }

      var errorCatch  = function(res){
          if(res.data)
            return $q.reject(res.data.errors.toString());
          else
            return $q.reject('Error');
      };

      var returnData = function(res){
          return res.data;
      };

  }
]);
