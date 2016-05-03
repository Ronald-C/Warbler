module.exports = function() {
    var controller = function($scope, model) {
        $scope.categories = model.categories;
        $scope.toggleTopic = function(topic) {
            topic.selected = !topic.selected;
            if (!topic.selected) {
                topic.control.hide();              
            } else {
                topic.control.show();
            }
        }

        console.log("init warblerSearch");
    }

    return {
        templateUrl: 'search/warblerSearch.template.html',
        link: function($scope, $element, $attrs) {

        },

        controller: ['$scope', 'warbler_model_service', controller]
    }
}
