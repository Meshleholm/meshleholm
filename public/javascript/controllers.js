/*jshint undef:false */

meshleholm.controller('MainCtrl', function($scope) {
});

meshleholm.controller('HomeCtrl', function($scope) {
  $scope.banners = [{
    image: '/images/hassleholmfront.jpg',
    header: 'Meshlocal in Hässleholm, Sweden',
    text: 'Meshleholm is a meshnet being built for Hässleholm\'s School of Technology (HTS)'
  }];
});

meshleholm.controller('AboutCtrl', function($scope) {
});

meshleholm.controller('JoinCtrl', function($scope, $http) {
  $scope.formData = {};

  $scope.joinUs = function () {
    console.log($scope.formData);
    $http.post('/api/join', $scope.formData).
    success(function(data) {
      if (data === 'Sent') {
        $scope.success = true;
      } else {
        $scope.error = data;
      }
      console.log('Response: ' + data);
    }).
    error(function(error) {
      $scope.error = true;
      $scope.error.message = error;
      console.log('Error: ' + error);
    });
  };
});

meshleholm.controller('StatusCtrl', function($scope, $http) {

  $http.get('/api/nodestatus.json').success(function(data) {
    $scope.nodestatus = data;
    console.log(data);
    $scope.nodestatus.busy = false;
  });

  $scope.predicate = 'delay';

});

meshleholm.controller('MapCtrl', function($scope) {

  $(document).ready(function () {
   
    function setMapSize () {

      var WIDTH = $(window).width()
      ,   HEIGHT = $(window).height();
      
      if (WIDTH > 768) {
        HEIGHT = HEIGHT - 50 + 'px';
      } else {
        HEIGHT = HEIGHT - 60 + 'px';
      }
      
      WIDTH = WIDTH + 'px';
      $('#fullscreen').css({ width: WIDTH, height: HEIGHT });
    
    }


    window.addEventListener('resize', function() {
      setMapSize();
    });

    setMapSize();

  });
});

meshleholm.controller('HelpCtrl', function($scope) {
});

meshleholm.controller('TermsCtrl', function($scope) {
});

meshleholm.controller('ErrorCtrl', function($scope, $location) {
  $scope.location = $location.path();
});
