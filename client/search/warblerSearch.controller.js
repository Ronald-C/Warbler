function wablerSearch_controller($scope) {
	$scope.inputText = "Type in here";
	$scope.$on('textChange', function(ev, data) {
		$scope.inputText = data;
		$scope.$apply();
	});
}