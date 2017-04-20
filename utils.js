'use strict';

var path = require('path');
var extend = require('extend-shallow');
var resolveDir = require('resolve-dir');
var typeOf = require('kind-of');
var utils = module.exports;
var cache = {};

/**
 * Utils
 */

utils.options = function(app, options) {
  return extend({cwd: process.cwd()}, app.options, options);
};

utils.resolve = function(filepath) {
  return path.resolve(resolveDir(filepath));
};

utils.renameHelper = function(name, opts) {
  if (opts && typeof opts.renameHelper === 'function') {
    return opts.renameHelper(name);
  }
  return path.basename(name, path.extname(name));
};

utils.isObject = function(val) {
  return typeOf(val) === 'object';
};

utils.tryRequire = function(name, options) {
  if (cache.hasOwnProperty(name)) {
    return cache[name];
  }

  var val;
  try {
    val = require(name);
    cache[name] = val;
    return val;
  } catch (err) {}

  var opts = extend({cwd: process.cwd()}, options);
  try {
    val = require(path.resolve(opts.cwd, name));
    cache[name] = val;
    return val;
  } catch (err) {}

  try {
    val = require(utils.resolve(name, opts));
    cache[name] = val;
    return val;
  } catch (err) {}
  cache[name] = null;
  return null;
};
