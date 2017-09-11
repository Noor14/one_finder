app.controller("AuthCtrl", ["AuthService", "$scope", "$cookies", "$state", "toastr", 'ngDialog',
    function (AuthService, $scope, $cookies, $state, toastr,ngDialog) {

        function init(){

            $scope.form_submit  = false;
            $scope.loader       = false;
            $scope.login        = {};
            $scope.signup       = {};
            $scope.info         = {};
            $scope.state        = $state;
        };

        var dialog = {};

        function choose_user_role(){
          if(!ngDialog.isOpen(dialog.id)){
            dialog = ngDialog.open({
              template: '/views/common/usertype_lightbox.html',
              className: 'ngdialog-theme-default dashboard-signup-form login_lightbox',
              scope: $scope,
              controller: 'ChooseUserRoleCtrl',
              resolve: {
                action: function () {  //type 1 ==> state change //value ==> ToState
                  return {
                    type: 1,
                    value: 'app.dashboard'
                  };
                }
              }
            });
          }
        }

        function set_cookies(d){
            $cookies.put('client', d.client);
            $cookies.put('sessionToken', d.sessionToken);
            $cookies.put('email', d.email);
        }

        function set_user_cookie(user){
            $cookies.put('user',JSON.stringify(user));
        }

        function set_user_role(role){
            $cookies.put('user_current_role',role);
        }

        function login(credentials){

            $scope.loader = true;
            AuthService.sign_in(credentials)
            .then(function (data) {

                set_cookies(data);

                if (data.user.userType == 0)
                    $state.go('auth.login');

                AuthService.setUserDetails(data.user);
                set_user_cookie(data.user);
                $scope.loader = false;

                if (data.user.userType == 1) { //GENERAL USER
                    set_user_role('general_user');
                }

                if (data.user.userType == 2 || data.user.userType == 3) //SERVICE PROVIDER (verified and verfication pending)
                    choose_user_role();

                if(data.user.userType == 4)
                    toastr.error('Something went wrong');
            })
            .catch(function (error) {
                $scope.loader = false;
                toastr.error(error, 'Error');
            });
        }

        function signup(new_user,new_user_info){

            if (new_user.password === new_user.confirmPassword) {
                $scope.form_submit = true;
                AuthService.signup(new_user)
                .then(function (data){
                    set_cookies(data);
                    return AuthService.basic_info($scope.info);
                })
                .then(function (data) {
                    AuthService.setUserDetails(data);
                    set_user_cookie(data);
                    $scope.form_submit = false;
                    set_user_role('general_user');
                    $state.go('app.dashboard');
                    toastr.success('You signed up Successfully', 'Success!');
                })
                .catch(function (error) {
                    $scope.form_submit = false;
                    toastr.error(error);
                })
            }else
                toastr.error("Password do not match");
        }

        function forgot_password(detail){
            $scope.form_submit = true;
            AuthService.forgot_password(detail)
            .then(function (data) {
                $scope.form_submit = false;
                toastr.success(data.message);
            }).catch(function (error) {
                $scope.form_submit = false;
                toastr.error(error);
            });
        }

        function facebook_login(){

            FB.login(function (response) {

                if (response.authResponse) {
                    FB.api('/me', function (response) {
                        var access_token_response = FB.getAuthResponse();
                        var access_token          = access_token_response.accessToken;
                        var requested_token       = {"accessToken": access_token };

                        AuthService.fb_sign_in(requested_token)
                        .then(function (data) {
                            set_cookies(data);
                            set_user_cookie(data.user);
                            AuthService.setUserDetails(data.user);
                            $scope.user_info = data.user;

                            if ($scope.user_info.userType == 1) {
                                set_user_role('general_user');
                                $state.go('app.setting');
                                toastr.success('You logged in Successfully', 'Success!');
                            };

                            if ($scope.user_info.userType == 2 || $scope.user_info.userType == 3) //SERVICE PROVIDER (verified and verfication pending)
                                choose_user_role();
                        })
                        .catch(function (error) {
                            toastr.error(error, 'Error');
                        });
                    });
                }else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            });
        }

        function google_login(){

            var params = {
                'clientid':'723104159784-g8l4ums5tt4oictjl1vpbkb6bst9k196.apps.googleusercontent.com',
                'cookiepolicy':'single_host_origin',
                'callback': function(result){
                    if(result.status.google_logged_in){
                        var access_token  = {accessToken:result.id_token};
                        AuthService.google_sign_in(access_token)
                        .then(function(data){
                            set_cookies(data);
                            set_user_cookie(data.user);
                            AuthService.setUserDetails(data.user);
                            $scope.user_info = data.user;

                            if ($scope.user_info.userType == 1) {
                                set_user_role('general_user');
                                $state.go('app.setting');
                                toastr.success('You logged in Successfully', 'Success!');
                            };

                            if ($scope.user_info.userType == 2 || $scope.user_info.userType == 3) //SERVICE PROVIDER (verified and verfication pending)
                                choose_user_role();
                        })
                        .catch(function (error) {
                            toastr.error(error, 'Error');
                        });
                    }
                },
                'approvalprompt':'force',
            };
            gapi.auth.signIn(params);

        }

      //$rootScope.$on('event:social-sign-in-success', function(event, userDetails){
      //
      //  var access_token  = {accessToken:userDetails.id_token};
      //  AuthService.google_sign_in(access_token)
      //    .then(function(data){
      //      set_cookies(data);
      //      set_user_cookie(data.user);
      //      AuthService.setUserDetails(data.user);
      //      $scope.user_info = data.user;
      //
      //      if ($scope.user_info.userType == 1) {
      //        set_user_role('general_user');
      //        $state.go('app.setting');
      //        toastr.success('You logged in Successfully', 'Success!');
      //      };
      //
      //      if ($scope.user_info.userType == 2 || $scope.user_info.userType == 3) //SERVICE PROVIDER (verified and verfication pending)
      //        choose_user_role();
      //    })
      //    .catch(function (error) {
      //      toastr.error(error, 'Error');
      //    });
      //
      //});


        $scope.submit_login   = login;
        $scope.submit_signup  = signup;
        $scope.reset_password = forgot_password;
        $scope.fb_login       = facebook_login;
        $scope.google_login   = google_login;
        init();
  }
]);
