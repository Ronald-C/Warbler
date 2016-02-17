function gmap_directive() {
	/***** Private properties ******/
	var mapOptions = {
		center: new google.maps.LatLng(0, 0),
		zoom: Math.ceil(Math.log2($(window).width())) - 8,
	};

	var map;
	var twitterMarkers = [];

	function clearMarkers(markerList) {
		angular.forEach(markerList, function(marker, index) {
			marker.setMap(null);
		});
	}

	function markerFactory(title, lat, lng, icon, info) {
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
			content: info
		});

		newMarker.addListener('click', function() {
			infowindow.open(map, newMarker);
		});

		return newMarker;
	}


	/****** directive properties ********/
	return {
		scope: {
			tweets: '=tweets'
		},
		link: function($scope, $element, $attrs) {
			map = new google.maps.Map($element[0], mapOptions);

			$scope.$watch('tweets', function(newData, oldData) {
				if (!oldData) oldData = [];
				if (!newData) newData = [];
				if (newData.length < oldData.length) {
					clearMarkers(twitterMarkers);
				}

				var heatmapData = [];
				for (var i = oldData.length, l = newData.length; i < l; i++) {
					var tweet = newData[i];

					if (!tweet.coordinates) return false;
					var lat = tweet.coordinates[0];
					var lng = tweet.coordinates[1];

					var contentString = tweet.text;
					var icon = 'img/markers/earthquake-3.png';

					var marker = markerFactory('source: Twitter', lat, lng, icon, contentString);

					twitterMarkers.push(marker);

					var latLng = new google.maps.LatLng(lat, lng);
					heatmapData.push(latLng);
				}

				var heatmap = new google.maps.visualization.HeatmapLayer({
					data: heatmapData,
					dissipating: false,
					map: map
				});

				setTimeout(function() {
					$scope.$apply(), 300
				});
			}, true);
		}
	}
}