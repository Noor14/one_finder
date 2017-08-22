app.factory("SkillsService", ["$http", "Domain",'AuthService','$q',

    function ($http, Domain,AuthService,$q) {

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

            list_skills: function () {
                var url = Domain + "/users/skills";
                var headers = {headers:AuthService.get_request_headers()};
                return $http.get(url,headers)
                .then(return_data)
                .catch(error_catch)
            },
            
            create_skill: function (data) {
                var url = Domain + "/users/skills";
                var headers = {headers:AuthService.get_request_headers()};
                return $http.put(url,data,headers)
                .then(return_data)
                .catch(error_catch)
            },

            delete_user_skill: function (id) {
                var url =  Domain + "/users/skills/" + id;
                var headers = {headers:AuthService.get_request_headers()};
                return $http.delete(url,headers)
                .then(return_data)
                .catch(error_catch);
            }

        }
    }
]);
