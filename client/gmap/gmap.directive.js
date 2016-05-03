module.exports = function(model) {
    var gmap_controller = require('./gmap.controller');

    /***** Private properties ******/
    var mapOptions = {};

    /**
      var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      dissipating: false,
      map: map
      });
     **/


    /****** directive properties ********/
    return {
        scope: {
        },
            link: function($scope, $element, $attrs) {
                $scope.map = new google.maps.Map($element[0], mapOptions);

                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({'address': 'US'}, function (results, status) {
                    var ne = results[0].geometry.viewport.getNorthEast();
                    var sw = results[0].geometry.viewport.getSouthWest();

                    $scope.map.fitBounds(results[0].geometry.viewport);               
                }); 


            },

            controller: ['$scope', 'warbler_model_service', gmap_controller]
    }
}
