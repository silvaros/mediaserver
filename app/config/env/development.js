'use strict';
var ip = 'localhost';
var port = 4001;
module.exports = {
	ip: ip,	// development ip
	port: port,

	db: 'mongodb://localhost/loanstar-dev',
	title: 'loanstar - Development Environment',
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://'+ ip + ':'+ port + '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'QL1hXS3rV2o1h41WCk64tAUPp',
		clientSecret: process.env.TWITTER_SECRET || 'u6UQfthiDPZapK2hbo3Q11UIeyfs8EvrkmVkqv5LZStullv8DJ',
		callbackURL: 'http://'+ ip + ':'+ port + '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: 'http://'+ ip + ':'+ port + '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://'+ ip + ':'+ port + '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: 'http://'+ ip + ':'+ port + '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};