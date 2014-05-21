/* jshint undef:false */

meshleholm.directive('meshleholmCarousel', function () {
  return function (scope, elem, attrs) {
    scope.carouselPrev = function () {
      $('#' + attrs.id).carousel('prev');
    };

    scope.carouselNext = function () {
      $('#' + attrs.id).carousel('next');
    };
  };
});
