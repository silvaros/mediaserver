'use strict';

var insp = require('util').inspect;

var fileController = require('./filesController'),
	fileUtil = require('../../common/utils/fileUtil'),
	fs = require('fs'),
	smEnum = require('../../common/enums/socketMessageEnum'),
	ss = require('socket.io-stream'),
	_ = require('lodash');

module.exports = function(app){
	function connectionComplete(data){ 
		console.log('Connected to LoanStar server as '+ app.user.userName +' at ' + new Date().toUTCString());
		// set my id
		app.user.socketId = data.id;
		
		// walk the directories listed in our config
		fileController.fetchUserCollections( app.config.collections, function(collectionData){
			app.localCollections = _.clone(collectionData, true);

			function parseCollectionForServer(fileOrDir){
				// all objects need:
				// to have the userId
				fileOrDir.userName = app.user.userName;
				// to remove the path property
				delete fileOrDir.path;
				// to recurse if it is a dir
				if(fileOrDir.isDir) {
					_.each(fileOrDir.children, function(child, key) {
						 parseCollectionForServer(child);
					});
				}
			}
			
			var serverCollections = collectionData;
			// add user id to each file in each collection
			for(var collectionName in serverCollections){
				var collection = serverCollections[collectionName];
				_.each(collection, function(file){ parseCollectionForServer(file) });
			}
			
			// send the main server our list
			app.serverSocket.emit( smEnum.filesRetrieved, {
				userName: app.user.userName, 
				collections: serverCollections
			});	
		});
	}

	function peerDisconnected(data){
		//TODO - remove peer from our users list and tell the browser
		console.log('User ' + data + ' has disconnected');
	}

	function fileStreamRequest(data){
		console.log('fileStreamRequest file data for ' + data.movieId + ' requested'); 
			
		var fileData;

		function findId(fileOrDir, id){
			//  if the passed fileOrDir has the id we are looking for
			if(fileOrDir.uuid == id) return fileOrDir;
			// if the fileOrDir has children to check
			else if(fileOrDir.isDir === true && _.size(fileOrDir.children) > 0) {
				for(var childId in fileOrDir.children){
					var result = findId( fileOrDir.children[ childId ], id );
					if(result) return result;
				}
			}
		}

		// get the movie path
		for(var collectionName in app.localCollections){
			var collection = app.localCollections[collectionName];
			for(var uuid in collection){
				fileData = findId( collection[uuid], data.movieId );
				if (fileData) break;
			}

			// each user's movie id is unique so this check is enough
			if(fileData) break;
		}

		if(!fileData) { 
			console.log('fileStreamRequest file data for ' + data.name + '(' + data.movieId + ') not found in my localCollections'); 
			return;
		}

		var path = fileData.path;
		var stat = fs.statSync( path );

		if(!stat.isFile()){
			console.log('fileStreamRequest,' + data.movieId + ' is not a file'); 
			return false;
		}

		var info = { 
			mime: fileUtil.getExtMime( fileUtil.getExt(path) ), 
			start: data.start || 0,
			end: data.end || stat.size - 1,
			size: stat.size,
			modified: stat.mtime,
			accessed: stat.atime
		}

		info.chunkSize = info.end - info.start + 1;

		try {
			var stream = ss.createStream();	
			ss( app.serverSocket ).emit( smEnum.fileStreamResponse, stream, info );
			fs.createReadStream( path , { flags: "r", start: info.start, end: info.end }).pipe(stream);
		}
		catch(err){
			console.log('error creating read stream, results = ' + insp(err));	
		}
	}

	return {
		"connectionComplete": connectionComplete,
		"fileStreamRequest": fileStreamRequest,
		"peerDisconnected": peerDisconnected
	} 
}