// Require Modules
var express = require("express"),
	path = require("path"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io")(server),
	path = require("path"),
	twitter = require("twitter"),
	twitter_factory = require('./twitter_factory.js'); 
	
var port = process.env.PORT || 80,
	ip = process.env.IP || "127.1.1.1" || '54.67.71.163';

server.listen(port, ip);
console.log("HTTP Servicing: " + ip + ':' + port);

app.use(express.static(__dirname + "/../client/"));
app.get("/index.html", function(req, res) {
	res.sendFile(path.join(__dirname, "../client/", "index.html"));
});

// Listener
io.on("connection", function(client) {
	console.log("Client connection . . . ");
	
});

twitter_factory.init(twitter);
app.get('/services/twitter/', function(req, res) {
	var twt = twitter_factory.create();
	twt.geoFetch(req.query.query, function(data) {
		console.log('***data***');
		console.log(data);
		res.send(data);
	});
});