function wablerSearch_controller($scope, twitterService) {
	$scope.$on('warblerSearch.searchInput.submit', function(evt, data) {
		$scope.$broadcast("status.waiting");
		twitterService.search(data, function() {
			$scope.$broadcast("status.ready");
		});
	});
}