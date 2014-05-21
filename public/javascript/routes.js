/*jshint undef:false */

meshleholm.config(function($routeProvider, $locationProvider) {

  $routeProvider

    .when('/', {
      templateUrl: 'partials/home',
      controller: 'HomeCtrl'
    })
    
    .when('/status', {
      templateUrl: 'partials/status',
      controller: 'StatusCtrl'
    })
    
    .when('/join', {
      templateUrl: 'partials/join',
      controller: 'JoinCtrl'
    })
    
    .when('/map', {
      templateUrl: 'partials/map',
      controller: 'MapCtrl'
    })

    .when('/about', {
      templateUrl: 'partials/about',
      controller: 'AboutCtrl'
    })
    
    .when('/terms', {
      templateUrl: 'partials/terms',
      controller: 'TermsCtrl'
    })
    
    .when('/help', {
      templateUrl: 'partials/help',
      controller: 'HelpCtrl'
    })
    
    .otherwise({
      templateUrl: 'partials/error',
      controller: 'ErrorCtrl'
    });

  $locationProvider.html5Mode(true);

});
