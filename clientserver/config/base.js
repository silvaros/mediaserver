'use strict';

var port, hostName, hostPort;

switch(process.env.NODE_ENV){
	case GLOBAL.envHash.pro:
		hostName = '72.66.104.49';
		hostPort = 4000;
		port = 7000;
		break;
	case GLOBAL.envHash.dev:
		hostName = 'localhost';
		hostPort = 4001;
		port = 7000;
		break;
};

module.exports = {
	app: {
		title: 'loanstar-client',
		description: 'Stream Loaning, file loaning',
		keywords: 'streaming, movies, music, p2p, loan, loanstar'
	},
	serverInfo: {
		hostName: hostName,
		hostPort: hostPort
	},
	port: port,
	credentials: {
		userName: 'admin', 
		password: 'p@ssw0rd'
	},
	collections:{
		movies: ['M:\/Movies','/Volumes/Mac.Movies/Ripped\ DVDs/Movies'],
		tv: ['M:\/TV','/Volumes/Mac.Movies/Ripped\ DVDs/TV\ Shows']
	},
	
};	

process.env.PORT = port;