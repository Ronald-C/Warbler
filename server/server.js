// Require Modules
var express = require("express");
var path = require("path");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

// Router
app.use(express.static(__dirname + "/../client/"));
server.listen(80, "127.1.1.1");

