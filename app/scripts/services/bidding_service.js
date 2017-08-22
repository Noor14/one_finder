app.factory("biddingService", ["$http", "Domain", "$cookies","AuthService", "$q",
  function ($http, Domain, $cookies,AuthService,$q) {

    var error_catch  = function(res){
      if(res.data)
          return $q.reject(res.data.errors.toString());
      else
          return $q.reject('Error');
    };

    var return_data = function(res){
      return res.data;
    };


  return {
    post_bid: function (data, id) {
      var url = Domain + "/jobs/" + id + "/bids";
      var headers = {headers:AuthService.get_request_headers()};
      return $http.post(url,data,headers)
      .then(return_data)
      .catch(error_catch);
    },

    submit_edit_bid: function (data, id, bid_id) {
      var url = Domain + "/jobs/" + id + "/bids/" + bid_id;
      var headers = {headers:AuthService.get_request_headers()};
      return $http.put(url,data,headers)
      .then(return_data)
      .catch(error_catch);
    },

    delete_bid: function (id, bid_id) {
      var url = Domain + "/jobs/" + id + "/bids/" + bid_id;
      var headers = {headers:AuthService.get_request_headers()};
      return $http.delete(url,headers)
      .then(return_data)
      .catch(error_catch);
    },

    list_bids: function(id,query){
      var url = Domain+'/jobs/'+ id +'/bids/filter_bids' + query;
      var headers = {headers:AuthService.get_request_headers()};
      return $http.get(url,headers)
      .then(return_data)
      .catch(error_catch);
    },

    accept_bid: function(id,bid_id,data){
      var url = Domain +'/jobs/' + id + '/bids/' + bid_id + '/accept';
      var headers = {headers:AuthService.get_request_headers()};
      return $http.post(url,data,headers)
      .then(return_data)
      .catch(error_catch);
    },

    get_payment_url: function(data){
      var url = Domain + '/get_order_ref';
      var headers = {headers:AuthService.get_request_headers()};
      return $http.post(url,data,headers)
        .then(return_data)
        .catch(error_catch)
    },

    shortlist_bid: function(id,bid_id){
      var url = Domain + '/jobs/' + id + '/bids/' + bid_id + '/shortlist';
      var headers = {headers:AuthService.get_request_headers()};
      return $http.put(url,{},headers)
        .then(return_data)
        .catch(error_catch);
    },

    remove_from_shortlist_bid: function(id,bid_id){
      var url =  Domain + '/jobs/' + id + '/bids/' + bid_id + '/remove_from_shortlist';
      var headers = {headers:AuthService.get_request_headers()};
      return $http.put(url,{},headers)
        .then(return_data)
        .catch(error_catch);
    }

  }
}
]);
