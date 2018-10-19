'use strict';

exports.config = {
	env: 'development',
	name: 'users',
	listen: {
		host: '0.0.0.0',
		port: '8002'
	},
	db: {
		path: './data/users.nedb'
	}
};