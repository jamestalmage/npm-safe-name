'use strict';
module.exports = check;
module.exports.validate = validate;
module.exports.legacy = legacyCheck;
module.exports.legacy.validate = legacyValidate;

module.exports.legacy.NpmPackageName =
module.exports.NpmPackageName = NpmPackageName;

var isValid = require('validate-npm-package-name');
var scopedPackagePattern = new RegExp("^(?:@([^/]+?)[/])?([^/]+?)$");

function check(name, scope, allowLegacy) {
  if (name instanceof NpmPackageName) {
    if (!allowLegacy && name.legacyOnly) {
      return null;
    }
    return name;
  }
  var fn = fullName(name, scope);
  var valid = isValid(fn);
  if (valid[prop(allowLegacy)]) {
    return new NpmPackageName(fn, !valid.validForNewPackages);
  }
  return null;
}

function legacyCheck(name, scope) {
  return check(name, scope, true);
}

function legacyValidate(name, scope) {
  return validate(name, scope, true);
}

function prop(allowLegacy) {
  return allowLegacy ? 'validForOldPackages' : 'validForNewPackages';
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

function validate(name, scope, allowLegacy) {
  if (name instanceof NpmPackageName) {
    if (!allowLegacy && name.legacyOnly) {
      return validate(name.toString());
    }
    return name;
  }
  var fn = fullName(name, scope);
  var valid = isValid(fn);
  if (valid[prop(allowLegacy)]) {
    return new NpmPackageName(fn, !valid.validForNewPackages);
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

function NpmPackageName (fullName, legacyOnly) {
  var parts = scopedPackagePattern.exec(fullName);
  this.scope = parts[1] || null;
  this.name = parts[2];
  this.legacyOnly = legacyOnly;
}

NpmPackageName.prototype.toJSON =
NpmPackageName.prototype.toString =
NpmPackageName.prototype.valueOf = function () {
  var scope = this.scope;
  return scope ? '@' + scope + '/' + this.name : this.name;
};
