'use strict';

var helpers = require('../helpers');

var streamSearchService = function streamSearchService(client, args) {
	var valid = helpers.validate(args, {
		'type': 'string',
		'body': 'object'
	});
	if (valid !== true) {
		throw valid;
		return;
	}
	var type = args.type;
	var body = args.body;
	delete args.type;
	delete args.body;
	delete args.stream;

	args.streamonly = 'true';

	return client.performWsRequest({
		method: 'POST',
		path: type + '/_search',
		params: args,
		body: body
	});
};

module.exports = streamSearchService;
