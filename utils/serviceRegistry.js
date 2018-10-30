'use strict';

var _ = require('underscore');
var Consul = require('consul');
var async = require('async');
var Url = require('url');

exports.registry;
exports.serviceId;

var servicesHash = {};

/*
 * @param {object} params.serviceRegistryConfig
 * @param {string} params.serviceConfig.name
 * @param {boolean} params.serviceConfig.listen.ssl
 * @param {string} params.serviceConfig.listen.host
 * @param {number} params.serviceConfig.listen.port
 * @param {string[]} params.serviceConfig.tags
 * @param {string[]} [params.services=[]]
 * @param {string} [params.check.path]
 * @param {string} [params.check.interval]
 */
exports.init = function(params, callback) {
	async.waterfall([
		function(callback) {
			exports.registry = Consul(
				params.serviceRegistryConfig
			);

			var serviceConfig = params.serviceConfig;

			exports.serviceId = serviceConfig.name + '_' + _.random(1000, 9999);
			var serviceInfo = {
				id: exports.serviceId,
				name: serviceConfig.name,
				address: serviceConfig.listen.host,
				port: Number(serviceConfig.listen.port),
				tags: serviceConfig.tags
			};

			exports.registry.agent.service.register(serviceInfo, callback);
		},
		function(err, registryResult, callback) {
			_(params.services).each(function(serviceName) {
				servicesHash[serviceName] = null;
			});

			exports.getServicesInfo(callback);
		}
	], function(err) {
		setInterval(function() {
			exports.getServicesInfo()
		}, 3 * 60 * 1000);

		callback(err);
	});
};

exports.deregister = function(callback) {
	if (exports.registry) {
		exports.registry.agent.service.deregister({
			id: exports.serviceId
		}, callback);
	} else {
		callback();
	}
};


exports.getServiceInfo = function(params, callback) {
	var serviceName = params.service;

	async.waterfall([
		function(callback) {
			if (!_(servicesHash).has(serviceName)) {
				return callback(new Error(
					'Service "' + serviceName + '" is not available for current service'
				));
			}

			var serviceInfo = servicesHash[serviceName];

			if (serviceInfo) {
				callback(null, serviceInfo)
			} else {
				exports.registry.catalog.service.nodes({
					service: serviceName
				}, callback);
			}
		}
	], function(err, serviceInfo) {
		if (err) return callback(err);

		servicesHash[serviceName] = serviceInfo;
		callback(null, serviceInfo);
	});
};

exports.getServicesInfo = function(callback) {
	callback = callback || _.noop;
	if (!_(servicesHash).keys().length) return callback();

	async.each(
		_(servicesHash).keys(),
		function(serviceName, callback) {
			exports.getServiceInfo({
				service: serviceName
			}, function(err, serviceInfo) {
				servicesHash[serviceName] = serviceInfo;
				callback();
			});
		},
		callback
	);
};
