function warblerSearch_directive($rootScope) {
	return {
		scope: {
			text: "=place"
		},
		templateUrl: 'search/warblerSearch.template.html',
		link: function($scope, $element, $attrs) {
			$element.find('input').on('keyup', function(e) {
				var value = $(this).val();
				$rootScope.$broadcast('textChange', value);
			});
		}
	}
}