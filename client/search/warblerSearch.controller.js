function wablerSearch_controller($scope, twitterService) {
	$scope.$on('warblerSearch.searchInput.submit', function(evt, keywords) {
		$scope.$broadcast("status.waiting");
		twitterService.search(keywords, function() {
			$scope.$broadcast("status.ready");
		});
	});

	$scope.$on('warblerSearch.searchLog.clear', function(evt, data) {
		twitterService.stop();
	});
}