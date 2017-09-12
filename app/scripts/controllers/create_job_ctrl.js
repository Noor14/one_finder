app.controller("createjobCtrl", ["$scope", "jobsService", "$log", 'toastr', "$state", "ngDialog", "biddingService", "CategoryService", 'locationsService','vehicleService','newJobService',
  function ($scope, jobsService, $log, toastr, $state, ngDialog, biddingService, CategoryService, locationsService,vehicleService,newJobService) {

    $scope.new_job = {};
    $scope.new_job.photo = {};
    $scope.invalid_bid = false;
    $scope.step1_proceed_btn = $scope.submitting = false;

    $scope.flexibility_options = [
      {id: "0", name: "Same Day"},
      {id: "1", name: "1 Day"},
      {id: "2", name: "2 Days"},
      {id: "3", name: "3 Days"},
      {id: "4", name: "4 Days"},
      {id: "5", name: "5 Days"},
      {id: "6", name: "6 Days"},
      {id: "7", name: "1 Week"}
    ];

    // Get All Categories
    function get_cat_list() {
      CategoryService.list_categories()
        .then(function (data) {
          $scope.cats = data;
          $scope.cats_init = data;
        }).catch(function (error) {
        toastr.error('Error fetching data');
      });
    };


    $scope.previousStep = function(){
      CategoryService.list_categories()
        .then(function (data) {
          $scope.cats = data;
          $scope.process_btn1 = $scope.step1_prev_btn = false;
        }).catch(function (error) {
        toastr.error('Error fetching data');
      });
    };
    // get services of a category
    function get_cat_services(id) {
      CategoryService.list_skills(id)
        .then(function (data) {
          $scope.services = data;
        }).catch(function (error) {
        toastr.error('Error fetching data');
      });
    };

    // location list
    function get_loc_list() {
      locationsService.get_all_locations()
        .success(function (data) {
          $scope.locations = data;
        }).error(function (error) {
        console.log(error);
      });
    };


    // Vehicle list
    function get_vehicles() {
      vehicleService.get_all_vehicles()
        .then(function (data) {
          $scope.vehicles = data;
        })
        .catch(function (error) {
          toastr.error(error);
        });
    }


    $scope.add_job_location = function (data) {
      ngDialog.close();
      $state.go('app.setting', {section_id: data});
    };

    $scope.add_job_vech = function (data) {
      ngDialog.close();
      $state.go('app.setting', {section_id: data});
    };


    $scope.openscheduleCalendar = function (e) {
      console.log(e);
      console.log("Hello");
      e.preventDefault();
      e.stopPropagation();
    };

    $scope.get_cat_service = get_cat_services;

    $scope.clear_answer = function(ques){
      ques.ans = {};
      $scope.process_btn2a = true;
    };
    // Create Job Service selection Step
    $scope.skip_job_process_step1 = function () {
      if ($scope.process_btn1 && !$scope.step1_proceed_btn) {
        $scope.job_create_step1 = false;
        $scope.job_create_step2 = true;
      }
    };

    $scope.go_back_to_all_categories = function () {

      $scope.cats = $scope.cats_init;
      $scope.job_create_step2 = false;
      $scope.job_create_step1 = true;

    };

    $scope.back_to_step1 = function(){
      $scope.job_create_step2 = false;
      $scope.step1_proceed_btn = $scope.job_create_step1 = true;

    };

    $scope.go_back_step2_a = function(){
      $scope.process_btn2 = false;
      $scope.job_create_step2a = false;
      $scope.job_create_step2 = true;
    };

    $scope.go_back_step2 = function(){
      $scope.job_create_step3 = false;
      if($scope.job_has_question){
        $scope.job_create_step2a = true;
        $scope.process_btn2a = false;
      }else{
        $scope.job_create_step2 = true;
        $scope.process_btn2 = true;
      }
    };

    $scope.go_back_step_l = function(){
      $scope.process_btn4 = true;
      $scope.job_create_step4 = false;
      $scope.job_create_step3 = true;
    };

    $scope.go_back_step_v = function(){
      $scope.process_btn5 = $scope.process_btn4 = true;
      $scope.job_create_step5 = false;
      if($scope.job_location_req){
        $scope.process_btn4 = $scope.job_create_step4 = true;
      }else{
        $scope.process_btn5 = $scope.job_create_step3 = true;
      }
    };

    $scope.go_back_step_last = function(){
      $scope.job_create_step6 = false;

      if($scope.job_vehicle_req)
        $scope.job_create_step5 = true;
      else if ($scope.job_location_req)
        $scope.job_create_step4 = true;
      else
        $scope.job_create_step3 = true;
    };

    $scope.skip_job_process_step2 = function () {

      if ($scope.process_btn2 == false) {

        var services_tmp = $scope.services.filter(function(serv){
          return $scope.new_job.serviceId === serv.id;
        });
        var service = services_tmp[0];

        $scope.job_has_question = service.hasQuestions;
        $scope.job_location_req = service.locationRequired;
        $scope.job_vehicle_req  = service.vehicleRequired;

        if($scope.job_has_question){

          CategoryService.list_skills_questions(service.categoryId,$scope.new_job.serviceId)
          .then(function(data){
            $scope.questions = data;
            if($scope.questions.length){
              $scope.questions.forEach(function(obj){
                if(!obj.answers.length){
                  return $scope.process_btn2a = false;
                }
              })
            }
            $scope.job_create_step2 = false;
            $scope.job_create_step2a = true;
          })
          .catch(function(data){

          })


        }else{
          $scope.job_create_step2 = false;
          $scope.job_create_step3 = true;
        }

      }
    };

    $scope.skip_job_process_step2a = function() {
      if($scope.process_btn2a == false){
        $scope.job_create_step2a = false;
        $scope.job_create_step3 = true;
      }
    }

    $scope.skip_job_process_step3 = function () {
      if ($scope.process_btn3 == false) {
        if($scope.job_location_req){ //skip location if not required
          $scope.job_create_step3 = false;
          $scope.job_create_step4 = true;
        }else{

          if($scope.job_vehicle_req){ //skip vehicle if not required
            $scope.job_create_step3 = false;
            $scope.job_create_step5 = true;
          }else{
            $scope.job_create_step3 = false;
            $scope.job_create_step6 = true;
          }
        }
      }
    };

    $scope.skip_job_process_step4 = function () {
      if($scope.job_vehicle_req && !$scope.process_btn4){
        $scope.job_create_step4 = false;
        $scope.job_create_step5 = true;
      }
      else if(!$scope.job_vehicle_req && !$scope.process_btn4){
        $scope.job_create_step4 = false;
        $scope.job_create_step6 = true;
      }

    };


    $scope.skip_job_process_step5 = function () {
      if(!$scope.process_btn5 && !$scope.process_btn5){
      $scope.job_create_step5 = false;
      $scope.job_create_step6 = true;
      }
    };

    $scope.job_schedule_datepicker = {
      opened : false
    };
    $scope.job_bid_datepicker = {
      opened: false
    };

    $scope.openscheduleCalendar = function (e) {
      e.preventDefault();
      e.stopPropagation();

      $scope.job_schedule_datepicker.opened = true;
    };

    $scope.openbidCalendar = function (e) {
      e.preventDefault();
      e.stopPropagation();
      $scope.job_bid_datepicker.opened = true;
    };


    $scope.dateOptions = {
      minDate: moment().millisecond(0).second(0).minute(0).hour(0),
      showWeeks: false
    };

    $scope.check_bid_date = function (bid_date) {

      var tamschedule = new Date($scope.new_job.schedule);
      var tamsbid = new Date(bid_date);
      if (tamschedule == "" || tamschedule == null || tamschedule == undefined) {

      } else {
        if (tamsbid > tamschedule) {
          $scope.invalid_bid = true;
        } else {
          $scope.invalid_bid = false;
        }
      }

    };

    $scope.check_start_date = function (start_date) {

      var tamschedule = new Date(start_date);
      var tamsbid = new Date($scope.new_job.biddingEnds);
      if (tamsbid == "" || tamsbid == null || tamsbid == undefined) {

      } else {
        if (tamsbid > tamschedule) {
          $scope.invalid_bid = true;
        } else {
          $scope.invalid_bid = false;
        }
      }

    };


    $scope.remove_photo = function (index) {
      $scope.new_job.photos.splice(index, 1);
    };

    $scope.add_photo = function (new_pic) {
      if (jQuery.isEmptyObject(new_pic) || typeof new_pic === 'undefined')
        return;

      if(new_pic.filesize >= 4000000){
        toastr.error('Photo size too large');
        return;
      }


      if (!$scope.new_job.photos)
        $scope.new_job.photos = [];
      if ($scope.new_job.photos.length === 5) {
        toastr.error('You can only upload five photos');
        return;
      }
      $scope.new_job.photos.push(new_pic);
      $scope.new_job.photo = '';
    }

    $scope.addJob = function (new_job) {
     $scope.loader = $scope.submitting = true;
      if($scope.job_has_question){

        $scope.new_job.jobQuestions = $scope.questions.map(function(q){
          return{
            questionId: q.id,
            answerId: q.ans.id
          };
        })

      }

      if (new_job.photos == null || new_job.photos == undefined || new_job.photos == "") {

      } else {
        $scope.job_photos = new_job.photos;
        new_job.imagesBase64 = [];

        for (var i = 0; i < $scope.job_photos.length; i++) {
          new_job.imagesBase64.push($scope.job_photos[i]);
        }
        new_job.imagesBase64.map(function (item) {
          delete item.filename;
          delete item.filesize;
          delete item.filetype;
        });
      }

      delete new_job.photo;
         newJobService.createJob(new_job)
        .then(function (data) {
          $scope.closeThisDialog();
          emptyForm();
          $scope.loader = false;
          toastr.success('Job has been Created Successfully', 'Success');
          $scope.submitting = false;
        })
        .catch(function (data) {
          $scope.loader = false;
          $scope.submitting = false;
          toastr.error(data, "ERROR");
        })
    };


    var emptyForm = function () {
      $scope.addJobForm.$setUntouched();
      $scope.addJobForm.$setPristine();
      $scope.new_job = {};
    };

    $scope.enable_processbtn1 = function (cat) {
      if (cat.hasChildren) {
        $scope.step1_proceed_btn = true;
        $scope.cats = cat.children;
        $scope.step1_prev_btn = $scope.process_btn1 = true;
      }
      else{
        $scope.step1_proceed_btn = false;
      }
    };

    $scope.enable_processbtn2 = function () {
      $scope.process_btn2 = false;
    };


    $scope.enable_processbtn2a = function(){
      var count = 0;
      $scope.questions.forEach(function(ques){
        if(ques.required &&  Object.keys(ques.ans).length > 0){
          count++;
        }
      });
      var req = $scope.questions.filter(function(q){ return q.required});

      if(req.length === 0 || req.length === count)
        $scope.process_btn2a = false;
    };


    $scope.enable_processbtn3 = function (val) {
      if (val === undefined || val === "" || val === null) {
        $scope.process_btn3 = true;
      } else {
        $scope.process_btn3 = false;
      }
    };

    $scope.enable_processbtn4 = function () {
      $scope.process_btn4 = false;

    };

    $scope.enable_processbtn5 = function(){
      $scope.process_btn5 = false;
    };
    function init() {
      $scope.step1_prev_btn = false;
      $scope.process_btn1  = false;
      $scope.process_btn2  = true;
      $scope.process_btn2a = true;
      $scope.process_btn3  = true;
      $scope.process_btn4  = true;
      $scope.process_btn5  = true;
      $scope.job_create_step1 = true;
      $scope.showWeeks = false;
      $scope.end_bid = {};

      $scope.cats = {};
      $scope.cats_init = {};
      $scope.locations = {};
      $scope.vehicles = {};
      get_cat_list();
      get_loc_list();
      get_vehicles();
    };

    init();
  }]);
