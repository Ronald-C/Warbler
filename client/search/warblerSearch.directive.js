function warblerSearch_directive() {
	return {
		templateUrl: 'search/warblerSearch.template.html',
		link: function($scope, $element, $attrs) {
			$element.find('form').on('submit', function(e) {
				$scope.$emit('warblerSearch.searchInput.submit', $scope.searchInput);
			});
		}
	}
}