app.factory('CategoryService', ['$http', 'Domain','$q',
  function ($http, Domain, $q) {

    var error_catch  = function(res){
      if(res.data)
        return $q.reject(res.data.errors.toString());
      else
        return $q.reject('Error');
    };

    var return_data = function(res){
      return res.data;
    };

    function list(){
      var url = Domain + '/categories';
      return $http.get(url)
        .then(return_data)
        .catch(error_catch);
    }

    function get_skills(id){
      var url =  Domain + '/categories/' + id + '/services';
      return $http.get(url)
        .then(return_data)
        .catch(error_catch);
    }


    function get_skill_questions(cat_id,service_id){
      var url = Domain + '/categories/' + cat_id + '/services/' + service_id + '/service_questions';
      return $http.get(url)
        .then(return_data)
        .catch(error_catch);
    }

    function get_skill_question(cat_id,service_id,ques_id){
      var url = Domain + '/categories/' + cat_id + '/services/' + service_id + '/service_questions' + ques_id;
      return $http.get(url)
        .then(return_data)
        .catch(error_catch);
    }

    return {
      get_all_categories: function () {
        var url = Domain + '/categories';
        return $http.get(url)
          .then(return_data)
          .catch(error_catch);
      },

      list_categories: list,
      list_skills:     get_skills,
      list_skills_questions: get_skill_questions,
      list_skills_question: get_skill_question,

      get_category_skills: function (category_id) {
        var url = Domain + '/categories/' + category_id + '/services';
        return $http.get(url)
          .then(return_data)
          .catch(error_catch);
      }
    }
  }]);
