var app = angular.module('app', ['ngPasscheck']);

app.config(function (passCheckProvider) {
	passCheckProvider.init({
		testCommon: {
			path: '/ng-passcheck/src/passwords.json',
			limit: 100
		}
	});
});

app.controller('ctrl', ['$scope', function($scope) {
	$scope.init = 'hello init';
}]);