/**
 * UtilService - service
 */

angular
  .module('onefindrApp')
  .service('UtilService',['$http','$q','Domain','$cookies',function($http,$q,Domain,$cookies){

    /**
     * Upload pictures
     */
    this.uploadPictures = function(imageArray){

      //get sessionToken,client,email in header
      var images = imageArray;
      var promises = [];
      var imgObj  =  [];
      var defer = $q.defer();
      var prefix = 'data:image/jpeg;base64,';

      var postImagePromise = function(base_64_string){
        var defer_2 = $q.defer();
        var payload = prefix + base_64_string;
        $http.post(Domain + '/documents',{
          input: payload
        },{
          headers: {
            'Content-Type': 'application/json',
            'sessionToken': $cookies.get('sessionToken'),
            'client': $cookies.get('client'),
            'email': $cookies.get('email')
          },
        })
          .then(function(res){
            imgObj.push(res.data.id); //image id
            defer_2.resolve(res.data);
          })
          .catch(function(res){
            if(res.data)
              defer_2.reject(res.data.error.toString());
            else
              defer_2.reject('Error');
          })
        return defer_2.promise;
      };

      angular.forEach(imageArray,function(item){
        promises.push(postImagePromise(item.base64));
      });

      $q.all(promises)
        .then(function(res){
          defer.resolve(imgObj);
        })
        .catch(function(res){
          if(res.data)
            defer.reject(res.data.error.toString());
          else
            defer.reject('Error');
        })
      return defer.promise;
    }



  }]);
