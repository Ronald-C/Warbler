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
	this.options = {
		q: null,
		count: 100
	};
	this.stream = false;
}

twitter_service.prototype = {
	constructor: twitter_service,
	
	geoFetch: function(queries, callback) {
		var self = this;
		
		var query = queries.join(' OR ');
		self.options.q = query;

		var loop = undefined;
		self.recurFetch(function(geos) {
			(callback || noop)(geos);

			self.stream = true;
			var loop = setTimeout(function() {
				if(self.stream) {
					self.geoFetch(queries, callback);
				} else {
					clearTimeout(loop);
				}
			}, 5000);	

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
					console.log(error);
					return {"ERROR": error};
				}
				var statuses = tweets.statuses;
				
				var max_id = statuses[statuses.length - 1].id;
				if(!self.options.max_id || self.options.max_id != max_id) {
					self.options.max_id = decBy1(max_id);
				}
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
	},

	stopStream: function(state) {
		var self = this;
		if(state) {
			self.stream = false;
		}
	},

	resetStream: function(state) {
		var self = this;
		if(state) {
			delete self.options.max_id;
		}
	}
}
/*************************** HELPER FUNCTIONS **************************/
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
	return s.substring(i);
}