var init = function() {
	var app = angular.module('warbler', ['ngResource']);

	app
		.service('twitterService', ['$rootScope', twitter_service])
		.service('hashtagifyService', ['$resource', '$rootScope', hashtagify_service]);

	app
		.directive('gmap', [gmap_directive])
		.directive('warblerSearch', ['hashtagifyService', warblerSearch_directive]);

	app
		.controller('gmapController', ['$scope', 'twitterService', gmap_controller])
		.controller('wablerSearchController', ['$scope', 'twitterService', wablerSearch_controller]);

	angular.bootstrap(document, ['warbler']);

	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#sidebar-wrapper").toggleClass("toggled");
		$(this).find('i').toggleClass('fa-bars fa-ellipsis-v')
	});
};