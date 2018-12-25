'use strict';

var configUtils = require('./utils');

exports.config = {
	env: 'test',
	name: 'users',
	listen: {
		host: configUtils.getExternalIP(),
		port: '8002'
	},
	db: {
		type: 'mongodb',
		url: 'mongodb://172.18.0.2:27017',
		dbName: 'users-test'
	}
};
