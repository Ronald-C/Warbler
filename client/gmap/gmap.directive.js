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

	/****** directive properties ********/
	return {
		scope: {
			tweets: '=tweets'
		},
		link: function($scope, $element, $attrs) {
			map = new google.maps.Map($element[0], mapOptions);
			
			$scope.$watch('tweets', function(newData, oldData) {
				clearMarkers(twitterMarkers);
				angular.forEach(newData, function(tweet, index) {
					if (!tweet.coordinates) return false;
					var lat = tweet.coordinates[0];
					var lng = tweet.coordinates[1];

					var contentString = tweet.text;
					var infowindow = new google.maps.InfoWindow({
						content: contentString
					});

					var marker = new google.maps.Marker({
						map: map,
						draggable: false,
						title: 'source: Twitter',

						animation: google.maps.Animation.DROP,
						position: {
							lat: lat,
							lng: lng
						},
						icon: 'img/markers/earthquake-3.png'
					});

					marker.addListener('click', function() {
						infowindow.open(map, marker);
					});

					twitterMarkers.push(marker);
				})
			});
		}
	}
}