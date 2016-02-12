// Require Modules
var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io")(server),
	path = require("path"),
	twitter = require("twitter"),
	twitter_factory = require('./twitter_factory.js'); 
	
var port = process.env.PORT || 80,
	ip = process.env.IP;

server.listen(port, ip);
console.log("HTTP Servicing: " + ip + ':' + port);

// Express deliver client UI
app.use(express.static(__dirname + "/../client/"));
app.get("/index.html", function(req, res) {
	res.sendFile(path.join(__dirname, "../client/", "index.html"));
});

twitter_factory.init(twitter);

var clients = {};

// Socket connection listener
io.sockets.on('connection', function(socket) {
	// Handle socket registration
	if(clients.hasOwnProperty(socket.id)) {
		console.log('[SERVER]: ' + socket.id + ' exists');
		return;
	} else {
		console.log('[SERVER]: ' + socket.id + ' connected');
		clients[socket.id] = socket;
		soc = clients[socket.id];
	}

	// Search handler
	soc.on("twitter.query", function(query) {
		if(soc.hasOwnProperty('twt')) {
			// Clear twitter query if factory exists
			soc.twt.stopStream(true);
		} else {
			var twt = twitter_factory.create();
			soc.twt = twt;
		}

		soc.twt.geoFetch(query, function(data) {
			if(data.hasOwnProperty('ERROR')) {
				soc.emit('ERROR', data['ERROR']);
				soc.disconnect();
			} else {
				soc.emit('twitter.stream', data);
			} 
		});
	});

	soc.on('twitter.stop', function() {
		console.log("[SERVER]: Clear query");
		soc.disconnect();
	}); 

	// Socket disconnection handler
	soc.on('disconnect', function() {
		console.log('[SERVER] ' + socket.id + ' disconnected');
		soc.twt.stopStream(true);
		delete soc;	
	});
});