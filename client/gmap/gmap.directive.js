function gmap_directive() {
	return {
		link: function($scope, $element, $attrs) {
			var map = new google.maps.Map($element[0], {
			    center: {lat: -34.397, lng: 150.644},
			    zoom: 8
			});
		}
	}
}