module.exports = function($scope, model) {
    $scope.map = null;
    $scope.markers = {};
    
    function clearMarkers(markerList) {
        angular.forEach(markerList, function(marker, index) {
            marker.setMap(null);
        });
    }

    function markerFactory(map, title, lat, lng, icon, info) {
        var newMarker = new google.maps.Marker({
            map: map,
            draggable: false,
            title: 'source: Twitter',

            animation: google.maps.Animation.DROP,
            position: {
                lat: lat,
            lng: lng
            },
            icon: icon
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<span style="color: #000;">' + info + '</span>'
        });

        newMarker.addListener('click', function() {
            infowindow.open(map, newMarker);
        });
        
        return newMarker;
    }

    function showMarkers(markerRepo, data, icon, isVisible) {
        var heatmapData = [];
        angular.forEach(data, function(tweet, tweetId) {
            if (!tweet.GeoLocation) return false;
            var lat = tweet.GeoLocation[0];
            var lng = tweet.GeoLocation[1];

            var contentString = tweet.Message + "<br /><br />" + tweet.Timestamp;

            var marker = markerFactory($scope.map, 'source: Twitter', lat, lng, icon, contentString);
            marker.setVisible(isVisible);
            markerRepo.push(marker);

            var latLng = new google.maps.LatLng(lat, lng);
            heatmapData.push(latLng);
        });
    }

    var setControl = function(topics) {
        angular.forEach(topics, function(topic, index) {
            $scope.markers[topic.topic] = [];
            topic.control = {
                hide: function() {
                    angular.forEach($scope.markers[topic.topic], function(marker, index) {
                        marker.setVisible(false);
                    });
                },
                show: function() {
                    angular.forEach($scope.markers[topic.topic], function(marker, index) {
                        marker.setVisible(true);
                    });
                }
            }
        });
    }

    var setEventHandler = function(topics) {
        angular.forEach(topics, function(topic, index) {
            $scope.$on('model.' + topic.topic + '.updated', function() {
                clearMarkers($scope.markers[topic.topic]);
                showMarkers($scope.markers[topic.topic], model[topic.topic], topic['marker-icon'], topic.selected);
            });

            $scope.$on('model.' + topic.topic + '.added', function(evt, newItems) {
                showMarkers($scope.markers[topic.topic], newItems, topic['marker-icon'], topic.selected);
            });
        });
    }
    
    model.categories.$promise
        .then(
                function(response) {
                    // initialize markers arrays
                    angular.forEach(model.categories, function(cat, index) {
                        setControl(cat.topics);
                        setEventHandler(cat.topics);
                    });   
                },
                function(failure) {
                    $scope.error = failure.data.message || failure.data.error
                                    || failure.message || failure.error || failure; 
                }
             );
}
