// Require Modules
var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io")(server),
	path = require("path"),
	twitter = require("twitter"),
	twitter_factory = require('./twitter_factory.js'),
	Firebase = require('firebase'); 

var fb = process.env.FIREBASE || '';
if(fb == '') {
	throw "Unknown Firebase instance";
}

var firebase = new Firebase(fb);
var references = {
	'earthquake': 'TweetEarthquake',
	'traffic': 'TweetTraffic',
	'HillaryClinton': 'TweetHillaryClinton',
	'BernieSanders': 'TweetBernieSanders',
	'DonaldTrump': 'TweetDonaldTrump'
}

var hashtags = {
	'BernieSanders': [
		'#bernie', '#FeelTheBern', 'BernieSanders', 'Bernie Sanders', 'Bernie'
	],
        'HillaryClinton': [
		'#HillaryClinton', '#Hillary2016', 'HillaryClinton', 'Hillary'
	],
        'DonaldTrump': [
		'#trump', '#donaldtrump', '#trump2016', '#trumptrain', '#DonaldTrump'
	],
        'earthquake': [
		'#earthquake', '#earthquakes'	
	],
	'traffic': [
		'#accident', '#traffic', 'traffic', 'accident'
	]	
	
	}

var port = process.env.PORT || 8080,
	ip = process.env.IP || '0.0.0.0';

server.listen(port, ip);
console.log("HTTP Servicing: " + (ip || 'localhost') + ':' + port);

// Express deliver client UI
app.use(express.static(__dirname + "/../client/"));
app.get("/index.html", function(req, res) {
	res.sendFile(path.join(__dirname, "../client/", "index.html"));
});

var generator = function(obj) {
    var hashKeys = Object.keys(obj);
    var index = -1;

    return {
       next: function() {
           if (index >= hashKeys.length - 1) {
           		index = 0;
           
           } else {
        		index = index + 1;
           }

           return hashKeys[index];
       }
    }
}
var it = generator(hashtags);

// Create the factor and set to loop
twitter_factory.init(twitter);

var twt = twitter_factory.create();
var getTweets = function(getKey_fun) {
	var query_key = getKey_fun();
	console.log("Querying " + query_key);

	var queryArray = hashtags[query_key];
	twt.geoFetch(queryArray, function(geos) {

		if(references.hasOwnProperty(query_key)) {
			var firebase_ref = references[query_key];
		
		} else {
			console.log("[WARNING] No Firebase reference for " + query_key);
		}

		for(var i = 0; i < geos.length; i++) {
			var single = geos[i];
			
			var ref = new Firebase(firebase_ref + '/' + single.id_str);
			ref.set({
				'GeoLocation': single.coordinates,
				'Message': single.text,
				'Timestamp': single.created_at,
			});
		}

	}, 3)	// Number iterations
}

getTweets(it.next);	// Initial call before setInterval
var loop = setInterval(getTweets, 10000, it.next );	

/*var clients = {};

// Socket connection listener
io.sockets.on('connection', function(socketInst) {
	// Handle socket registration
	if(clients.hasOwnProperty(socketInst.id)) {
		console.log('[SERVER]: ' + socketInst.id + ' exists');
		return;
	} else {
		console.log('[SERVER]: ' + socketInst.id + ' connected');
		clients[socketInst.id] = socketInst;
		socket = clients[socketInst.id];
	}

	// Search handler
	socket.on("twitter.query", function(query) {
		if(socket.hasOwnProperty('twt')) {
			// Clear twitter query if factory exists
			socket.twt.stopStream(true);
		} else {
			var twt = twitter_factory.create();
			socket.twt = twt;
		}

		socket.twt.geoFetch(query, function(data) {
			if(!socket) {
				return;
			}
			if(data.hasOwnProperty('ERROR')) {
				socket.emit('ERROR', data['ERROR']);
				socket.disconnect();
			} else {
				socket.emit('twitter.stream', data);
			} 
		});
	});

	socket.on('twitter.stop', function() {
		console.log("[SERVER]: Clear query");
		socket.disconnect();
	}); 

	// Socket disconnection handler
	socket.on('disconnect', function() {
		console.log('[SERVER] ' + socket.id + ' disconnected');
		socket.twt.stopStream(true);
		delete socket;	
	});
});*/
