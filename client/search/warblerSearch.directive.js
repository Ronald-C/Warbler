function warblerSearch_directive() {
	return {
		templateUrl: 'search/warblerSearch.template.html',
		link: function($scope, $element, $attrs) {
			$element.find('.btnSearch').on('click', function() {
				$element.find('form').submit();
			});

			$element.find('form').on('submit', function(e) {
				$scope.$emit('warblerSearch.searchInput.submit', $scope.searchInput);
			});
		}
	}
}