'use strict';
var githubRepos = require('github-repositories');
var githubTokenUser = require('github-token-user');
var got = require('gh-got');
var Promise = require('pinkie-promise');

module.exports = function (opts) {
	opts = opts || {};

	if (!opts.token) {
		return Promise.reject(new Error('Token is required to authenticate with Github'));
	}

	opts.headers = {
		Authorization: 'token ' + opts.token
	};

	return githubTokenUser(opts.token).then(function (data) {
		return githubRepos(data.login, {token: opts.token}).then(function (repos) {
			return repos.filter(function (el) {
				return el.fork;
			});
		});
	}).then(function (repos) {
		return Promise.all(repos.map(function (repo) {
			var url = 'repos/' + repo.full_name;

			return got.delete(url, {headers: opts.headers}).then(function () {
				return repo;
			});
		}));
	});
};
