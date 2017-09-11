function config($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/auth/login");

  $stateProvider

  .state('app', {
    url: "/app",
    templateUrl: "views/common/full_template.html",
    abstract: true,
    controller: 'MainCtrl'
  })
    .state('auth', {
      url: "/auth",
      templateUrl: "views/common/empty_template.html",
      abstract: true
    })
    .state('app.home', {
      url: "/home",
      templateUrl: "views/setting.html",
      authorize: true
    })
    .state('app.dashboard', {
      url: "/dashboard",
      templateUrl: "views/dashboard.html",
      controller: "DashboardCtrl",
      authorize: true
    })
    .state('auth.login', {
      url: "/login",
      templateUrl: "views/auth/login.html",
      controller: "AuthCtrl"
    })
    .state('auth.signup', {
      url: "/signup",
      templateUrl: "views/auth/sign_up.html",
      controller: "AuthCtrl"
    })
    .state('auth.forgot_password', {
      url: "/forgot_password",
      templateUrl: "views/auth/forgot_password.html",
      controller: "AuthCtrl"
    })
    .state('app.messages', {
      url: "/messages",
      templateUrl: "views/messaging.html",
      controller: "MessagingCtrl",
      authorize: true
    })
    .state('app.messages.detail',{
      url: '/:id',
      views:{
        'message-detail':{
          templateUrl: 'views/messaging-detail.html',
          controller: 'MessageDetailCtrl',
          params:{id:null}
        }
      },
      authorize: true
    })
    .state('app.jobs-gu', {
      url: "/my-jobs",
      templateUrl: "views/my_jobs_gu.html",
      controller: "MyJobsGUCtrl",
      authorize: true
    })
    .state('app.jobs-sp', {
      url: "/my_jobs",
      templateUrl: "views/my_jobs_sp.html",
      controller: "MyJobsSPCtrl",
      authorize: true
    })
    .state('app.explore-jobs', {
      url: "/explore-jobs",
      templateUrl: "views/jobs.html",
      controller: "JobsCtrl",
      authorize: true
    })
    .state('app.job_detail', {
      url: "/jobs/:id",
      templateUrl: "views/job_detail.html",
      controller: "JobdetailCtrl",
      authorize: true
    })
    .state('app.job_detail-gu', {
      url: "/jobs/:id/detail",
      templateUrl: "views/job_detail_gu.html",
      controller: "JobDetailGUCtrl",
      params:{id:null},
      authorize: true
    })
    .state('app.job-bid-transaction-success',{
      url:'/jobs/:id/bid/:bid_id/transaction/success',
      templateUrl: 'views/jobs_transaction_success.html',
      controller:'JobBidTransSuccessCtrl',
      params:{id:null,bid_id:null},
      authorize: true
    })
    .state('app.job-bid-transaction-failure',{
      url: '/jobs/:id/bid-transaction/failed',
      templateUrl: 'views/jobs_transaction_failure.html',
      controller: 'JobBidTransFailureCtrl',
      params:{id:null},
      authorize: true
    })
    .state('app.job-bid-transaction-cancelled',{
      url: '/jobs/:id/bid-transaction/cancelled',
      templateUrl: 'views/jobs_transaction_cancelled.html',
      controller: 'JobBidTransCancelledCtrl',
      params:{id:null},
      authorize: true
    })
    .state('app.job_bids',{
      url:'/jobs/:id/bids',
      templateUrl:'views/job_bids.html',
      controller:'JobBidsCtrl',
      params:{id:null},
      authorize: true
    })
    .state('app.reports',{
      url:'/reports',
      templateUrl: 'views/reports.html',
      controller: 'ReportsCtrl',
      authorize: true
    })
    .state('app.vehicle_detail', {
      url: "/vehicle_detail/:id",
      templateUrl: "views/vehicle_detail.html",
      controller: "vehicle_detailCtrl",
      authorize: true
    })
    .state('app.location_detail', {
      url: "/location_detail/:id",
      templateUrl: "views/location_detail.html",
      controller: "location_detailCtrl",
      authorize: true
    })
    .state('app.edit_location', {
      url: "/edit_location/:id",
      templateUrl: "views/edit_location.html",
      controller: "editlocationCtrl",
      authorize: true
    })
    .state('app.setting', {
      url: "/setting",
      templateUrl: "views/setting.html",
      controller: "SettingCtrl",
      params:{section_id:null},
      authorize: true
    })
    .state('app.setting.public_profile',{
      url: '/public-profile',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/public_profile_block.html',
          controller: 'SettingPublicProfileCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.basic_details',{
      url: '/basic-details',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/basic_info_block.html',
          controller: 'SettingBasicDetailsCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.change_password',{
      url: '/change-password',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/change_password_block.html',
          controller: 'SettingChangePasswordCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.locations',{
      url: '/locations',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/locations_block.html',
          controller: 'SettingLocationsCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.vehicles',{
      url: '/vehicles',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/vehicles_block.html',
          controller: 'SettingVehiclesCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.notifications',{
      url: '/notifications',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/notifications_block.html',
          controller: 'SettingNotificationsCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.services_offered',{
      url: '/services-offered',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/skill_details_block.html',
          controller: 'SettingsServicesOfferedCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.cities_of_operation',{
      url: '/cities-of-operation',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/cities_of_operation_block.html',
          controller: 'SettingsCitiesOperationCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.documents',{
      url: '/documents',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/documents_block.html',
          controller: 'SettingsDocumentCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.employees',{
      url: '/employees',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/employees_block.html',
          controller: 'SettingsEmployeeCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.employment_invite',{
      url: '/employment-invite',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/employment_invites_block.html',
          controller: 'SettingsEmploymentInviteCtrl'
        }
      },
      authorize: true
    })
    .state('app.setting.become_service_provider',{
      url: '/become-service-provider',
      views:{
        'setting-detail':{
          templateUrl: 'views/partials/settings/service_provider_block.html',
          controller: 'SettingBecomeServiceProviderCtrl'
        }
      },
      authorize: true
    })
}
app.config(['$stateProvider','$urlRouterProvider',config]);
//app.constant("Domain","http://api_staging.onefindr.com/api/v0_1");      //STAGING
//app.constant("Domain_cable","ws://api_staging.onefindr.com/cable");     //STAGING_Cable
 app.constant("Domain","http://api.onefindr.com/api/v0_1");            //PROD
 app.constant("Domain_cable","ws://api.onefindr.com/cable");           //PROD_Cable
app.config( ['uiGmapGoogleMapApiProvider', function(zippy) {
  zippy.configure({
    pakistan: true
  });
}]);


app.run(['$rootScope','$state','AuthService','$cookies','ActionCableConfig','Domain_cable',

  function($rootScope, $state,AuthService,$cookies,ActionCableConfig,Domain_cable) {

    var userFromCookie;
    if($cookies.get('user')){
      userFromCookie = JSON.parse($cookies.get('user'));
      ActionCableConfig.wsUri= Domain_cable
        + '?sessionToken=' + $cookies.get('sessionToken')
        + '&client=' + $cookies.get('client')
        + '&email=' + $cookies.get('email');
      ActionCableConfig.autoStart= false;
    }else{
      userFromCookie = undefined;
    }

    AuthService.setUserDetails(userFromCookie);

    $rootScope.$on('$stateChangeStart',

      function(e, toState, toParams, fromState, fromParams) {
        if(toState.authorize && !AuthService.is_logged_in()){
          e.preventDefault();
          $state.go('auth.login');
        }

        if(toState.name === 'auth.login' && AuthService.is_logged_in() && fromState.name){
          e.preventDefault();
        }

    });
  }
]);
