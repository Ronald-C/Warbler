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
console.log("HTTP Servicing: " + (ip || 'localhost') + ':' + port);

// Express deliver client UI
app.use(express.static(__dirname + "/../client/"));
app.get("/index.html", function(req, res) {
	res.sendFile(path.join(__dirname, "../client/", "index.html"));
});

twitter_factory.init(twitter);

var clients = {};

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
});