var express = require("express");
var path = require("path");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var twtLoc = require('./twitter.js').twitter(); 

server.listen(80, "127.1.1.1");
app.get('/', function(req, res) {
	twtLoc.twtFetchLocations(req.query, function(data) {
		console.log(data);
	});
});