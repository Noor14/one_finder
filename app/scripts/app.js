
/**
 * @ngdoc overview
 * @name onefindrApp
 * @description
 * # onefindrApp
 *
 * Main module of the application.
 */
var app = angular
  .module('onefindrApp', [
    // 'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'toastr',
    'naif.base64',
    'ngDialog',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'socialLogin',
    'angular-input-stars',
    'ngMap',
    'nemLogging',
    'uiGmapgoogle-maps',
    'ngActionCable'
  ]);

window.fbAsyncInit = function () {
  FB.init({
    appId: '1672173103072869',
    xfbml: true,
    version: 'v2.8'
  });
  FB.AppEvents.logPageView();
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// (function(){
//   var p = document.createElement('script');
//   p.type = 'text/javascript';
//   p.asynce = true;
//   p.src  = 'http://apis.google.com/js/client.js?onload=onLoadGoogle';
//   var s = document.getElementsByTagName('script')[0];
//   s.parentNode.insertBefore(p,s);
// })();

// function onLoadGoogle(){
//   gapi.client.setApiKey('AIzaSyAE-qjawctgMAmc2i2-UsljSsVGAMU870I');
// }
