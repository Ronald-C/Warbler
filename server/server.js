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
io.sockets.on('connection', function (socket) {
	// Handle socket registration
	if(clients.hasOwnProperty(socket.id)) {
		console.log('[SERVER]: ' + socket.id + ' exists');
		return;
	} else {
		console.log('[SERVER]: ' + socket.id + ' connected');
		clients[socket.id] = socket;
	}

	// Client queries
	socket.on("twitter.query", function(query) {
		var twt = twitter_factory.create();
		clients[socket.id].twt = twt;

		clients[socket.id].twt.geoFetch(query, function(data) {
			console.log(data);
			io.emit('twitter.stream', data);
		});
	});

	// Socket disconnection handler
	socket.on('disconnect', function() {
		console.log('[SERVER] ' + socket.id + ' disconnected');
		delete(clients[socket.id]);
	
		console.log(clients);
	});
});