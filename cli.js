#!/usr/bin/env node
'use strict';

var meow = require('meow');
var githubRemoveForks = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ github-remove-forks --token 523ef69119',
		'',
		'Options',
		'  -t, --token      Github token to authenticate with',
		'  -v, --verbose    Show detailed output'
	].join('\n')
}, {
	boolean: ['verbose'],
	string: ['token'],
	alias: {
		t: 'token',
		v: 'verbose'
	}
});

if (!cli.flags.token) {
	console.error('Token required');
	process.exit(1);
}

githubRemoveForks(cli.flags, function (err, data) {
	if (err) {
		console.error(err.message);
		process.exit(1);
	}

	console.log('Removed ' + data.length + ' repositories');

	if (cli.flags.verbose) {
		console.log();

		data.forEach(function (el) {
			console.log(el.html_url);
		});
	}
});
