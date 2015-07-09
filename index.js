'use strict';
module.exports = function (str) {
	//http://stackoverflow.com/questions/695438/safe-characters-for-friendly-url
	//These include uppercase and lowercase letters, decimal digits, hyphen, period, underscore, and tilde

	return str.length < 214 && /^(?:@[a-z0-9\-~][a-z0-9\-\._~]*\/)?[a-z0-9\-~][a-z0-9\-\._~]*$/.test(str);
};
