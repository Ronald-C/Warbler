function twitter_service($resource, $rootScope) {
	var client = $resource('/services/twitter/');

	var service = {
		data: null,
		search: function(keywords, onSuccess, onFailure) {
			var self = this;
			/*$resource (url, defaultParams, actions, options)*/
			client.query(
				{ query: keywords }
				, function(response) {
					self.data = response;
					$rootScope.$broadcast('twitter.data.updated');
					(onSuccess || angular.noop)(response);
				}
				, function(error) {
					(onFailure || angular.noop)(error);
				});

			return this;
		}
	};

	return service;
}