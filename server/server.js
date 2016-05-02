// Require Modules
var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io")(server),
	path = require("path"),
	twitter = require("twitter"),
	twitter_factory = require('./twitter_factory.js'),
	Firebase = require('firebase'); 

var firebase = new Firebase('http://blistering-inferno-5589.firebaseIO.com');
var references = {
	'earthquake': firebase.child('TweetEarthquake'),
	'traffic': firebase.child('TweetTraffic'),
	'HillaryClinton': firebase.child('TweetHillaryClinton'),
	'BernieSanders': firebase.child('TweetBernieSanders'),
	'DonaldTrump': firebase.child('TweetBernieSanders')
}

var hashtags = {
	'earthquake': [
		'#earthquake', '#earthquakes'	
	],
	'traffic': [
		'#accident', '#traffic'
	],
}

var port = process.env.PORT || 80,
	ip = process.env.IP;

server.listen(port, ip);
console.log("HTTP Servicing: " + (ip || 'localhost') + ':' + port);

// Express deliver client UI
app.use(express.static(__dirname + "/../client/"));
app.get("/index.html", function(req, res) {
	res.sendFile(path.join(__dirname, "../client/", "index.html"));
});

var generator = function(obj) {
    var hashKeys = Object.keys(obj);
    var index = 0;

    return {
       next: function() {
           if (index > hashKeys.length - 1) {
           		index = 0;
           }

           return hashKeys[index];
       }
    }
}
var it = generator(hashtags);

// Create the factor and set to loop
twitter_factory.init(twitter);
	
var twt = twitter_factory.create();

var loop = setInterval(function(query_key) {
	var queryArray = hashtags[query_key];

	twt.geoFetch(queryArray, function(geos) {

		if(references.hasOwnProperty(query_key)) {
			var firebase_ref = references[query_key];
		
		} else {
			console.log("[WARNING] No Firebase reference for " + query_key);
		}

		for(var i = 0; i < geos.length; i++) {
			var single = geos[i];

			firebase_ref.push({
				'GeoLocation': single.geo,
				'Message': single.text,
				'Timestamp': single.created_at,
				'TweetId': single.id_str
			});
		}

	}, 10)	// Number iterations

}, 60000, it.next() )	

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