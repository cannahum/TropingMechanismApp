var app = angular.module('TropingMechanism', ['ngAnimate', 'ui.router', 'ui.bootstrap']);

app.config( function($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});

app.constant('ApiEndpoint', {
    url: 'http://localhost:8000'
});

app.config( function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/search");    
    $stateProvider.
	state('main', {
	    url:'',
	    abstract:true,
	    templateUrl: static_url + "angular/html/anchor.html",
	    controller: 'mainController'
	}).
	state('main.search', {
	    url:'/search',
	    views: {
		"menuContent": {
		    templateUrl: static_url + "angular/html/search.html",
		    controller: 'searchController'
		}
	    }
	}).
	state('main.advanced', {
	    url: "/advanced",
	    views: {
		"menuContent": {
		    templateUrl: static_url + "angular/html/advanced.html",
		    controller: 'advancedController'
		}
	    }
	}).
	state('main.results', {
	    url: "/search_results/:param",
	    views: {
		"menuContent": {
		    templateUrl: static_url + "angular/html/results.html",
		    controller: 'resultsController'
		}
	    },
	    resolve: {
		results : function(ApiService, $stateParams, $q) {
		    var d = $q.defer();
		    ApiService.simpleSearch({'simple_search': $stateParams.param})
			.then(function(data) {
			    d.resolve(data);
			}).catch(function(err) {
			    d.reject(error);
			});
		    return d.promise;
		}
	    }
	}).
	state('main.detail', {
	    url: "/detail/:title",
	    views: {
		"menuContent": {
		    templateUrl: static_url + "angular/html/detail.html",
		    controller: "detailController"
		}
	    },
	    resolve: {
		obj : function(DataTransferService){
		    return DataTransferService.retrieve();
		}
	    }
	});
});


app.controller('detailController', function($scope, obj) {
    $scope.obj = obj;
    $scope.oneAtATime = true;
    console.log(obj);

});

app.controller('resultsController', function($scope, $stateParams, $state, DataTransferService, results) {
    $scope.results = results.map(function(r) {
	r.fullText = false;
	return r;
    });

    console.log($scope.results);
    $scope.searchQuery = $stateParams.param;
    $scope.charLimit = 200;
    $scope.readMore = function(i) {
	current = $scope.results[i].fullText;
	$scope.results[i].fullText = !current;
    };

    $scope.tropes = true;
    $scope.media = true;

    $scope.filterBy = function(result) {
	return((result.type === "media" && $scope.media)||
	       (result.type === "trope" && $scope.tropes));
    };

    $scope.goTo = function(title) {
	console.log(title);
	obj = {};
	for (var i = 0; i < $scope.results.length; i++) {
	    if ($scope.results[i].title == title) {
		obj = $scope.results[i];
		break;
	    };
	};
	DataTransferService.cache(obj);
	$state.go('main.detail', {title:obj.title});
    };
});


app.controller('mainController', function($scope) {
    $scope.navCollapsed = true;
});

app.controller('searchController', function($scope, $state, $q, ApiService) {
    $scope.search = "";
    $scope.makeQuery = function(search) {
	console.log('ok making  a query now!');
	$state.go('main.results', {param:search});
    };
    
});


app.controller('carouselController', function($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;

    $scope.addSlide = function() {
	slides.push({
	    title: ['Title 1', 'Title 2', 'Title 3', 'Title 4'][slides.length % 4],
	    text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
	    id: currIndex++
	});
    };

    $scope.randomize = function() {
	var indexes = generateIndexesArray();
	assignNewIndexesToSlides(indexes);
    };

    for (var i = 0; i < 4; i++) {
	$scope.addSlide();
    }
    console.log($scope.slides);

    // Randomize logic below

    function assignNewIndexesToSlides(indexes) {
	for (var i = 0, l = slides.length; i < l; i++) {
	    slides[i].id = indexes.pop();
	}
    }

    function generateIndexesArray() {
	var indexes = [];
	for (var i = 0; i < currIndex; ++i) {
	    indexes[i] = i;
	}
	return shuffle(indexes);
    }

    // http://stackoverflow.com/questions/962802#962890
    function shuffle(array) {
	var tmp, current, top = array.length;

	if (top) {
	    while (--top) {
		current = Math.floor(Math.random() * (top + 1));
		tmp = array[current];
		array[current] = array[top];
		array[top] = tmp;
	    }
	}
	
	return array;
    }
});


app.factory('DataTransferService', function($q) {
    holdingOnto = '';

    setData = function(obj) {
	holdingOnto = obj;
    };

    getData = function() {
	console.log('retrieving');
	console.log(holdingOnto);
	return holdingOnto;
    };

    return {
	cache : setData,
	retrieve : getData
    };
});



app.factory('ApiService', function($http, ApiEndpoint, $q) {
    var simpleSearchUrl = '/simple_search';
    var tropeUrl = '/trope';
    var mediaUrl = '/media';

    return {
	getTrope : function(tropeId) {
	    var d = $q.defer();

	    $http.get(ApiEndpoint.url + tropeUrl, {
		params: {trope_id: tropeId}
	    }).
		success(function(data) {
		    d.resolve(data);
		}).
		error(function(err) {
		    d.reject(err);
		});
	    
	    return d.promise;
	},

	getMedia : function(mediaId) {
	    var d = $q.defer();

	    $http.get(ApiEndpoint.url + mediaUrl, {
		params: {media_id: mediaId}
	    }).
		success(function(data) {
		    d.resolve(data);
		}).
		error(function(err) {
		    d.reject(err);
		});
	    
	    return d.promise;
	},

	simpleSearch : function(queryParams) {
	    var d = $q.defer();
	    
	    $http.get(ApiEndpoint.url + simpleSearchUrl, {
		params:queryParams
	    }).
		success(function(data) {
		    d.resolve(data);
		}).
		error(function(err) {
		    d.reject(err);
		});
	    
	    return d.promise;
	}
    }
});
