function twitter_service($resource, $rootScope) {
	var successCallback = null;
	var failureCallback = null;

	var socket = null;

	var service = {
		data: null,
		stop: function() {
			var self = this;
			if (!socket) return false;

			socket.emit('twitter.stop');
			self.data = [];
			setTimeout(function() {
				$rootScope.$broadcast('twitter.data.updated');
			},300);
		},

		search: function(keywords, onSuccess, onFailure) {
			var self = this;

			successCallback = onSuccess;
			failureCallback = onFailure;

			self.data = [];

			if (!socket) {
				socket = io('http://warbler:80/');

				socket
					.on('connect_error', function() {
						socket.disconnect();
						socket = null;

						var err = 'Connection Error: Network or host is not available.';
						console.log(err);
						alert(err);
					})
					.on('ERROR', function(errors) {
						if (angular.isArray(errors)) {
							alert(errors[0].message);
						} else {
							alert(errors);
						}

						socket.disconnect();
						socket = null;
					})
					.on('twitter.stream', function(response) {
						if (angular.isArray(response)) {
							angular.forEach(response, function(item, index) {
								this.push(item);
							}, self.data);
						}
						$rootScope.$broadcast('twitter.data.updated');

						(successCallback || angular.noop)(response);
					})
					.on('disconnect', function() {
						socket.disconnect();
						socket = null;
						console.log("Twitter Service has been disconnected.");
					});
			}

			/*socket.on('connect', function() {
				socket.emit('twitter.query', keywords);
			});*/
			socket.emit('twitter.query', keywords);

			return this;
		}
	};

	return service;
}