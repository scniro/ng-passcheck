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
})
.factory('passCheckService', function ($http) {

	var passRegex = {
		'strong': new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{9,})'),
		'medium': new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
	};

	$http.get('/ng-passcheck/src/passwords.json').then(function (response) {
		console.log(response);
	});

	function analyze(password) {
		var result = {};

		if (passRegex.strong.test(password)) {
			result.strength = 2;
			result.description = 'strong';
		} else if (passRegex.medium.test(password)) {
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