'use strict';

var configUtils = require('./utils');

exports.config = {
	env: 'production',
	name: 'users',
	serviceRegistry: {
		host: '192.168.68.112',
		port: '8500'
	},
	listen: {
		host: configUtils.getExternalIP(),
		port: '8002'
	},
	db: {
		type: 'mongodb',
		url: 'mongodb://172.18.0.2:27017',
		dbName: 'users'
	}
};
