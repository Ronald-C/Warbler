var init = function() {
	var app = angular.module('warbler', []);

	app
		.directive('gmap', [gmap_directive]);

	app
		.controller('gmapController', ['$scope', gmap_controller]);

	angular.bootstrap(document, ['warbler']);
};