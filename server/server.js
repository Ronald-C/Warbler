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

app.use(express.static(__dirname + "/../client/"));
app.get("/index.html", function(req, res) {
	res.sendFile(path.join(__dirname, "../client/", "index.html"));
});

twitter_factory.init(twitter);
app.get('/services/twitter/', function(req, res) {
	var twt = twitter_factory.create();
	twt.geoFetch(req.query.query, function(data) {
		console.log('[DATA] : ' + JSON.stringify(data));
		io.emit('twitter.stream', data);
	});
});

// Listener
io.on("connection", function(client) {
	console.log("Client connection . . . ");
	
});