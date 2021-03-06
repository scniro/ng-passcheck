﻿var app = angular.module('app', ['ngPasscheck']);

app.config(function (passCheckProvider) {
    passCheckProvider.init({
        common: {
            test: true,
            path: '/ng-passcheck/passwords.json'
        }
    });
});

app.controller('ctrl', ['$scope', function ($scope) {

    $scope.tabs = [
        { 'title': 'Markup', 'url': 'demo-site/template/markup.html' },
        { 'title': 'CSS', 'url': 'demo-site/template/css.html' },
        { 'title': 'Controller', 'url': 'demo-site/template/controller.html' },
        { 'title': 'Config', 'url': 'demo-site/template/config.html' }
    ];

    var jsonresult = angular.element(document.getElementById('jsonresult'));

    $scope.$on('myPwd:result', function (event, value) {

        jsonresult.html(JSON.stringify(value).replace(/"/g, "'"));

        Prism.highlightElement(jsonresult[0]);

        $scope.result = value;
    });
}]);

app.directive('tabs', [function () {
    return {
        restrict: 'E',
        templateUrl: 'demo-site/template/tabs.html',
        scope: {
            tabs: '=',
            selected: '@'
        },
        link: function (scope, elem, attrs) {

            if (scope.tabs) {
                scope.currentTab = scope.tabs[scope.selected].url;

                scope.onClickTab = function (tab) {
                    scope.currentTab = tab.url;
                }

                scope.isActiveTab = function (tabUrl) {
                    return tabUrl === scope.currentTab;
                }
            }
        }
    }
}]);

app.directive('prism', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.ready(function () {
                Prism.highlightElement(elem[0]);
            });
        }
    }
}]);