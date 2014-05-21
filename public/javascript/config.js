/*jshint undef:false */

// i18n
meshleholm.config(['$translateProvider', function($translateProvider) {
  $translateProvider
    .useStaticFilesLoader({
      prefix: '/languages/',
      suffix: '.json'
    })
    .useSanitizeValueStrategy('escaped')
    .fallbackLanguage('enUS')
    .useLocalStorage()
    .preferredLanguage('enUS');
}]);
