# npm-safe-name [![Build Status](https://travis-ci.org/jamestalmage/npm-safe-name.svg?branch=master)](https://travis-ci.org/jamestalmage/npm-safe-name)

> Check if a string you want is a safe npm name.

It checks the following rules (from the [npm docs](https://docs.npmjs.com/files/package.json#name)):

- The name must be shorter than 214 characters. This includes the scope for scoped packages.
- The name can't start with a dot or an underscore.
- New packages must not have uppercase letters in the name.
- The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.

## Install

```
$ npm install --save npm-safe-name
```

## Usage

```js
var isSafe = require('npm-safe-name');

isSafe('unicorns');
//=> true

isSafe('foo bar');
//=> false
```

## API

### npmSafeName(input)

#### input

*Required*  
Type: `string`

the name you want to check


## License

MIT © [James Talmage](https://github.com/jamestalmage)
