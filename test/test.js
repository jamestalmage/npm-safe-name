var assert = require('assert');

var isSafe = require('../');

describe('npm-safe-name', function() {
	it('does what it says', function(){
		name('good-name').shouldPass();
		name('bad name').shouldFail();
		name('good~name').shouldPass();
		name('Good~name').shouldFail();
		name('good.name').shouldPass();
		name('.goodname').shouldFail();
		name('_goodname').shouldFail();
	});
});


function name (s) {
	return {
		shouldPass: function() {
			assert(isSafe(s), JSON.stringify(s) + ' should have passed');
		},
		shouldFail: function() {
			assert(!isSafe(s), JSON.stringify(s) + ' should have failed');
		}
	}
}

