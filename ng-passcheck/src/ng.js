function init() {

    angular.module('ngPasscheck', [])
          .directive('passCheck', ['passCheckService', function (passCheckService) {
              return {
                  restrict: 'A',
                  require: 'ngModel',
                  scope: {
                      password: '=ngModel',
                      passCheck: '@'
                  },
                  link: function (scope, elem, attrs) {
                      scope.$on('passCheckService:init', function () {

                          scope.$watch('password', function (n) {
                              var result = n ? passCheckService.eval(n) : null;
                              scope.$emit(scope.passCheck + ':result', result);
                          });
                      });
                  }
              }
          }])
          .provider('passCheck', [function () {

              var $root;

              return {
                  init: function (options) {
                      passcheck.config.set(options).then(function (response) {
                          $root.$broadcast('passCheckService:init');
                      });
                  },
                  $get: function ($rootScope) {
                      $root = $rootScope;
                  }
              }
          }])
          .factory('passCheckService', ['passCheck', '$http', '$rootScope', '$timeout', function (passCheck, $http, $rootScope, $timeout) {
              return {
                  'eval': function (password) {
                      return passcheck.eval(password);
                  }
              }
          }]);
}

(function () {
    if (typeof define === 'function' && define.amd) { // RequireJS aware
        define(['angular'], function () {
            init();
        });
    } else {
        init();
    }
}());