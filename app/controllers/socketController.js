'use strict';

var insp = require('util').inspect;

var smEnum = require('../../common/enums/socketMessageEnum');
var _ = require('lodash');

module.exports = function(app) {
	var users = app.users;
	var collections = app.collections;
	
	function onFilesRetrieved(data){
		console.log(data.userName + ' @ ' + this.handshake.address + ' sent a file list');
		users[data.userName] = { 'socket': this, 'collections': data.collections };
		collections = _.merge(collections, data.collections);
	}

	function onPeerDisconnect(socketId){
		//get find user by socket id
		var foundUser;
		for(var userName in app.users){
			var user = app.users[userName];
			if(user.socket.id === socketId){
				foundUser = user;
				foundUser.userName = userName;
				break;
			}
		};
		
		if(!foundUser) {
			console.log('Socket ' + socketId + ' (without user) disconnected at ' + new Date().toUTCString());
		}
		else {
			// not sure why we are getting several connections per clientserver
			// but only valid ones are put in the user list
			var userName = foundUser.userName;
			if(users[userName] != undefined){
				// remove files from app.collections
				for(var collectionName in collections){
					_.each( collections[collectionName], function(file){
						if(file.userName === userName){
							delete collections[collectionName][file.uuid];
						}
					});
				}

				emitToClients( smEnum.peerDisconnected, userName );

				console.log(userName + ' @ ' + user.socket.handshake.address + ' disconnected');
		
				delete users[userName];
			}
		}
	}

	function emitToClients(channel, data, clientsToExclude){
		var clients = app.io.sockets.connected;
		for(var id in clients){
			if( clientsToExclude && clientsToExclude.indexOf(id) === -1){
				clients[id].emit(channel, data);
			}
		}
	}

	function onClientConnection(socket) {
		console.log('User @ ' + socket.handshake.address + ' connected at ' + new Date().toUTCString());

		socket.on( smEnum.filesRetrieved, onFilesRetrieved.bind(socket) );
		socket.on( smEnum.disconnect, onPeerDisconnect.bind(this, socket.id) );
		
		socket.emit( smEnum.connectionComplete, {id: socket.id} );
	}
	
	return  { 
		'onClientConnection': onClientConnection
	}
}