var init = function() {
	var app = angular.module('warbler', []);

	app
		.directive('gmap', [gmap_directive])
		.directive('warblerSearch', [warblerSearch_directive]);

	app
		.controller('gmapController', ['$scope', gmap_controller])
		.controller('wablerSearchController', ['$scope', wablerSearch_controller]);

	angular.bootstrap(document, ['warbler']);
};