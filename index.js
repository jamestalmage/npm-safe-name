'use strict';

// Rules for package names:
// https://docs.npmjs.com/files/package.json#name

// http://stackoverflow.com/questions/695438/safe-characters-for-friendly-url
// Url Friendly: uppercase and lowercase letters, decimal digits, hyphen, period, underscore, and tilde

var FULL_NAME = /^(?:@([a-z0-9\-~][a-z0-9\-\._~]*)\/)?([a-z0-9\-~][a-z0-9\-\._~]*)$/;
var SCOPE = /^(?:@?([a-z0-9\-~][a-z0-9\-\._~]*))?$/;
var NAME = /^[a-z0-9\-~][a-z0-9\-\._~]*$/;

module.exports = check;

function check(name, scope) {
	if (scope) {
		if (!NAME.test(name)) return null;

		scope = SCOPE.exec(scope);
		if (!scope) return null;
		scope = scope[1];

		return (name.length + scope.length < 212 || null) && new NpmPackageName(scope, name);
	} else {
		var match = (name.length < 214 || null) && FULL_NAME.exec(name);
		return match && new NpmPackageName(match[1], match[2]);
	}
}

module.exports.validate = function (name, scope) {
	var result = check(name, scope);
	if (result) return result;

	var message = (scope ? new NpmPackageName(scope, name) : name).toString();
  throw new Error(message + " is not a valid package name");
};

module.exports.NpmPackageName = NpmPackageName;

function NpmPackageName (scope, name) {
	this.scope = scope || null;
	this.name = name;
}

NpmPackageName.prototype.toJSON =
NpmPackageName.prototype.toString =
NpmPackageName.prototype.valueOf = function() {
	var scope = this.scope;
  return scope ? '@' + scope + '/' + this.name : this.name;
};
