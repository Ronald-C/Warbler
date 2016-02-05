// server.js

var express = require("express");
var path = require("path");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

// Router
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, "../client", "index.html"));
});

server.listen(80, "127.1.1.1");

