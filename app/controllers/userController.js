'use strict';

var _ = require('lodash');

module.exports = _.extend(
	require('./users/userAuthenticationController'),
	require('./users/userAuthorizationController'),
	require('./users/userPasswordController'),
	require('./users/userProfileController')
);