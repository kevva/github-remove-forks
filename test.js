import test from 'ava';
import fn from './';

test(async t => {
	try {
		await fn();
		t.fail();
	} catch (err) {
		t.is(err.message, 'Token is required to authenticate with Github');
	}
});
