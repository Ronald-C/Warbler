function gmap_controller($scope, twitterService) {
	$scope.tweets = twitterService.data;

	$scope.$on('twitter.data.updated', function() {
		$scope.tweets = twitterService.data;
		$scope.$apply();

		$scope.$broadcast("hey");
	});
}