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

	geoFetch: function(queries, callback) {
		var self = this;
		
		self.recurFetch(queries.join(' OR '), function(geos) {
			console.log(geos);
			(callback || noop)(geos);

			setTimeout(function() {
				self.geoFetch(queries, callback);
			}, 5000);	

		});

		return self;
	},

	recurFetch: function(query, callback) {
		var self = this;
		var options = {
			q: decodeURI(query),
			count: 100
		};

		var geos = [];
		self.client.get(
			'search/tweets',
			options,
			function(error, tweets, response) {
				if (error) {
					console.log(error);
					return;
				}
				var statuses = tweets.statuses;
				options.max_id = statuses[statuses.length - 1].id;

				for (var i = 0, l = statuses.length; i < l; i++) {
					var o = statuses[i];
					if (o.geo) {
						var twt = o.geo;
						twt.text = o.text;
						geos.push(twt);
					}
				}

				callback(geos);
			}
		);
	}
}
/****************************** HANDLERS *****************************/
function decBy1(n) {
	// Cast to a string; JS limited by 53bit
	n = n.toString();
	var allButLast = n.substr(0, n.length - 1);
	var lastNum = n.substr(n.length - 1);

	if(lastNum == "0") {
		return decBy1(allButLast) + "9";
	} else {
		var result = allButLast + (parseInt(lastNum, 10) - 1).toString();
		return trimLeft(result, "0");
	}
}

function trimLeft(s, c) {
	var i = 0;
	// Remove leading "0"
	while(i < s.length && s[i] === c) {
		i++;
	}
}