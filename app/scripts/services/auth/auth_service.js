app.factory("AuthService", ["$http", "Domain", "$cookies","$q",
    function ($http, Domain, $cookies,$q) {

        var userDetails;

        function get_headers(){
            return {
                'Content-Type': 'application/json',
                'sessionToken': $cookies.get('sessionToken'),
                'client':       $cookies.get('client'),
                'email':        $cookies.get('email')
            }
        }

        function error_catch(res){
            if(res.data)
                return $q.reject(res.data.errors.toString());
            else
                return $q.reject('Error');
        };

        function return_data(res){
            return res.data;
        }

        return {

            sign_in: function (data) {
                var url = Domain + "/auth/sign_in";
                return $http.post(url,data)
                .then(return_data)
                .catch(error_catch);
            },

            validate_token: function () {
                var url =  Domain + "/auth/validate_token";
                var headers = {headers: get_headers()};
                return $http.get(url,headers)
                .then(return_data)
                .catch(error_catch);
            },

            log_out: function () {
                var url = Domain + "/auth/sign_out";
                var headers = {headers: get_headers()};
                return $http.delete(url,headers)
                .then(function(){return 'Logged Out!'})
                .catch(error_catch);
            },

            // edit_password: function (data) {
            //     return $http({
            //       method: 'PUT',
            //       crossDomain: true,
            //       dataType: "JSONP",
            //       url: Domain + "/auth/password",
            //       headers: {
            //         'Content-Type': 'application/json',
            //         'sessionToken': $cookies.get('sessionToken'),
            //         'client':       $cookies.get('client'),
            //         'email':        $cookies.get('email')
            //       },
            //       data: data
            //     });
            //   },

            edit_password: function (data) {
              var url = Domain + "/auth/password";
              var headers = {headers: get_headers()};
              return $http.put(url,data,headers)
                .then(return_data)
                .catch(error_catch);
            },

            signup: function (data) {
                var url =  Domain + "/auth";
                var headers = {headers: get_headers()};
                return $http.post(url,data,headers)
                .then(return_data)
                .catch(error_catch);
            },

            forgot_password: function (data) {
                var url = Domain + "/auth/password";
                return $http.post(url,data)
                .then(return_data)
                .catch(error_catch);
            },

            fb_sign_in: function (data) {
                var url = Domain + "/auth/facebook/callback";
                return $http.post(url,data)
                .then(return_data)
                .catch(error_catch);
            },

            google_sign_in: function(data){
                var url = Domain + "/auth/google/callback";
                return $http.post(url,data)
                .then(return_data)
                .catch(error_catch);
            },

            basic_info: function (data) {
                var url = Domain + "/users/basic_info";
                var headers = {headers: get_headers()};
                return $http.put(url,data,headers)
                .then(return_data)
                .catch(error_catch);
            },

            setUserDetails: function(user){
                userDetails = user;
            },

            getUserDetails: function(){
                return userDetails;
            },

            get_request_headers: function(){
                return get_headers();
            },

            is_logged_in: function(){
                return typeof userDetails !== 'undefined';
            }
        }
    }
]);
