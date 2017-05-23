'use strict';
const ghGot = require('gh-got');
const githubRepos = require('github-repositories');
const githubTokenUser = require('github-token-user');

const deleteRepo = (repo, token) => ghGot.delete(`repos/${repo.full_name}`, {token}).then(() => repo);

module.exports = opts => {
	opts = opts || {};

	if (!opts.token) {
		return Promise.reject(new Error('Token is required to authenticate with Github'));
	}

	return githubTokenUser(opts.token)
		.then(data => githubRepos(data.login, {token: opts.token}))
		.then(data => data.filter(x => x.fork))
		.then(data => Promise.all(data.map(x => deleteRepo(x, opts.token))));
};
