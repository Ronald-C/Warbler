function wablerSearch_controller($scope) {
	$scope.$on('warblerSearch.searchInput.submit', function(evt, data) {
		console.log(data);
	});
}