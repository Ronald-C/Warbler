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

// Socket listener
io.sockets.on('connection', function (socket) {
	socket.on("twitter.query", function(query) {
		var arr = [];
		var twt = twitter_factory.create();
		twt.geoFetch(query, function(data) {
			arr.push(data);
			if(arr.length == 100) {
				arr.shift();
			}
			setInterval(function() {
				io.emit('twitter.stream', arr);
			}, 10000)
		});
	});
});