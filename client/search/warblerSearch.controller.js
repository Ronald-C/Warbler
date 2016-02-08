function wablerSearch_controller($scope, twitterService) {
	$scope.$on('warblerSearch.searchInput.submit', function(evt, data) {
		twitterService.search(data);
	});
}