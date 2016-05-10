var app = angular.module('TropingMechanism', ['ui.router', 'ui.bootstrap']);

app.config( function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});


app.config( function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");    
    $stateProvider
	.state('main', {
	    url:'/',
	    templateUrl: static_url + "angular/html/anchor.html",
	    controller: 'mainController'
	})
	.state('state1', {
	    url: "/state1",
	    templateUrl: static_url + "angular/html/template1.html",
	    controller: 'controller1'
	});
});

app.controller('mainController', function($scope) {
    $scope.navCollapsed = true;
});

app.controller('controller1', function($scope) {
    $scope.description = "Hey there, what are we doing here?";
});

app.controller('DropdownCtrl', function($scope) {
 
    $scope.items = [
        "The first choice!",
        "And another choice for you.",
        "but wait! A third!"
    ];

    $scope.toggleDropdown = function($event) {
	console.log('hey');
    };
});
