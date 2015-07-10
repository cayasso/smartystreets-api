'use strict';

/**
 * Module dependencies.
 */
var parse = require('parse-address').parseLocation;
var debug = require('debug')('smartystreets-api');
var request = require('superagent');
var assert = require('assert');
var _ = require('lodash');
var uid = require('uid');

/**
 * Module variables.
 */

var noop = function noop() {};
var host = 'https://api.smartystreets.com';

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
  this.id = id;
  this.token = token;
  this.host = options.host || host;
  return this;
};

/**
 * Verify address.
 *
 * @param {String} address
 * @param {Function} fn
 * @return {SmartyStreets}
 */

SmartyStreets.verify = function verify(address, fn){
  address = normalize(address)
  debug('request data: %o', address);
  request
    .get(this.host + '/street-address')
    .set('Accept', 'application/json')
    .query({ 'auth-id': this.id })
    .query({ 'auth-token': this.token })
    .query(address)
    .end(function end(err, res) {
      err = error(res);
      if (err) return fn(err);
      var data = camelize(res.body);
      debug('response data: %o', data);
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

/**
 * Normalize address.
 *
 * @param  {String|Object} address
 * @return {Object}
 */

function normalize(address) {
  if (!address) return;
  if ('string' === typeof address) {
    address = parse(address);
  }
  var street = [
    address.number,
    address.prefix,
    address.street,
    address.suffix,
    address.type
  ].join(' ');
  var obj = {
    input_id: uid(8),
    street: street,
    city: address.city || '',
    state: address.state || '',
    zipcode: address.zip || ''
  };
  return obj;
};

/**
 * Converts object variables to camel case.
 *
 * @param {Object} obj
 * @return {Object}
 */

function camelize(obj) {
  if (!obj) return;
  if ('string' === typeof obj) {
    return _.camelCase(obj);
  }
  var res = Object.create(null);
  if (_.isArray(obj)) {
    res = [];
    obj.forEach(function each(item) {
      res.push(camelize(item));
    });
  } else {
    Object.keys(obj).forEach(function each(key) {
      var val = obj[key];
      var ckey = _.camelCase(key);
      res[ckey] = obj[key];
      if ('object' === typeof val) {
        res[ckey] = camelize(val);
      }
    });
  }
  return res;
}

/**
 * Get an error from a `res`.
 *
 * @param {Object} res
 * @return {String}
 */

function error(res){
  if (!res.error) return;
  var body = res.body;
  var msg = body.error && body.error.message
    || res.status + ' ' + res.text;
  return new Error(msg);
}

