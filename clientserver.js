'use strict';
	
var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.Server(app),	
	io = require('socket.io')(server),
	path = require('path'),
	ioClient = require('socket.io-client');

	// no return 
	require('./common/init');

var config = require('./clientserver/config/base'),
	fileController = require('./clientserver/controllers/filesController'),
	userController = require('./clientserver/controllers/userController'),
	smEnum = require('./common/enums/socketMessageEnum'),
	_ = require('lodash');
	
function init(user){
	app.config = config;
	app.user = user;
	app.localCollections = {};

	app.set('port', process.env.PORT);
	server.listen(app.get('port'), function() {});

	// expose app
	exports = module.exports = app;

	var socketController = require('./clientserver/controllers/socketController')(app);

	//socket to main server	
	app.serverSocket = ioClient("http://" + config.serverInfo.hostName + ":" + config.serverInfo.hostPort);
	// when the server sends connection complete, fetch our file list
	app.serverSocket.on( smEnum.connectionComplete, socketController.connectionComplete);		
	app.serverSocket.on( smEnum.peerDisconnected, socketController.peerDisconnected);
	app.serverSocket.on( smEnum.fileStreamRequest, socketController.fileStreamRequest);
}

userController.logIn(config, init);
