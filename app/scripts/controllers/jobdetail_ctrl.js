app.controller("JobdetailCtrl", ["$scope", "jobsService", 'toastr', "$state", "ngDialog", "biddingService", "NgMap",'AuthService','document_service','UtilService','ConversationService',
    function ($scope, jobsService, toastr, $state, ngDialog, biddingService, NgMap,AuthService,document_service,UtilService,ConversationService) {

        var BID_LIMIT = 999999;
        $scope.slides = [];
        $scope.job_status = [
            {id:1,val:'In Bidding'},
            {id:2,val:'Bidding Closed'},
            {id:3,val:'Not Started'},
            {id:4,val:'Started'},
            {id:5,val:'Not Assigned'},
            {id:6,val:'Assigned'},
            {id:7,val:'Recently Completed'},
            {id:8,val:'In dispute'},
            {id:9,val:'Signed Off'}
        ];

        $scope.start_convo = function(){
            var payload = {
                userId: $scope.my_job_detail.postedBy.id,
                jobId:  $scope.my_job_detail.id
            };
            ConversationService.start(payload)
            .then(function(data){
                $state.go('app.messages.detail',{id:data.id});
            })
            .catch(function(data){
                toastr.error(data,'Error');
            })
        }

        $scope.view_dispute = function(){
            ngDialog.open({
                template: '/views/common/dispute_view_lightbox.html',
                className: 'ngdialog-theme-default dashboard-signup-form',
                controller: 'JobDisputeViewCtrl',
                scope: $scope,
                resolve:{
                    job: function(){
                        return $scope.my_job_detail;
                    }
                }
            })
        }

        $scope.get_status = function(status){
            var ret = $scope.job_status.filter(function(fil){
                return fil.id === status;
            })
            return ret.length >0  ? ret[0].val : ' ';
        }

        $scope.job_detail = function () {
            $scope.loader = true;
            jobsService.get_job_detail($state.params.id)
            .success(function (data) {
                $scope.my_job_detail = data;
                $scope.my_job_detail.end_time = moment($scope.my_job_detail.biddingEnds).toNow(true);
                $scope.my_job_detail.photos.forEach(function(pic,index){
                    $scope.slides.push({id:index,image:pic.url});
                })

                if($scope.slides.length === 0)
                    $scope.slides.push({id:0,image:'images/img15.jpg'})

                $scope.end_date = $scope.my_job_detail.end_time;
                $scope.edit_bid = $scope.my_job_detail.myBid;

                if($scope.edit_bid){
                    $scope.edit_bid.proposedSchedule =  new Date($scope.edit_bid.proposedSchedule);
                    $scope.edit_bid.bidValue = parseFloat($scope.edit_bid.bidValue);
                }else{
                    $scope.new_bid = {};
                    $scope.new_bid.proposedSchedule  = new Date($scope.my_job_detail.schedule);
                }
                var currDate = new Date();
                var endBid   = $scope.my_job_detail.biddingEnds;
                $scope.hasBidExpired = moment(currDate).isAfter(endBid,'minute');
                $scope.hasBidExpired = moment(currDate).isAfter(endBid,'minute');
                $scope.loader = false;
            })
            .error(function (error) {
                $scope.loader = true;
                toastr.error(error.errors[0]);
            });
        };


        $scope.get_my_jobs = function (x) {
            $scope.loader = true;
            $scope.type = null;
            $scope.status = null;
            $scope.get_my_jobs_back = function () {
                jobsService.get_my_jobs($scope.lastId, $scope.type, $scope.status)
                .success(function (data) {
                    angular.forEach(data.jobs, function (job) {
                        job.end_time = moment(job.biddingEnds).toNow(true);
                        $scope.my_jobs.push(job);
                    });
                    $scope.lastId = data.lastId;
                    $scope.moreAvailable = data.moreAvailable;
                    $scope.loader = false;
                })
                .error(function (error) {
                  toastr.error(error.errors[0]);
                });
            };
        };

        $scope.open_bidding_box = function(){
            if(!$scope.hasBidExpired){
                ngDialog.open({
                    template: '/views/common/bidding_lightbox.html',
                    className: 'ngdialog-theme-default dashboard-signup-form',
                    controller: 'JobdetailCtrl',
                    scope:$scope
                });
            }
        };

        $scope.open_bidding_box_edit = function(){
            ngDialog.open({
                template: '/views/common/bidding_lightbox.html',
                className: 'ngdialog-theme-default dashboard-signup-form',
                controller: 'JobdetailCtrl',
                scope:$scope
            });
        };

        $scope.openCalendar1 = function (e,prop){
            $scope.isOpen1.popup = true;
        };

        $scope.openCalendar2 = function (e,prop){
            $scope.isOpen2.popup = true;
        };

        $scope.submit_job_bid = function (){
            if(!checkDate(0)){
                toastr.error('Felixiblity of ' + $scope.my_job_detail.flexibility + ' day after schedule allowed');
                return;
            }

            if($scope.new_bid.bidValue > BID_LIMIT){
                toastr.error('Bid Amount should be lower than  AED 999,999');
                return;
            }
            $scope.loader = true;
            $scope.edit_bid_submit  = true;
            biddingService.post_bid($scope.new_bid, $state.params.id)
            .then(function (data) {
                $scope.new_bid = data.jobs;
                $scope.closeThisDialog();
                $scope.loader = false;
                $scope.edit_bid_submit  = false;
                toastr.success('Your bid has been submitted');
                $state.reload();
            })
            .catch(function (data) {
                $scope.edit_bid_submit  = false;
                toastr.error(data);
            });
        };

        $scope.delete_bid = function (){
            $scope.loader = true;
            biddingService.delete_bid($state.params.id, $scope.edit_bid.id)
            .then(function (data) {
                $scope.closeThisDialog();
                $scope.loader = false;
                toastr.success('Your bid has been deleted');
                $state.reload();
            })
            .catch(function (data) {
                toastr.error(data);
            });
        };

        function checkDate(mode){
            var date;
            if(mode === 0){ //create
                date = $scope.new_bid.proposedSchedule;
            }else{  //edit
                date  = $scope.edit_bid.proposedSchedule;
            }
            var flex = $scope.my_job_detail.flexibility;
            var flexiDate = moment($scope.my_job_detail.schedule).add(flex,'days');
            return  moment(date).isSameOrBefore(flexiDate.toISOString(), 'day');
        }

        $scope.edit_job_bid = function (){
            if(!checkDate(1)){
                toastr.error('Felixiblity of ' + $scope.my_job_detail.flexibility + ' day after schedule allowed');
                return;
            }

            if($scope.edit_bid.bidValue > BID_LIMIT){
                toastr.error('Bid Amount should be lower than  AED 999,999');
                return;
            }
            $scope.edit_bid_submit = true;
            $scope.loader = true;
            biddingService.submit_edit_bid($scope.edit_bid, $state.params.id, $scope.edit_bid.id)
            .then(function (data) {
                $scope.closeThisDialog();
                $scope.loader = false;
                $scope.edit_bid_submit = false;
                toastr.success('Changes saved!');
                $state.reload();
            })
            .catch(function (data) {
                toastr.error(data);
                $scope.loader = false;
                $scope.edit_bid_submit = false;
            });
        };

        $scope.open_job_completion_box = function (){
            ngDialog.open({
                template: '/views/common/job_completion_box.html',
                className: 'ngdialog-theme-default dashboard-signup-form'
            });
        };

        $scope.assign_job = function(){
            ngDialog.open({
                template: '/views/common/job_assign_lightbox.html',
                className: 'ngdialog-theme-default dashboard-signup-form',
                controller: 'JobAssignCtrl',
                scope: $scope
            });
        }

        $scope.start_job = function(){
            ngDialog.open({
                template: '/views/common/job_start_lightbox.html',
                className: 'ngdialog-theme-default dashboard-signup-form',
                controller: 'JobStartCtrl',
                scope: $scope,
                resolve: {
                    job: function depFactory() {
                        return $scope.my_job_detail;
                    }
                }
            });
        }

        $scope.open_completion_details = function(type){
            var templatePath = '/views/partials/jobs-sp/completion_'+ type + '.html';
            ngDialog.open({
                template: templatePath,
                className: 'ngdialog-theme-default dashboard-signup-form',
                controller: 'JobCompletionDetailsCtrl',
                resolve: {
                    job_completion_details: function depFactory() {
                        return $scope.my_job_detail.jobCompletionDetails;
                    }
                }
            });
        }

        $scope.add_notes_photo = function(photo){
            if(!$scope.job_notes.photos)
                $scope.job_notes.photos = [];
            $scope.job_notes.photos.push(photo);
        }

        $scope.remove_notes_photo = function(index){
            $scope.job_notes.photos.splice(index,1);
        }

        $scope.complete_job = function (){

            if($scope.job_notes.photos != undefined) {
                $scope.loader = true;
                var pic = {};
                $scope.picture = {};
                var pics = [];
                pic["input"] = "data:" + $scope.job_notes.photos.filetype + ";base64," + $scope.job_notes.photos.base64;
                $scope.job_notes.photos.forEach(function(photo){
                  pics.push(photo);
                })
                UtilService.uploadPictures(pics)
                .then(function (data) {
                    $scope.job_notes.photos = data;
                    jobsService.complete_job($scope.job_notes, $state.params.id)
                    .success(function (data) {
                        $scope.job_notes = data;
                        $scope.loader = false;
                        toastr.success('You job has been marked completed successfully', 'Success!');
                        $scope.closeThisDialog();
                        $state.reload();
                    })
                    .error(function (error) {
                        toastr.error(error.errors[0], 'Error');
                    });
                });

            }else{

                jobsService.complete_job($scope.job_notes, $state.params.id)
                .success(function (data) {
                    $scope.job_notes = data;
                    $scope.loader = false;
                    toastr.success('You job has been marked completed successfully', 'Success!');
                    $scope.closeThisDialog();
                    $state.reload();
                }).error(function (error) {
                    toastr.error(error.errors[0], 'Error');
                });
            }
        };

        function init(){
            $scope.hasBidExpired = false;
            $scope.edit_bid = {};
            $scope.job_detail();
            $scope.isOpen1 = {popup:false};
            $scope.isOpen2 = {popup:false};
            $scope.new_bid = {};
            $scope.loader = false;
            $scope.edit_bid_submit = false;
            $scope.current_user = AuthService.getUserDetails();
            $scope.is_user_employer = $scope.current_user.serviceProviderDetails.type   === 1; //Company
            $scope.is_user_employee = $scope.current_user.serviceProviderDetails.type   === 3; //Employee
            $scope.is_user_freelancer = $scope.current_user.serviceProviderDetails.type === 2; //Freelancer
            $scope.state  = $state;

        };

        init();
    }
]);

