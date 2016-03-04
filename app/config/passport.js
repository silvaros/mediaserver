'use strict';

var passport = require('passport'),
	path = require('path'),
	User = require('mongoose').model('User'),
	fileUtil = require('../../common/utils/fileUtil');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({ _id: id }, '-salt -password', function(err, user) { done(err, user); });
	});

	// Initialize strategies
	fileUtil.getGlobbedFiles('./app/config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};