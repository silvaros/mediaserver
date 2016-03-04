'use strict';
var insp = require('util').inspect;

var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),
	uuid = require('uuid');

var acceptableExtenisons = ['mp4', 'm4v'];


/*	@desc  walk a path and build out the list of files/directories
		files and dirs both get uuids

	@param dir {string} - the path to walk on this computer
	@param done {function} - the callback for when everything is done

	@return example - 
	{
		movieOrDirId001 : {
			name: "",
			uuid: "",
			path: ""

			if dir - 
			isDir: bool,
			chlidren: {
				movieOrDirId002:{...},
				movieOrDirId003:{...},
				...
			}
		}
	}
*/
function walk(dir, done){
	var results = {};
	//	console.log('walking ' + dir);
	fs.readdir(dir, function(err, list){
		if(err){
			console.log('walk.readdir errored, err = ' + insp(err));
			return done(err);		
		}
		// how many files in this dir?
		var pending = list.length;
		// if none
		if(!pending) return done(null, results);
		// otherwise
		list.forEach(function(file){
			//console.log('walk.readdir.list-foreach callback, file = ' + insp(file));
			var newFilePath = dir + '/' + file;
			var fileData = { 'name': file, 'uuid': uuid.v1(), 'path': path.resolve(newFilePath) };

			// get the stats on each file
			fs.stat(newFilePath, function(err, stat){
				if(err){
					console.log('walk.readdir.stat errored, err = ' + insp(err));
					return done(err);		
				}
				
				if(stat && stat.isDirectory()){
					fileData.isDir = true;
					// get child dirs/files
					walk(newFilePath, function(err, recursedFileList){
						if( _.size(recursedFileList) > 0){
							fileData.children = recursedFileList;
							results[ fileData.uuid ] = fileData;
						}
						
						if (!--pending) done(null, results);
					});
				}
				else {
					// take the extension off of the file name
					var parts = file.split('.');
					var ext = parts.pop();

					// then put ir back together w/o the extension
					fileData.name = parts.join('.');
					fileData.ext = ext;
					
					if(acceptableExtenisons.indexOf(ext.toLowerCase()) > -1){
						results[ fileData.uuid ] = fileData;
					}
					
					if (!--pending) done(null, results);
				}
			});
		});
	});
}

function fetchUserCollections(collections, callback){
	var pending = _.size(collections);
	var localCollections = {};
	
	function fetchCallback(data){
		// this is collection name
		localCollections[this] = _.extend ( localCollections[this] || {}, data );
		
		if(!--pending)
			callback(localCollections); 
	}
	
	// fetch the file list for each collection
	for(var collectionName in collections){
		fetchFileList( collections[collectionName], fetchCallback.bind(collectionName) );
	}
	
}

function fetchFileList(uris, callback){
	var pending = uris.length;
	var returnFileHash = {};
	_.each(uris, function (uri) {
		// get the absolute path to this dir
		uri = path.resolve(uri);
		// don't walk if the dir donesn't exist
		if(fs.existsSync(uri)){
			walk(uri, function(err, results){
				if(err){
					console.log('fetchFileList walk callback errored, err = ' + insp(err));
				    throw new Error(err);
				}

				// push results one at a time
				if(results) results = _.extend( returnFileHash, results );
				// if all of the uri have been processed 
				if(!--pending) callback(returnFileHash);
			});
		}
		else {
			if(!--pending) callback(returnFileHash);
		}
	});
}

module.exports = {
	'fetchUserCollections': fetchUserCollections
}