# load-helpers [![NPM version](https://img.shields.io/npm/v/load-helpers.svg?style=flat)](https://www.npmjs.com/package/load-helpers) [![NPM monthly downloads](https://img.shields.io/npm/dm/load-helpers.svg?style=flat)](https://npmjs.org/package/load-helpers)  [![NPM total downloads](https://img.shields.io/npm/dt/load-helpers.svg?style=flat)](https://npmjs.org/package/load-helpers) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/load-helpers.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/load-helpers)

> Load helpers with patterns, as an object, key-value pair, or module.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save load-helpers
```

Install with [yarn](https://yarnpkg.com):

```sh
$ yarn add load-helpers
```

## API

### [Loader](index.js#L24)

Create an instance of `Loader` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var Loader = require('load-helpers');
var loader = new Loader();
```

### [.addHelper](index.js#L53)

Register a helper function by `name`.

**Params**

* `name` **{String}**
* `fn` **{Function}**
* `options` **{Object}**

**Example**

```js
loader.addHelper('foo', function() {
  // do stuff
});
```

### [.addHelpers](index.js#L89)

Register an object of helper functions.

**Params**

* `helpers` **{Object}**
* `options` **{Object}**

**Example**

```js
loader.addHelpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

### [.load](index.js#L116)

Load one or more helpers from a filepath, glob pattern, object, or an array of any of those things. This method detects the type of value to be handled then calls one of the other methods to do the actual loading.

**Params**

* `helpers` **{Object}**
* `options` **{Object}**
* `returns` **{Object}**: Returns the views from `loader.helpers`

**Example**

```js
var loader = new Loader();
console.log(loader.load(['foo/*.hbs', 'bar/*.hbs']));
console.log(loader.load({path: 'a/b/c.md'}));
console.log(loader.load('index', {path: 'a/b/c.md'}));
```

## options.renameHelper

Customize how dynamically-added helpers are named as they're loaded.

**Examples**

Pass a custom `renameHelper` function on the ctor.

```js
var loader = new Loader({
  renameHelper: function(key) {
    // simple camel-case
    return key.replace(/\W(.)/g, function(_, ch) {
      return ch.toUpperCase();
    });
  }
});

loader.load('for-own');
console.log(loader.helpers);
// { 'forOwn': [Function: forOwn] }
```

Or to only renamed specific helpers, you can pass the `renameHelper` function to any of the methods.

```js
loader.load('for-own', {
  renameHelper: function(key) {
    // simple camel-case
    return key.replace(/\W(.)/g, function(_, ch) {
      return ch.toUpperCase();
    });
  }
});
console.log(loader.helpers);
// { 'forOwn': [Function: forOwn] }
```

## About

### Related projects

* [handlebars-helpers](https://www.npmjs.com/package/handlebars-helpers): More than 130 Handlebars helpers in ~20 categories. Helpers can be used with Assemble, Generate… [more](https://github.com/helpers/handlebars-helpers) | [homepage](https://github.com/helpers/handlebars-helpers "More than 130 Handlebars helpers in ~20 categories. Helpers can be used with Assemble, Generate, Verb, Ghost, gulp-handlebars, grunt-handlebars, consolidate, or any node.js/Handlebars project.")
* [helper-cache](https://www.npmjs.com/package/helper-cache): Easily register and get helper functions to be passed to any template engine or node.js… [more](https://github.com/jonschlinkert/helper-cache) | [homepage](https://github.com/jonschlinkert/helper-cache "Easily register and get helper functions to be passed to any template engine or node.js application. Methods for both sync and async helpers.")
* [template-helpers](https://www.npmjs.com/package/template-helpers): Generic JavaScript helpers that can be used with any template engine. Handlebars, Lo-Dash, Underscore, or… [more](https://github.com/jonschlinkert/template-helpers) | [homepage](https://github.com/jonschlinkert/template-helpers "Generic JavaScript helpers that can be used with any template engine. Handlebars, Lo-Dash, Underscore, or any engine that supports helper functions.")
* [templates](https://www.npmjs.com/package/templates): System for creating and managing template collections, and rendering templates with any node.js template engine… [more](https://github.com/jonschlinkert/templates) | [homepage](https://github.com/jonschlinkert/templates "System for creating and managing template collections, and rendering templates with any node.js template engine. Can be used as the basis for creating a static site generator or blog framework.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 39 | [jonschlinkert](https://github.com/jonschlinkert) |
| 3 | [doowb](https://github.com/doowb) |

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.5.0, on April 20, 2017._