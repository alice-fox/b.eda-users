'use strict';

//var configUtils = require('./utils');

var os = require('os');
var _ = require('underscore');

exports.getExternalIP = function() {
	return _(os.networkInterfaces()).chain().find(function(ni, name) {
		return name !== 'lo';
	}).find(function(ni) {
		return !ni.internal && ni.family === 'IPv4';
	}).value().address;
};

exports.config = {
	env: 'develop',
	name: 'auth',
	serviceRegistry: {
		host: '192.168.0.110',
		port: '8500',
		tags: [],
		healthcheck: {
			path: '/healthchecks/state',
			interval: '30s',
			deregistercriticalserviceafter: '120s'
		}
	},
	secret: 'my-very-very-very-secure-secret',
	connectionsCountLimits: {
		critical: 1000,
		warn: 800
	},
	listen: {
		host: getExternalIP(),
		port: '8003'
	},
	db: {
		type: 'mongodb',
		url: 'mongodb://127.0.0.1:27017',
		dbName: 'users'
	}
};
