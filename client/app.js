var init = function() {
	var app = angular.module('warbler', ['ngResource']);

	app
		.directive('gmap', [gmap_directive])
		.directive('warblerSearch', [warblerSearch_directive]);

	app
		.service('twitterService', 
			['$resource', '$rootScope', twitter_service]);

	app
		.controller('gmapController', 
			['$scope', 'twitterService', gmap_controller])
		.controller('wablerSearchController', 
			['$scope', 'twitterService', wablerSearch_controller]);


	angular.bootstrap(document, ['warbler']);
};