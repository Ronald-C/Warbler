// server.js

var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

// Router
app.get('/', function(req, res) {
	res.sendFile(__dirname + "client/");
});

server.listen(80, "127.1.1.1");

