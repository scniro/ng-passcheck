var app = angular.module('app', ['ngPasscheck']);

app.config(function (passCheckProvider) {
	passCheckProvider.init({
		testCommon: {
			path: '/ng-passcheck/dist/passwords-hashed.json',
			limit: 10000
		}
	});
});

app.controller('ctrl', ['$scope', function($scope) {
	$scope.$on('myPwd:result', function (event, value) {

		$scope.result = value ? value : null;
	});
}]);