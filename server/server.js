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
		socket = clients[socket.id]; 
	}

	// Search handler
	socket.on("twitter.query", function(query) {
		if(socket.hasOwnProperty(twt)) {
			// Clear twitter query if factory exists
			socket.twt.stream = false;
		} else {
			var twt = twitter_factory.create();
			socket.twt = twt;
		}

		socket.twt.geoFetch(query, function(data) {
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
		socket.twt.stopStream(true);
		socket.twt.resetStream(true);
	}); 

	// Socket disconnection handler
	socket.on('disconnect', function() {
		console.log('[SERVER] ' + socket.id + ' disconnected');
		socket.twt.stopStream(true);
		delete(clients[socket.id]);	
	});
});