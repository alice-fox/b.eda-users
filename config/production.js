'use strict';

var os = require('os');
var _ = require('underscore');

var getExternalIP = function() {
	return _(os.networkInterfaces()).chain().find(function(ni, name) {
		return name !== 'lo';
	}).find(function(ni) {
		return !ni.internal && ni.family === 'IPv4';
	}).value().address;
};

exports.config = {
	env: 'production',
	name: 'users',
	serviceRegistry: {
		host: '192.168.68.112',
		port: '8500'
	},
	listen: {
		host: getExternalIP(),
		port: '8002'
	},
	db: {
		type: 'mongodb',
		url: 'mongodb://172.18.0.2:27017',
		dbName: 'users'
	}
};
