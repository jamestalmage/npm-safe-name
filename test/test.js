"use strict";

var assert = require('assert');

var isSafe = require('../');

describe('npm-safe-name', function () {

  it('npmSafeName(name)', function () {
    name('good-name').shouldPass();
    name('bad name').shouldFail();
    name('good~name').shouldPass();
    name('Good~name').shouldFail();
    assert(isSafe.legacy('Good~name'), 'Good~name should pass in legacy mode');
    name('good.name').shouldPass();
    name('.goodname').shouldFail();
    assert.strictEqual(isSafe.legacy('.goodname'), null, '.goodname should fail even in legacy mode');
    name('_goodname').shouldFail();
  });

  it('npmSafeName(name, scope)', function () {
    name('good-name', 'good-scope').shouldPass();
    name('good-name', '@good-scope').shouldPass();
    name('good-name', 'bad scope').shouldFail();
    name('bad name', 'good-scope').shouldFail();
  });

  it('npmSafeName(fullName)', function () {
    name('@good-scope/good-name').shouldPass();
    name('bad-scope/good-name').shouldFail();
    name('@bad scope/good-name').shouldFail();
    name('@good-scope/bad name').shouldFail();
  });

  it('value comparison of result', function () {
    // you can compare NPMPackageName to String using `==` but not `===`
    assert.equal(isSafe('good-name'), 'good-name');
    assert.notStrictEqual(isSafe('good-name'), 'good-name');
    assert.equal(isSafe('@james/good-name'), '@james/good-name');
    assert.notStrictEqual(isSafe('@james/good-name'), '@james/good-name');
  });

  describe('.validate will throw if input is bad', function () {

    function testValidate(name, scope, shouldThrow, allowLegacy) {
      var fullName = scope ? scope + '/' + name : name;
      if (allowLegacy) {
        fullName = '(legacy): ' + fullName;
      }
      it(fullName + ' will ' + (shouldThrow ? '' : 'not ') + 'throw', function (done) {
        try {
          (allowLegacy ? isSafe.legacy :isSafe).validate(name, scope);
        } catch (e) {
          if (shouldThrow) {
            if (/valid package name/.test(e.toString())) {
              return done();
            } else {
              return done(new Error('threw an error, but bad message: ' + e))
            }
          }
          return done(e);
        }
        if (shouldThrow) return done(new Error('should have thrown'));
        return done();
      });
    }

    testValidate('@good-scope/good-name');
    testValidate('@good-scope/good-name', null, false, true);
    testValidate('bad-scope/good-name', null, true);
    testValidate('@bad scope/good-name', null, true);
    testValidate('good-name', 'good-scope');
    testValidate('good-name', 'good-scope', false, true);
    testValidate('good-name', '@good-scope');
    testValidate('good-name', '@good-scope', false, true);
    testValidate('good-name', '@bad scope', true);
    testValidate('good-name', 'bad scope', true);
    testValidate('bad name', 'good-scope', true);
    testValidate('Bad-new-name', 'good-scope', true);
    testValidate('Bad-new-name', 'good-scope', false, true);
  });

  it('result has appropriate scope and name properties', function () {
    assert.strictEqual(isSafe('good-name').name, 'good-name');
    assert.strictEqual(isSafe('good-name').scope, null);
    assert.strictEqual(isSafe('@james/good-name').name, 'good-name');
    assert.strictEqual(isSafe('@james/good-name').scope, 'james');
    assert.strictEqual(isSafe('good-name', 'good-scope').scope, 'good-scope');
    assert.strictEqual(isSafe('good-name', '@good-scope').scope, 'good-scope');
  });

  it('long names fail', function () {
    // proof of concept for Array.join()
    assert.strictEqual(new Array(3).join('a'), 'aa');
    name('aa').shouldPass();

    var maxLengthName = new Array(215).join('b');
    name(maxLengthName).shouldPass();

    var tooLongName = new Array(216).join('c');
    name(tooLongName).shouldFail();

    var prefix = '@james/';
    var maxWithScope = new Array(215 - (prefix.length)).join('d');
    name(prefix + maxWithScope).shouldPass();
    name(maxWithScope, 'james').shouldPass();
    name(maxWithScope, '@james').shouldPass();

    var tooLongWithScope = new Array(216 - (prefix.length)).join('e');
    name(prefix + tooLongWithScope).shouldFail();
    name(tooLongWithScope, 'james').shouldFail();
    name(tooLongWithScope, '@james').shouldFail();
  });
});

function name(name, scope) {
  var result = isSafe.apply(null, arguments);
  var value = result || new isSafe.NpmPackageName(scope, name);
  return {
    shouldPass: function () {
      assert(result, value.toString() + ' should have passed');
    },
    shouldFail: function () {
      assert.strictEqual(result, null, value.toString() + ' should have failed');
    }
  }
}
