'use strict';

var http = require('http');
// We need this to build our post string for login
var querystring = require('querystring');

var options = { path: '/auth/csSignin', method: 'POST' };
var failedMsg = 'Client log in failed. ';

exports.logIn = function(config, callback){
	var postData = querystring.stringify({ 
		userName: config.credentials.userName,
		password: config.credentials.password 
	});

	console.log('Attempting to log in as ' + config.credentials.userName + ' at ' + new Date().toUTCString());

	options.hostname = config.serverInfo.hostName;
	options.port = config.serverInfo.hostPort;
	options.headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': postData.length
	};

	var req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    var chunks = [];
		res.on('data', function(chunk){
			chunks.push(chunk);
		})

		res.on('end', function(){
			var resJson = JSON.parse(chunks.join(''));
			switch(res.statusCode){
				case 200: 
					if(callback) callback(resJson);		
					break;
				default:
					console.log(failedMsg + resJson.message);
					break;
			}		
		});
	});
	
	req.write( postData	);
	
	req.on('error', function(e) {
	  console.log(failedMsg + e.message);
	});

	req.end();
}

