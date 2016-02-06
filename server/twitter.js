module.exports = {
	twitter: function() {
		return {
			twtFetchLocations: function(query, callback) {
				var twitter = require('twitter');

				var secrets = {
					consumer_key: process.env.TWITTER_CONSUMER_KEY,
					consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
					access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
					access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
				}

				var client = new twitter(secrets);
				var noop = function() {
					return;
				}

				client.get('search/tweets', { q: query }, function(error, tweets, response) {
					if (error) {
						console.log(error);
						return;
					}

					var statuses = tweets.statuses;
					var geos = [];
					for (var i = 0, l = statuses.length, o = statuses[i]; i < l; i++) {
						if (o.geo) {
							geos.push(o.geo);
						}
					}

					(callback || noop)(geos);
				});
			}
		}
	}
}

