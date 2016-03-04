'use strict';

var auth = require('../controllers/users/userAuthorizationController'),
	smEnums = require('../../common/enums/socketMessageEnum'),
	ss = require('socket.io-stream'),
	swig = require('swig'),
	_ = require('lodash');

module.exports = function(app){
	app.route('/api/user/:userName').get(function(req, res){
		var user = app.users[ req.params.userName ];
		if(!user){
			res.status(400).send({ 'message': 'user "' + req.params.userName + '" not found' });
		}
		else
			res.jsonp(user.collections);
	});

	app.route('/api/collections').get(function(req, res){
		if(!req.user || !req.user.userName){
			res.status(400).send({ 'message': 'user name not sent to request for collections' });
		}
		
		var peersCollections = {};
		// remove files from app.collections
		for(var collectionName in app.collections){
			var collection = app.collections[collectionName];
			_.each(collection, function(file){
				if(file.userName !== req.user.userName){
					 if(!peersCollections[collectionName]) peersCollections[collectionName] = {}; 
					 peersCollections[collectionName][file.uuid] = file;
				}
			});
		}
		res.jsonp(peersCollections);
	});

	app.route('/').get(function(req, res){
  		res.render('index', {
			user: req.user || null
		});
	});
	
	app.route('/collections/:collectionName').get(auth.requiresLogin, function(req, res){
		var collection = app.collections[ req.params.collectionName ];
		if(!collection){
			res.status(400).send({ 'message': req.params.collectionName + " collection not found" });
			return;
		}

		res.jsonp({
			baseUrl: app.config.baseUrl,
			files: collection
		});
	});

	app.route('/vid/:userName/:movieId').get(auth.requiresLogin, function(req, res){
		// get the users socket based on userId
		var user = app.users[ req.params.userName ];
		if(!user){ 
			res.status(400).send('User ('+ req.params.userName +') not found');
			return;
		} 
		var socket = user.socket;
		var start = 0;
		var end, chunksize;

		if (req.headers['range']) {
			var range = req.headers.range,
			parts = range.replace(/bytes=/, "").split("-"),
			partialstart = parts[0],
			partialend = parts[1];

			start = parseInt(partialstart, 10);
			end = partialend ? parseInt(partialend, 10) : undefined;
		}

		ss(socket).once( smEnums.fileStreamResponse, function(stream, info){
			if(!stream){
				console.log('server.routes.fileStreamResponse was passed an undefined stream');
				return;
			}

			if(req.headers['range']){
				res.writeHead(206, {
					'Content-Range': 'bytes ' + info.start + '-' + info.end + '/' + info.size,
					'Accept-Ranges': 'bytes',
					'Content-Length': info.chunkSize,
					'Content-Type': info.mime
				});
			}
			else
				res.writeHead(200, { 'Content-Length': info.size, 'Content-Type': info.mime });
		
			stream.pipe(res);
		});
	
		socket.emit( smEnums.fileStreamRequest, { 'movieId': req.params.movieId, 'start': start, 'end': end} );
	});
};