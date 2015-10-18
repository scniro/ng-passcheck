var app = angular.module('app', []);

app.controller('ctrl', ['$scope', function($scope) {
	$scope.init = 'hello init';
}]);