function gmap_directive() {
	return {
		link: function($scope, $element, $attrs) {
			var map = new google.maps.Map($element[0], {
			    center: {lat: 37.3360008, lng: -121.8847221},
			    zoom: 8
			});
		}
	}
}