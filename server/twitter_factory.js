module.exports = {
	init: function(twitter_module) {
		twitter = twitter_module;
	},
	create: function() {
		var self = this;
		if (!twitter) {
			console.log("[WARNING] Must import twitter module and pass it into init function of twitter_factory.");
			return false;
		}		

		return new twitter_service();
	}
}
/***************************** PRIVATE ******************************/
var fs = require('fs'),
	path = require("path");
var contents = fs.readFileSync(path.join(__dirname, '../security/config.json'));
var jsonContents = JSON.parse(contents);

var twitter = null;

var secrets = {
	consumer_key: (jsonContents.TWITTER_CONSUMER_KEY != '') 
		? jsonContents.TWITTER_CONSUMER_KEY : process.env.TWITTER_CONSUMER_KEY,

	consumer_secret: (jsonContents.TWITTER_CONSUMER_SECRET != '') 
		? jsonContents.TWITTER_CONSUMER_SECRET : process.env.TWITTER_CONSUMER_SECRET,

	access_token_key: (jsonContents.TWITTER_ACCESS_TOKEN_KEY != '') ? 
		jsonContents.TWITTER_ACCESS_TOKEN_KEY : process.env.TWITTER_ACCESS_TOKEN_KEY,

	access_token_secret: (jsonContents.TWITTER_ACCESS_TOKEN_SECRET != '') 
		? jsonContents.TWITTER_ACCESS_TOKEN_SECRET : process.env.TWITTER_ACCESS_TOKEN_SECRET
};

var noop = function() {
	return;
}

/****************************** PROTOTYPE *****************************/
/**********RETURN AN INSTANCE OF THIS PROTOTYPE ON .create() **********/
function twitter_service() {
	this.client = new twitter(secrets);
	this.options = {
		'q': null,
		'count': 100
	};
	this.iterations = 1;
}

twitter_service.prototype = {
	constructor: twitter_service,
	
	geoFetch: function(queries, callback, iterations) {
		var self = this;
		self.iterations = iterations;

		var query = queries.join(' OR ');
		self.options.q = query;

		var loop = undefined;

		self.recurFetch(function(geos) {
			self.iterations = self.iterations - 1; 
			
			(callback || noop)(geos);

			if(self.iterations > 0) {
				var loop = setTimeout(function() {				

					if(self.iterations > 0 ) {
						self.geoFetch(queries, callback, self.iterations);
				
					} else {
						clearTimeout(loop);
					}

				}, 5000);	// Every 5 seconds
			}

		});

		return self;
	},

	recurFetch: function(callback) {
		var self = this;

		var geos = [];

		self.client.get(
			'search/tweets',
			self.options,

			function(error, tweets, response) {
				if (error) {
					console.log(error)
					return {"ERROR": error};
				}

				var statuses = tweets.statuses;
				if(statuses.length > 0) {
					var since_id = statuses[statuses.length - 1].id;

					self.options.since_id = since_id;

					for (var i = 0, l = statuses.length; i < l; i++) {
						var o = statuses[i];
						if (o.geo || o.coordinates) {
							var twt = o.geo;

							twt.text = o.text;
							twt.id_str = o.id_str;
							twt.created_at = o.created_at;

							geos.push(twt);
						}
					}
					
				}
				
				callback(geos);
			}
		);
	}

	
}
/*************************** HELPER FUNCTIONS **************************/
/*function decBy1(n) {
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
	return s.substring(i);
}*/
