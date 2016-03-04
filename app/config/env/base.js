'use strict';

var _ = require('lodash');

var env = process.env.NODE_ENV || 'development';
var envConfig = require('./' + env) || { ip: 'localhost', port: 4001 };
var url = 'http://' + envConfig.ip + ':' + envConfig.port;

console.log('server base url = ' + url);
var config = _.extend({
	title: 'loanstar-server',
	description: 'Stream Loaning, file loaning',
	keywords: 'streaming, movies, music, p2p, loan, loanstar',
	baseUrl: url,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/jquery/dist/jquery.min.js',

				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/css/app.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
}, envConfig);

process.env.PORT = config.port;

module.exports = config;