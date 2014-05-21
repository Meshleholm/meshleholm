/*jshint undef:false */

var meshleholm = angular.module('meshleholm', ['ngRoute', 'ngCookies', 'pascalprecht.translate']);

meshleholm.factory('MeshleholmService', function($http) {

  return {
    get: function() {
      return $http.get('/api/????');
    },

    create: function(data) {
      return $http.post('/api/????');
    },

    delete: function(id) {
      return $http.delete('/api/????');
    }
  };
});
