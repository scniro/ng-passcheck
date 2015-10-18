angular.module('ngPasscheck', []).directive('passCheck', function ($compile) {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			password: '=ngModel'
		},
		link: function(scope, elem, attrs) {

			elem.after(angular.element($compile('<span ng-class="{\'weak\' : strength === 0, \'medium\' : strength === 1, \'strong\' : strength === 2}">{{ description }}</span>')(scope)));

			var strong = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{9,})');

			var medium = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

			scope.$watch('password', function(n, o) {
				if (n && n !== o) {
					if (strong.test(scope.password)) {
						scope.strength = 2;
						scope.description = 'strong';
					} else if (medium.test(scope.password)) {
						scope.strength = 1;
						scope.description = 'ehh';
					} else {
						scope.strength = 0;
						scope.description = 'weak sauce';
					}
				} else {
					scope.strength = null;
					scope.description = null;
				}
			});
		}
	}
});