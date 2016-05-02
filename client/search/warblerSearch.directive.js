module.exports = function() {
    var controller = function($scope, $resource) {
        $scope.categories = $resource("search/categories.json").query();
        $scope.toggleTopic = function(topic) {
            topic.selected = !topic.selected;
            console.log(topic);
        }

        console.log("init warblerSearch");
    }

    return {
        templateUrl: 'search/warblerSearch.template.html',
        link: function($scope, $element, $attrs) {

        },

        controller: ['$scope', '$resource', controller]
    }
}
