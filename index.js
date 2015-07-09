'use strict';
module.exports = function (str) {
	//http://stackoverflow.com/questions/695438/safe-characters-for-friendly-url
	//These include uppercase and lowercase letters, decimal digits, hyphen, period, underscore, and tilde

	var match =  (str.length < 214 || null)
		&& /^(?:@([a-z0-9\-~][a-z0-9\-\._~]*)\/)?([a-z0-9\-~][a-z0-9\-\._~]*)$/.exec(str);

	return match && new NpmPackageName(match[1], match[2]);
};

function NpmPackageName(scope, name) {
	this.scope = scope || null;
	this.name = name;
}

NpmPackageName.prototype.toString =
NpmPackageName.prototype.valueOf = function() {
	var scope = this.scope;
  return scope ? '@' + scope + '/' + this.name : this.name;
};
