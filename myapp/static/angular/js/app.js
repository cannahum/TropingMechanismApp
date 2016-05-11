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
	}).
	state('main.project', {
	    url: "/tropingmechanism",
	    views: {
		"menuContent": {
		    templateUrl: static_url + "angular/html/project.html",
		    controller: "projectController"
		}
	    }
	}).
	state('main.team', {
	    url: "/team",
	    views: {
		"menuContent": {
		    templateUrl: static_url + "angular/html/team.html",
		    controller: "teamController"
		}
	    }
	}).
	state('main.src', {
	    url: "/src",
	    views: {
		"menuContent": {
		    templateUrl: static_url + "angular/html/src.html",
		    controller: "srcController"
		}
	    }
	});
});


app.controller('projectController', function($scope) {
    console.log('were at project');
});

app.controller('teamController', function($scope) {
    $scope.team = [
	{'name': 'Tiffany Chen',
	 'school': 'Brandeis University',
	 'degree': 'MA in Computer Science',
	 'image': 'https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/10700702_2661642614394_8787558392209421939_o.jpg',
	 'github': 'https://github.com/tiffwchen',
	 'website': 'http://tiffwchen.github.io/'},
	{'name': 'Can "Jon" Nahum',
	 'school': 'Brandeis University',
	 'degree': 'MA in Computer Science',
	 'image': 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/76379_10150324078935440_8297853_n.jpg?oh=485ad35125af92719a6ec1e8b4a5c2bb&oe=579B3E07',
	 'github': 'https://github.com/cannahum',
	 'website': 'N/A'},
	{'name': 'Hannah Provenza',
	 'school': 'Brandeis University',
	 'degree': 'MA in Computational Linguistics',
	 'image': 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/196137_8149470242_2586_n.jpg?oh=3cc9b2974a7731f3d39583d83c99b4d8&oe=57ACF82B',
	 'github': 'https://github.com/hprovenza',
	 'website': 'N/A'},
	{'name': 'Vladimir Susaya',
	 'school': 'Brandeis University',
	 'degree': 'MA in Computer Science',
	 'image': 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/10553331_10204334305337183_4754167646794114836_n.jpg?oh=729f960aebf93b85ccce9023f73eb567&oe=57AAA933',
	 'github': 'https://github.com/vsusaya',
	 'website': 'N/A'}
    ];
	
});

app.controller('srcController', function($scope) {
    console.log('src!');
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
    $scope.displayResults = $scope.results;
    console.log($scope.results);
    $scope.searchQuery = $stateParams.param;
    
    $scope.charLimit = 200;
    $scope.readMore = function(title) {
	console.log(title);
	index = 0;
	for (var i = 0; i < $scope.results.length; i++) {
	    if ($scope.results[i].title == title) {
		current = $scope.results[i].fullText;
		$scope.results[i].fullText = !current;
		break;
	    };
	};
    };

    $scope.tropes = true;
    $scope.media = true;

    function isTrope(r) {
	return r.type == 'trope';
    };

    function isMedia(r) {
	return r.type == 'media';
    };

    $scope.getResultType = function(r) {
	if (r.type == 'trope') {
	    return 'Trope';
	} else {
	    return 'Media' + ' -> ' + r.mediatype;
	};
    };

    $scope.updateList = function() {
	if ($scope.tropes && $scope.media) {
	    $scope.displayResults = $scope.results;
	} else if ($scope.tropes) {
	    $scope.displayResults = $scope.results.filter(isTrope);
	} else if ($scope.media) {
	    $scope.displayResults = $scope.results.filter(isMedia);
	} else {
	    console.log('nothing to show');
	    $scope.displayResults = [];
	};
	$scope.updatePagination();
    };

    $scope.itemsPerPage = 5;
    $scope.totalItems = $scope.displayResults.length;
    $scope.currentPage = 1;

    $scope.updatePagination = function () {
	console.log($scope.currentPage);
	var beginningIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
	$scope.displayResults = $scope.displayResults.slice(beginningIndex, beginningIndex + $scope.itemsPerPage);
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
