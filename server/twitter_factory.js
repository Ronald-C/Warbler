module.exports = {
	init: function(twitter_module) {
		twitter = twitter_module;
	},
	create: function() {
		var self = this;
		if (!twitter) {
			console.log("Must import twitter module and pass it into init function of twitter_factory.");
			return false;
		}		

		return new twitter_service();
	}
}
/***************************** PRIVATE ******************************/
var twitter = null;

var secrets = {
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

var noop = function() {
	return;
}

/****************************** PROTOTYPE *****************************/
/**********RETURN AN INSTANCE OF THIS PROTOTYPE ON .create() **********/
function twitter_service() {
	this.client = new twitter(secrets);
}

twitter_service.prototype = {
	constructor: twitter_service,

	geoFetch: function(query, callback) {
		var self = this;
		self.client.get(
			'search/tweets', 
			{
				q: decodeURI(query),
				count: 100
			},

			function(error, tweets, response) {
			if (error) {
				console.log(error);
				return;
			}

			var statuses = tweets.statuses;
			var geos = [];
			for (var i = 0, l = statuses.length; i < l; i++) {
				var o = statuses[i];
				if (o.geo) {
					var twt = o.geo;
					twt.text = o.text;
					geos.push(twt);
				}
			}

			(callback || noop)(geos);
		});

		return self;
	}
}