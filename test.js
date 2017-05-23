/* eslint-disable camelcase */
import nock from 'nock';
import test from 'ava';
import m from './';

test.before(() => {
	nock('https://api.github.com', {reqheaders: {authorization: `token ${process.env.GH_TOKEN}`}})
		.persist()
		.get('/user')
		.reply(200, {login: 'kevva'})
		.get('/users/kevva/repos')
		.query(true)
		.reply(200, [{
			full_name: 'kevva/playground',
			fork: false
		}, {
			full_name: 'kevva/github-remove-forks',
			fork: true
		}, {
			full_name: 'kevva/unicorn',
			fork: true
		}])
		.delete('/repos/kevva/github-remove-forks')
		.reply(200, {
			full_name: 'kevva/github-remove-forks',
			fork: true
		})
		.delete('/repos/kevva/unicorn')
		.reply(200, {
			full_name: 'kevva/unicorn',
			fork: true
		});
});

test(async t => {
	const [githubRemoveForks, unicorn, ...repos] = await m({token: process.env.GH_TOKEN});

	t.is(repos.length, 0);
	t.is(githubRemoveForks.full_name, 'kevva/github-remove-forks');
	t.is(unicorn.full_name, 'kevva/unicorn');
});
