angular.module('ngPasscheck', []).directive('passCheck', function ($compile, passCheckService) {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			password: '=ngModel'
		},
		link: function (scope, elem, attrs) {

			elem.after(angular.element($compile('<span ng-class="{\'weak\' : result.strength === 0, \'medium\' : result.strength === 1, \'strong\' : result.strength === 2}">{{ result.description }}</span>')(scope)));

			scope.$watch('password', function (n, o) {
				scope.result = n ? passCheckService.analyze(n) : null;
			});
		}
	}
}).provider('passCheck', function () {
	return {
		init: function (options) {

			this.regex = {
				'strong': options.regex ? options.regex.strong : new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{9,})'),
				'medium': options.regex ? options.regex.medium : new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
			}

			this.testCommon = options.testCommon ? { 'path': options.testCommon.path, 'limit': options.testCommon.limit } : false;
		},
		$get: function () {
			return {
				regex: this.regex,
				testCommon: this.testCommon
			}
		}
	}
})
.factory('passCheckService', function (passCheck, $http) {

	if (passCheck.testCommon) {
		$http.get(passCheck.testCommon.path).then(function (response) {
			console.log(response);
		});
	}

	function analyze(password) {
		var result = {};

		if (passCheck.regex.strong.test(password)) {
			result.strength = 2;
			result.description = 'strong';
		} else if (passCheck.regex.medium.test(password)) {
			result.strength = 1;
			result.description = 'ehh';
		} else {
			result.strength = 0;
			result.description = 'weak sauce';
		}

		return result;
	}

	return {
		'analyze': analyze
	}
})