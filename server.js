'use strict';

require('./common/init');

var	io = require('socket.io'),	
	bodyParser = require('body-parser'),
	express = require('express'),
	fileUtil = require('./common/utils/fileUtil'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	path = require('path'),
	passport = require('passport'),
	smEnums = require('./common/enums/socketMessageEnum');

var	app = express();
	app.config = require('./app/config/env/base');
	app.users = {};
	app.collections = {};

	app.locals.cssFiles = fileUtil.getCSSAssets( app.config.assets.lib.css.concat(app.config.assets.css) );
	app.locals.jsFiles = fileUtil.getJavaScriptAssets( app.config.assets.lib.js.concat(app.config.assets.js) );
	
	app.locals.description = app.config.description;
	app.locals.facebookAppId = app.config.facebook.clientID;
	app.locals.keywords = app.config.keywords;
	app.locals.title = app.config.title;
	
	app.use(function(req, res, next) {
		// Passing the request url to environment locals
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.engine('html', require('consolidate')[app.config.templateEngine]);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/app/views');

	// load models
	fileUtil.getGlobbedFiles('./app/models/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

var session = require('express-session');
var	mongoStore = require('connect-mongo')({session: session});
var	db = mongoose.connect(app.config.db,
		function(err) {
			if (err) {
				console.error('\x1b[31m', 'Could not connect to MongoDB!');
				console.log(err);
			}
		}
	);

	// Enable jsonp
	app.enable('jsonp callback');

	// CookieParser should be above session
	//app.use(cookieParser());

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: app.config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: app.config.sessionCollection
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// Bootstrap passport config
	require('./app/config/passport')();

	// set .html as the default extension
	// Setting the app router and static folder
	app.use(express.static(require('path').resolve('./public')));

	// load routes
	fileUtil.getGlobbedFiles('./app/routes/**/*.js').forEach(function(file) {
		require(path.resolve(file))(app);
	});


var server = require('http').createServer(app);
	app.io = io.listen(server);

var	socketController = require('./app/controllers/socketController')(app);
	app.io.on( smEnums.connection, socketController.onClientConnection );

	server.listen(process.env.PORT);	
	console.log('Server running in ' + process.env.NODE_ENV + ' mode on port ' + process.env.PORT);