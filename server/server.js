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

var activeSocket = {};
var streamLoop = undefined;

// Socket connection listener
io.sockets.on('connection', function (socket) {
	activeSocket[socket.id] = socket;
	socket.on("twitter.query", function(query) {
		var arr = [];
		var twt = twitter_factory.create();
		twt.geoFetch(query, function(data) {
			arr.push(data);
			if(arr.length == 101) {
				arr.shift();
			}
		});
		streamLoop = setInterval(function() {
			io.emit('twitter.stream', arr);
			console.log(arr.length);
		}, 10000);
	});
	socket.on("ACK", function() {
	});
});
// Socket disconnection handler
io.sockets.on('disconnect', function(socket) {
	clearInterval(streamLoop);
	socket.destroy();
	
	var keys = Object.keys(activeSocket);
	for(var i = 0, l = keys.length; i < l; i++) {
		if(keys[i] == socket.id) {
			delete activeSocket[socket.id];
		}
	}
});