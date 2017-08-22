app.controller("JobsCtrl", ["$scope", "jobsService", 'toastr', "$state", "CategoryService","CountryCitiesService","$window",
  function ($scope, jobsService, toastr, $state,CategoryService,CountryCitiesService,$window) {


    $scope.totalRecords = 0;
    $scope.itemsPerPage = 20;
    $scope.currentPage  = 1;
    $scope.previousPage = 1;
    $scope.timeStamp    = '';
    $scope.filter       = {};
    $scope.morePagesAvailable = false;

    
    $scope.public_jobs = [];
    $scope.categories  = [];
    $scope.services    = [];
    $scope.cities      = [];
    
    function get_all_categories(){
      return CategoryService.get_all_categories()
    }

    function get_query_string(page, time) {
      return '?page=' + page + '&timestamp=' + time;
    }

    function get_a_service(id){
      $scope.loader = true;
      return CategoryService.get_category_skills(id)
      .then(function(data){
        $scope.loader = false;
        $scope.services = data;
        $scope.services.forEach(function(service){
          service.checked = false;
        })
      })
      .catch(function(res){
        toastr.error('Error');
        $scope.loader = false;
      })
    }

    function get_cities(){
      CountryCitiesService.get_countries()
      .then(function(res){
          var country_uae = res.data.filter(function(country){
            return country.code == "AE";
          });
          return CountryCitiesService.get_cities(country_uae[0].id);
      })
      .then(function(res){
        $scope.cities = res.data;
        $scope.cities.forEach(function(city){
          city.checked = false;
        })
        return res.data;
      })
    }
    
    function get_all_jobs(query,filter) {
      $scope.loader = true;
      if (!query) query = ''; // for initial call

      jobsService.get_public_jobs(query,filter)
      .then(function (res) {
        $scope.public_jobs = res.data.jobs;
        $scope.public_jobs.forEach(function(job){
          job.end_time =  moment(job.biddingEnds).toNow(true);
        })
        $scope.totalRecords = res.data.totalRecords;
        $scope.timeStamp = res.data.timestamp;
        $scope.morePagesAvailable = res.data.moreAvailable;
        $scope.loader = false;
      }).catch(function (error) {
      toastr.error('Error');
        $scope.loader = false;
      });
    };

    $scope.$on('$viewContentLoaded',function(){
      $scope.loader = true;
      get_all_categories()
      .then(function(data){
        $scope.loader = false;
        $scope.categories = data;
      })
      .then(get_cities)
      .then(get_all_jobs)
      .catch(function(){
        $scope.loader = false;
        toastr.error('Error while fetching data');
      })

    })
    
    $scope.load_service = function(id){
      get_a_service(id);
    }
    $scope.clear_filter = function(){
      $scope.filter = {};
      $state.reload();
    }
    
    $scope.change_page = function () {

      //going to a next page
      if ($scope.morePagesAvailable) {
        $scope.previousPage = $scope.currentPage;
        get_all_jobs(get_query_string($scope.currentPage, $scope.timeStamp),$scope.filter);
      }
      // going to a prev page
      if ($scope.currentPage < $scope.previousPage) {
        get_all_jobs(get_query_string($scope.currentPage, $scope.timeStamp),$scope.filter);
      }
    };

    $scope.filter_jobs = function(filter){
      if(!filter)
        filter ={};

      filter.categories = $scope.categories.filter(function(category){
        return category.checked;
      }).map(function(category){
        return category.id
      });

      filter.services = $scope.services.filter(function(service){
        return service.checked;
      }).map(function(serv){
        return serv.id;
      })
      
      filter.cities = $scope.cities.filter(function(city){
        return city.checked;
      }).map(function(cit){
        return cit.id;
      })

      if(filter.distance){
        $window.navigator.geolocation.getCurrentPosition(function(location) {
          filter.distance.lat = location.coords.latitude;
          filter.distance.long = location.coords.longitude;
          filter.distance.radius = parseFloat(filter.distance.radius);
          filter_helper(filter);
        } ,function(err){

            if(err.code === 1){
              toastr.error('Cant use the distance filter if location can not be fectched');
            }

            if(err.code === 2 || err.code === 3){
              toastr.error('There was an error fetching your location. Please try again');
            }
        });
      
      }else{
        filter_helper(filter); 
      }

    }

    function filter_helper(filter){
      if(!filter.searchQuery)
        filter.searchQuery = ' ';

      $scope.filter = filter;
      get_all_jobs('',filter);
    }

    $scope.is_empty_object = function(map){
       for(var key in map)
          return !map.hasOwnProperty(key);
       return true;
    }
  }
]);
