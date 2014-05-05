'use strict';

angular
  .module('eversnapApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'facebook',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).config(['FacebookProvider', function(FacebookProvider) {
     FacebookProvider.init('303153796508094');
}]);