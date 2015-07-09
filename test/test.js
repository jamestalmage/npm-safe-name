var assert = require('assert');

var isSafe = require('../');

describe('npm-safe-name', function() {
	it('pass / fail', function(){
		name('good-name').shouldPass();
		name('bad name').shouldFail();
		name('good~name').shouldPass();
		name('Good~name').shouldFail();
		name('good.name').shouldPass();
		name('.goodname').shouldFail();
		name('_goodname').shouldFail();
		name('@james/my-package').shouldPass();
		name('james/my-package').shouldFail();
	});

	it('value comparison of result', function() {
		// you can compare NPMPackageName to String using `==` but not `===`
		assert.equal(isSafe('good-name'),'good-name');
		assert.notStrictEqual(isSafe('good-name'), 'good-name');
		assert.equal(isSafe('@james/good-name'),'@james/good-name');
		assert.notStrictEqual(isSafe('@james/good-name'), '@james/good-name');
	});

	it('result has appropriate scope and name properties', function() {
		assert.strictEqual(isSafe('good-name').name, 'good-name');
		assert.strictEqual(isSafe('good-name').scope, null);
		assert.strictEqual(isSafe('@james/good-name').name, 'good-name');
		assert.strictEqual(isSafe('@james/good-name').scope, 'james');
	});

	it('long names fail', function() {
		// proof of concept for Array.join()
		assert.strictEqual(new Array(3).join('a'), 'aa');
		name('aa').shouldPass();

		var maxLengthName = new Array(214).join('b');
		name(maxLengthName).shouldPass();

		var tooLongName = new Array(215).join('c');
		name(tooLongName).shouldFail();

		var prefix = '@james/';
    var maxWithScope = prefix + new Array(214 - (prefix.length)).join('c');
		name(maxWithScope).shouldPass();

		var tooLongWithScope = prefix + new Array(215 - (prefix.length)).join('c');
		name(tooLongWithScope).shouldFail();
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

