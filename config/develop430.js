'use strict';

exports.config = {
	env: 'development',
	name: 'users',
	serviceRegistry: {
		host: '127.0.0.1',
		port: '8500'
	},
	listen: {
		host: '192.168.43.195',
		port: '8002'
	},
	db: {
		path: './data/users.nedb'
	}
};