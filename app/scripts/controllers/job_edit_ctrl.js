app.controller("JobEditCtrl", ["$scope", "jobsService", 'toastr', "CategoryService",'locationsService','vehicleService', 'job_detail',
  function ($scope, jobsService, toastr, CategoryService, locationsService,vehicleService,job_detail) {

    // navigation - start
    $scope.go_job_edit_step2 = function(){
      if($scope.step1_valid()){
        $scope.job_edit_step1 = false;
        $scope.job_edit_step2 = true;
      }
    }

    $scope.go_job_edit_step3 = function(){
      if($scope.step2_valid()){
        //check if location / vehicle required
        //and navigate accordingly
        var skill = {};
        if($scope.change_service){
          skill = $scope.selected_skills;
        }else{
          skill = $scope.job.service;
        }
        
        $scope.skill_selected_tmp = skill;

        if($scope.skill_selected_tmp.locationRequired){

          $scope.job_edit_step2 = false;
          $scope.job_edit_step3 = true;

        }else{
          if($scope.skill_selected_tmp.vehicleRequired){
            $scope.job_edit_step2 = false;
            $scope.job_edit_step4 = true;
          }else{
            $scope.job_edit_step2 = false;
            $scope.job_edit_step5 = true;
          }
        }
      }
    }

    $scope.go_job_edit_step4 = function(){
      if($scope.step3_valid()){
        //check if vehicle required
        //and navigate accordingly
        if($scope.skill_selected_tmp.vehicleRequired){
          $scope.job_edit_step3 = false;
          $scope.job_edit_step4 = true;
        }else{
          $scope.job_edit_step3 = false;
          $scope.job_edit_step5 = true;
        }
      }
    }

    $scope.go_job_edit_step5 = function(){
      if($scope.step4_valid()){
        $scope.job_edit_step4 = false;
        $scope.job_edit_step5 = true;
      }
    }
    // navigation - start

    // edit form submit - start
    $scope.edit_job = function(job){

      job.photos = job.photos.map(function(photo){
        return photo.id;
      });

      var payload = {
        id: job.id,
        title: job.title,
        budget: job.budget,
        photos: job.photos,
        description: job.description,
        schedule: job.schedule,
        biddingEnds: job.biddingEnds,
        flexibility: $scope.flexibility.id
      };

      //service location vehicles
      if($scope.change_service){
        payload.serviceId = $scope.selected_skills.id;
      }else{
        payload.serviceId = job.service.id
      }

      
      if($scope.skill_selected_tmp.vehicleRequired){
        if($scope.change_vehicle){
          payload.vehicleId = $scope.new_vehicle.id;
        }else{
          payload.vehicleId = job.vehicle.id;
        }
      }

      if($scope.skill_selected_tmp.locationRequired){
        if($scope.change_location){
          payload.locationId = $scope.new_location.id;
        }else{
          payload.locationId = job.location.id;
        }        
      }

      var upload_photos = false;
      if(job.photos_new){
        if(job.photos_new.length >0){
          upload_photos = true;
          payload.images = job.photos_new;
        }
      }

      $scope.loader  = true;
      jobsService.edit_job(job.id,payload,upload_photos)
      .then(function(data){
        $scope.loader  = false;
        toastr.success('Success');
        $scope.closeThisDialog();
        $scope.state.reload();
      })
      .catch(function(data){
        $scope.loader  = false;
        toastr.error(data);
      })
    };
    // edit form submit - end

    // Get All Categories
    function categories_list(){
      $scope.cats = {};
      CategoryService.get_all_categories()
      .then(function (data) {
        $scope.cats = data;
      }).catch(function (error) {
        console.log(error);
      });
    };

    // location list
    function locations_list(){
      $scope.locations = {};
      locationsService.get_all_locations()
      .success(function (data) {
        $scope.locations = data;
      }).error(function (error) {
        console.log(error.errors[0]);
      });
    };

    // get category skills
    $scope.get_skills = function(cat){
      if(cat && !cat.hasChildren){
        CategoryService.get_category_skills(cat.id)
        .then(function (data) {
          $scope.skills = data;
        }).catch(function (data) {
            toastr.error(data,'Error');
        })
      }else{
        $scope.selected_skills = undefined;
        $scope.category_child  = undefined;
        $scope.category_grand_child = undefined;
        $scope.skills = undefined;
      }
    }

    // vehicle list
    function vehicles_list(){
      $scope.vehicles = {};
      vehicleService.get_all_vehicles()
      .then(function (data) {
        $scope.vehicles = data;
      }).catch(function (error) {
        toastr.error(error);
      });

    };


    //schedule / bid date - start
    $scope.check_bid_date = function (bid_date) {

      var tamschedule = new Date($scope.job.schedule);
      var tamsbid = new Date(bid_date);
      if(tamschedule == "" || tamschedule == null || tamschedule == undefined){

      }else{
        if(tamsbid > tamschedule){
          $scope.invalid_bid = true;
        }else{
          $scope.invalid_bid = false;
        }
      }

    };

    $scope.check_start_date = function (start_date) {

      var tamschedule = new Date(start_date);
      var tamsbid = new Date($scope.job.biddingEnds);
      if(tamsbid == "" || tamsbid == null || tamsbid == undefined){

      }else{
        if(tamsbid > tamschedule){
          $scope.invalid_bid = true;
        }else{
          $scope.invalid_bid = false;
        }
      }

    };

    $scope.date_options = {
      minDate: moment().millisecond(0).second(0).minute(0).hour(0),
      showWeeks:false
    };

    $scope.job_schedule_datepicker = {
      open: false
    }
    $scope.job_bid_datepicker = {
      open: false
    };

    $scope.open_schedule_calendar = function (e) {
      $scope.job_schedule_datepicker.open = true;
    };

    $scope.open_bid_calendar = function (e) {
      $scope.job_bid_datepicker.open = true;
    };

    $scope.change_flexibility = function(flex){
      $scope.flexibility = flex;
    }


    //schedule / bid date - end

    //get set location/vehicle/service  - start
    $scope.change_job_service = function(){
      $scope.change_service = true;
    };

    $scope.change_job_location = function(){
      $scope.change_location = true;
    };

    $scope.change_job_vehicle = function(){
      $scope.change_vehicle = true;
    };

    $scope.set_location = function(l){
      $scope.new_location = l;
    }

    $scope.set_vehicle = function(v){
      $scope.new_vehicle = v;
    };
    //get set location/vehicle/service  - end

    // validations - start
    $scope.step1_valid = function(){
      return  $scope.job.title &&
              $scope.job.budget;
    };

    $scope.step2_valid = function(){
      if($scope.change_service){

        if($scope.selected_skills){
          return ($scope.selected_skills.length > 0) ? true : false;
        }else{
          return false;
        }

      }else{
        return $scope.job.service ? true : false;
      }
    };

    $scope.step3_valid = function(){
      if($scope.change_location){
        return $scope.new_location ? true : false;
      }else{
        return $scope.job.location ? true : false;
      }
    };

    $scope.step4_valid = function(){
      if($scope.change_vehicle){
        return $scope.new_vehicle ? true : false;
      }else{
        return $scope.job.vehicle ? true : false;
      }
    };

    $scope.step5_valid = function(){
      return $scope.job.biddingEnds &&
             $scope.job.schedule &&
             ($scope.job.schedule > $scope.job.biddingEnds) &&
             $scope.flexibility;
    };
    // validations - end

    // add / remove photos - start
    $scope.remove_photo = function(index){
      $scope.job.photos.splice(index,1);
    };

    $scope.remove_photo_new = function(index){
      $scope.job.photos_new.splice(index,1);
    };

    $scope.add_photo = function addPhoto(new_pic){

      if(!$scope.job.photos_new)
        $scope.job.photos_new = [];
      if(($scope.job.photos_new.length + $scope.job.photos.length) === 5){
        toastr.error('You can only upload five photos');
        return;
      }
      $scope.job.photos_new.push(new_pic);
    };
    // add / remove photos - end

    function get_data(){
      $scope.job = angular.copy(job_detail);
      $scope.job.budget = parseFloat(job_detail.budget);
      $scope.change_service  = false;
      $scope.job.photos_new = [];
      $scope.change_location = $scope.job.location ? false : true;
      $scope.change_vehicle = $scope.job.vehicle ? false : true;
      $scope.skills = {};
      $scope.flexibility_options = [
        {id: "0",name: "Same Day"},
        {id: "1",name: "1 Day"},
        {id: "2",name: "2 Days"},
        {id: "3",name: "3 Days"},
        {id: "4",name: "4 Days"},
        {id: "5",name: "5 Days"},
        {id: "6",name: "6 Days"},
        {id: "7",name: "1 Week"}
      ];
      var flex = $scope.flexibility_options.filter(function(flex){
        return parseInt(flex.id) === $scope.job.flexibility;
      });
      $scope.flexibility = flex[0];
      $scope.loader  = false;
      $scope.job_edit_step1 = true;
    }

    function init(){
      get_data();
      categories_list();
      locations_list();
      vehicles_list();
    };

    init();
  }
]);
