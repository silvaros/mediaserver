'use strict';

var _ = require('lodash'),
	glob = require('glob');

var mimeTypes = {
	"swf": "application/x-shockwave-flash",
	"flv": "video/x-flv",
	"mpeg": "video/mpeg",
	"mpg": "video/mpeg",
	"mpv2": "video/mpeg",
	"mp2": "video/mpeg",
	"ogg": "video/ogg"
};

exports.getExt = function(name){
	return name.split('.').pop();
};

exports.getExtMime = function(ext){
	return mimeTypes[ext] || 'video/mp4';
};

exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (removeRoot) {
					files = files.map(function(file) {
						return file.replace(removeRoot, '');
					});
				}

				output = _.union(output, files);
			});
		}
	}

	return output;
};

exports.getJavaScriptAssets = function(jsFiles, includeTests) {
	var output = this.getGlobbedFiles(jsFiles, 'public/');

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.assets.tests));
	}

	return output;
};

exports.getCSSAssets = function(cssFiles) {
	var output = this.getGlobbedFiles(cssFiles, 'public/');
	return output;
};

