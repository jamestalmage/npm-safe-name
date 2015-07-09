# npm-safe-name [![Build Status](https://travis-ci.org/jamestalmage/npm-safe-name.svg?branch=master)](https://travis-ci.org/jamestalmage/npm-safe-name) [![Coverage Status](https://coveralls.io/repos/jamestalmage/npm-safe-name/badge.svg?branch=master&service=github)](https://coveralls.io/github/jamestalmage/npm-safe-name?branch=master)

> Inspect an npm packages name: Check if it is valid, and separate out the scope and package name parts.

It checks the following rules (from the [npm docs](https://docs.npmjs.com/files/package.json#name)):

- The name must be shorter than 214 characters. This includes the scope for scoped packages.
- The name can not start with a dot or an underscore.
- New packages must not have uppercase letters in the name.
- The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.

## Install

```
$ npm install --save npm-safe-name
```

## Usage

```js
var npmSafeName = require('npm-safe-name');

npmSafeName('package-name').toString();
npmSafeName('package-name').name;
//=> 'package-name'

npmSafeName('@my-scope/package-name').scope;
npmSafeName('package-name', 'my-scope').scope;
npmSafeName('package-name', '@my-scope').scope;
//=> 'my-scope'   
   
npmSafeName('package-name', 'my-scope').toString();
//=> '@my-scope/package-name'

npmSafeName('bad name with spaces');
//=> null

npmSafeName.validate(/*...*/);
// same as above but will throw an error on invalid input instead of returning null
```

By default, this only checks if the input is valid name for a [new package](https://github.com/npm/validate-npm-package-name#legacy-names).
If you want to validate only the more permissive legacy rules, you can do this:

```js
var npmSafeName = require('npm-safe-name').legacy;
```

It has an identical API, the only difference being it will validate only against the old rules.

## API

### npmSafeName(name [, scope])<br/>
### npmSafeName(fullName)

#### fullName

Type: `string | NpmPackageName`

The full name (including the optional scope) of the package name you want to check. (`"@my-scope/package-name"`)
If specifying the scope part, the leading `@` character *is* required.
If it is already an instance of [`NpmPackageName`](#NpmPackageName), it will simply be returned.

#### name

Type: `string`

The name of the package, not including the scope part. (`"package-name"`)

#### scope

Type: `string`

The scope of the package, not including the name part. (`"my-scope"`)
 
Accepted with or without the leading `@` character. (`"@my-scope"` or `"my-scope"`)

#### returns

Type: `NpmPackageName | null`

- `null` if the input does **not** represent a valid package name.
- [`NpmPackageName`](#NpmPackageName) instance if the input **does** represent a valid package name.

### npmSafeName.validate(name [, scope])<br/>  
### npmSafeName.validate(fullName)

Same as `npmSafeName(...)`, but will throw an Error instead of returning `null`.
    
## NpmPackageName

Return type for successful name check/validation. Available at `npmSaveName.NpmPackageName`
 for performing `instanceOf` checks only, otherwise it should not be used as it performs no input validation.

### NpmPackageName.prototype.scope

Type: `string | null`

The package scope, without either the name part or the leading `@` character. (`"my-scope"`)

### NpmPackageName.prototype.name

Type: `string`

The package name, without the leading scope part. (`"package-name"`)

### NpmPackageName.prototype.legacyOnly

Type: `boolean`

`true` if and only if the name is both a *valid* legacy name, and an *invalid* new name.
`false` otherwise


### NpmPackageName.prototype.toString()<br/>
### NpmPackageName.prototype.valueOf()<br/>
### NpmPackageName.prototype.toJSON()<br/>

#### returns

Type: `string`

The full name of the package, with scope prefix if applicable (`"package-name"` or `"@my-scope/package-name"`).

Note that the `valueOf` usage here allows you to use `==` to compare directly to strings without calling `toString()`
(whether or not that is a wise choice, I leave to the user).

```js
npmSafeName('my-package') == 'my-package'; // true
npmSaveName('my-package') === 'my-package'; // false
```

## License

MIT © [James Talmage](https://github.com/jamestalmage)
