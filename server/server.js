// Require Modules
var express = require("express"),
	path = require("path"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io")(server),
	path = require("path"),
	Twitter = require("twitter");
	
var port = process.env.PORT || 80,
	ip = process.env.IP || "127.1.1.1";

server.listen(port, ip);
console.log("HTTP Servicing: " + ip + ':' + port);

var twit = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Router
app.use(express.static(__dirname + "/../client/"));
app.get("/index.html", function(req, res) {
	res.sendFile(path.join(__dirname, "../client/", "index.html"));
});

// Listener
io.on("connection", function(client) {
	console.log("Client connection . . . ");
	
});

