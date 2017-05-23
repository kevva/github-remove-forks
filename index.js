'use strict';
const ghGot = require('gh-got');
const githubBranches = require('github-branches');
const githubRepos = require('github-repositories');
const githubTokenUser = require('github-token-user');
const pFilter = require('p-filter');
const pLocate = require('p-locate');

const getDiff = (repo, base, head, token) => ghGot(`repos/${repo.parent.full_name}/compare/${base}...${head}`, {token}).then(res => res.body);
const getRepo = (repo, token) => ghGot(`repos/${repo.full_name}`, {token}).then(res => res.body);
const deleteRepo = (repo, token) => ghGot.delete(`repos/${repo.full_name}`, {token}).then(() => repo);

const isBranchSame = (repo, branch, parentBranches, token) => {
	const sha = parentBranches.filter(x => x.commit.sha === branch.commit.sha);
	const checkBranches = parentBranches.filter(x => [branch.name, 'master'].some(y => y === x.name));

	if (sha.length === 1) {
		return true;
	}

	return pLocate(checkBranches, x => getDiff(repo, branch.commit.sha, x.name, token)
		.then(res => res.behind_by === 0)
		.catch(err => {
			if (err.code === 404) {
				return true;
			}

			throw err;
		}));
};

const isBranchNotUseful = (repo, token) => githubBranches(repo.full_name, {token})
	.then(branches => Promise.all([branches, githubBranches(repo.parent.full_name, {token})]))
	.then(data => {
		const branches = data[0];
		const parentBranches = data[1];

		return branches.length <= parentBranches.length && pLocate(branches, x => isBranchSame(repo, x, parentBranches, token));
	});

module.exports = opts => {
	opts = opts || {};

	if (!opts.token) {
		return Promise.reject(new Error('Token is required to authenticate with Github'));
	}

	return githubTokenUser(opts.token)
		.then(data => githubRepos(data.login, {token: opts.token}))
		.then(data => data.filter(x => x.fork))
		.then(data => Promise.all(data.map(x => getRepo(x, opts.token))))
		.then(data => pFilter(data, x => isBranchNotUseful(x, opts.token)))
		.then(data => Promise.all(data.map(x => deleteRepo(x, opts.token))));
};
