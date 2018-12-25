'use strict';

var configUtils = require('./utils');

exports.config = {
	env: 'develop',
	name: 'users',
	serviceRegistry: {
		host: '192.168.0.110',
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
