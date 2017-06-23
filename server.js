//server for react-times
var 
  	express,
	http,
	loginErrorMessage,
	session,
  	port,
	server,
	sid,

//link required node.js modules  
express = require("express");	
http = require("http");
session = require("express-session");

port = 7000;
server = express();

server.use(express.static(__dirname + "/"));
server.use(session({
	secret:'topsecret',
	saveUninitialized:true,
	resave:true
}));

http.createServer(server).listen(process.env.PORT || port);
console.log("server is listening on port " + (process.env.PORT || port));