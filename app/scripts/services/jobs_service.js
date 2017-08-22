 app.factory("jobsService", ["$http", "Domain", "$cookies", 'AuthService','$q','UtilService',
  function ($http, Domain, $cookies,AuthService,$q,UtilService) {

    var error_catch  = function(res){
      if(res.data)
          return $q.reject(res.data.errors.toString());
      else
          return $q.reject('Error');
    };

    var return_data = function(res){
      return res.data;
    };

    function edit(id,data){
      var url = Domain + '/jobs/' + id;
      var headers = {headers:AuthService.get_request_headers()};
      return $http.put(url,data,headers)
        .then(return_data)
        .catch(error_catch);
    }



    return {

      get_my_jobs_gu: function(query){
        return $http({
          method:'GET',
          crossDomain: true,
          url: Domain + '/jobs/filter_my_jobs' + query,
          headers:{
            'Content-Type': 'application/json',
            'sessionToken': $cookies.get('sessionToken'),
            'client': $cookies.get('client'),
            'email': $cookies.get('email')
          }
        })
      },

      get_my_jobs_sp: function(query){
        return $http({
          method: 'GET',
          crossDomain: true,
          url: Domain + '/jobs/filter_bidded_jobs' + query,
          headers:{
            'Content-Type': 'application/json',
            'sessionToken': $cookies.get('sessionToken'),
            'client': $cookies.get('client'),
            'email': $cookies.get('email')
          }
        })
      },

      get_my_jobs_employee: function(query){
        return $http({
          method: 'GET',
          crossDomain: true,
          url: Domain + '/jobs/assigned_to_me' + query,
          headers:{
            'Content-Type': 'application/json',
            'sessionToken': $cookies.get('sessionToken'),
            'client': $cookies.get('client'),
            'email': $cookies.get('email')
          }          
        })
      },

      get_public_jobs: function (query,filter) {
        return $http({
          method: 'POST',
          crossDomain: true,
          dataType: "JSONP",
          url: Domain + "/jobs/public_jobs" + query,
          headers: {
            'Content-Type': 'application/json',
            'sessionToken': $cookies.get('sessionToken'),
            'client': $cookies.get('client'),
            'email': $cookies.get('email')
          },
          data: filter
        });
      },

      get_openBid_jobs: function (query) {
      return $http({
        method: 'GET',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/jobs/filter_bidded_jobs" + query,
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        }
      });
    },

    get_job_detail: function (id, lastId, type, status) {
      return $http({
        method: 'GET',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/jobs/" + id,
        params: {
          lastId: lastId,
          type: type,
          status: status
        },
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        }
      });
    },

    delete_job:function(id){
      return $http({
        method: 'DELETE',
        crossDomain: true,
        dataType: 'JSONP',
        url: Domain + '/jobs/' + id,
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        }        
      })
    },

    edit_job: function(id,data,photoUpload){

      if(!photoUpload){
        return edit(id,data);
      }else{
        return UtilService.uploadPictures(data.images)
        .then(function(ids){
          ids.forEach(function(img_id){
            data.photos.push(img_id);
          })
          delete data.images;
          return edit(id,data);
        })
      }
    },

    assign_job:function(id,data){
      return $http({
        method:'PUT',
        crossDomain: true,
        dataType: 'JSONP',
        url: Domain + '/jobs/' + id+ '/assign',
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
        data: data        
      })
    },
    
    start_job: function(id,data){
      return $http({
        method: 'PUT',
        crossDomain: true,
        dataType: 'JSONP',
        url: Domain + '/jobs/' + id + '/start',
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
        data: data        
      })
    },

    complete_job: function (data, id) {
      return $http({
        method: 'PUT',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/jobs/" + id + "/complete",
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        },
        data: data
      });
    },

    sign_off_job: function(id){
      return $http({
        method: 'PUT',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/jobs/" + id + "/sign_off",
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        }
      });
    },

    get_assign_job_detail: function (id, lastId, type, status) {
      return $http({
        method: 'GET',
        crossDomain: true,
        dataType: "JSONP",
        url: Domain + "/jobs/filter_bidded_jobs",
        params: {
          lastId: lastId,
          type: type,
          status: status
        },
        headers: {
          'Content-Type': 'application/json',
          'sessionToken': $cookies.get('sessionToken'),
          'client': $cookies.get('client'),
          'email': $cookies.get('email')
        }
      });
    }
  }
}
]);
