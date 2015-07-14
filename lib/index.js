'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('smartystreets-api');
var requestProxy = require('superagent-proxy');
var request = require('superagent');
var assert = require('assert');
var utils = require('./utils');
var uid = require('uid');

/**
 * Module variables.
 */

var host = 'https://api.smartystreets.com';

/**
 * Extend request with proxy capabilities.
 */

requestProxy(request);

/**
 * smartystreets object declaration.
 * 
 * @type {Object}
 */

var SmartyStreets = Object.create(null);

/**
 * Initialize smartystreets object.
 *
 * @param {String} id
 * @param {String} token
 * @param {Object} options
 * @return {SmartyStreets}
 */

SmartyStreets.init = function init(id, token, options) {
  assert(id, 'You must pass your SmartyStreets Auth ID.');
  assert(token, 'You must pass your SmartyStreets Auth Token.');
  options = options || {};
  this.auth = { 'auth-id': id, 'auth-token': token };
  this.host = options.host || host;
  this.proxy = options.proxy || null;
  return this;
};

/**
 * Verify address.
 *
 * @param {String|Object} data
 * @param {Function} fn
 * @return {SmartyStreets}
 */

SmartyStreets.address = function address(data, fn) {
  var method = !Array.isArray(data) ? 'get' : 'post';
  data = utils.normalize(data);
  this.call(method, 'street-address', data, fn);
};

/**
 *  Look up and verify city, state, and ZIP Code combinations.
 *
 * @param {Object} data
 * @param {Function} fn
 * @return {SmartyStreets}
 */

SmartyStreets.zipcode = function zipcode(data, fn) {
  var method = !Array.isArray(data) ? 'get' : 'post';
  data = utils.snakify(data);
  this.call(method, 'zipcode', data, fn);
};

/**
 * Suggest addreses for autocomplete.
 *
 * @param {String|Object} data
 * @param {Function} fn
 * @return {SmartyStreets}
 */

SmartyStreets.suggest = function suggest(data, fn) {
  if ('string' === typeof data) data = { prefix: data };
  else data = utils.snakify(data);
  var message = 'You must pass a valid prefix object or string.';
  assert(data, message);
  assert(data.prefix, message);
  this.call('get', 'suggest', data, fn);
};

/**
 * Perform http request.
 *
 * @param {String} method
 * @param {String} endpoint
 * @param {Object} data
 * @param {Function} fn
 */

SmartyStreets.call = function call(method, endpoint, data, fn) {
  var req = null;
  var auth = this.auth;
  var url = this.host + '/' + endpoint;
  data = data || {};
  data.input_id = data.input_id || data.inputId || uid(8);
  debug('enpoint %s request: %o', endpoint, data);
  if ('suggest' === endpoint) {
    url = url.replace('//api', '//autocomplete-api');
  }
  if ('get' === method) {
    req = request.get(url).query(auth).query(data);
  } else if ('post' === method) {
    req = request.post(url).query(auth).send(data);
  }
  if (this.proxy) req = req.proxy(this.proxy);
  req.end(function end(err, res) {
    err = err || utils.error(res);
    if (err) return fn(err);
    var data = utils.camelize(res.body);
    data = data && data.suggestions ? data.suggestions : data;
    debug('endpoing %s response: %o', endpoint, data);
    fn(null, data, res.body);
  });
};

/**
 * Create and return SmartyStreets object.
 *
 * @param {String} id
 * @param {String} token
 * @param {Object} options
 * @return {SmartyStreets}
 */

module.exports = function create(id, token, options) {
  return Object.create(SmartyStreets).init(id, token, options);
};
