'use strict';
module.exports = check;
module.exports.validate = validate;
module.exports.NpmPackageName = NpmPackageName;

var isValid = require('validate-npm-package-name');
var scopedPackagePattern = new RegExp("^(?:@([^/]+?)[/])?([^/]+?)$");

function check(name, scope) {
  var fn = fullName(name, scope);
  if (isValid(fn).validForNewPackages) {
    return new NpmPackageName(fn);
  }
  return null;
}

function fullName(name, scope) {
  var fullName = name;
  if (scope) {
    if (scope.charAt(0) === '@') {
      fullName = scope + '/' + name;
    } else {
      fullName = '@' + scope + '/' + name;
    }
  }
  return fullName;
}

function validate(name, scope) {
  var fn = fullName(name, scope);
  var valid = isValid(fn);
  if (valid.validForNewPackages) {
    return new NpmPackageName(fn);
  }
  var message = [
    (scope ? new NpmPackageName(scope, name) : name).toString() +
    " is not a valid package name"
  ];

  if (valid.errors) {
    message.push('Errors:');
    message.push(valid.errors.join('\n\t'));
  }
  if (valid.warnings) {
    message.push('Warnings:');
    message.push(valid.warnings.join('\n\t'));
  }

  throw new Error(message.join('\n'));
}


function NpmPackageName (fullName) {
  var parts = scopedPackagePattern.exec(fullName);
  this.scope = parts[1] || null;
  this.name = parts[2];
}

NpmPackageName.prototype.toJSON =
NpmPackageName.prototype.toString =
NpmPackageName.prototype.valueOf = function () {
  var scope = this.scope;
  return scope ? '@' + scope + '/' + this.name : this.name;
};
