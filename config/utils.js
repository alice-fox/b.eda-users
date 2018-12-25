'use strict';

var os = require('os');
var _ = require('underscore');

exports.getExternalIP = function() {
	return _(os.networkInterfaces()).chain().find(function(ni, name) {
		return name !== 'lo';
	}).find(function(ni) {
		return !ni.internal && ni.family === 'IPv4';
	}).value().address;
};
