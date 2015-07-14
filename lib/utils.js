'use strict';

/**
 * Module dependencies.
 */

var parse = require('parse-address').parseLocation;
var _ = require('lodash');

/**
 * Module variables.
 */

var isArray = Array.isArray;

/**
 * Normalize address.
 *
 * @param {String|Object} address
 * @return {Object}
 */

exports.normalize = function normalize(obj) {
  if (!obj) return;
  if (isArray(obj)) {
    var res = [];
    obj.forEach(function each(item) {
      res.push(normalize(item));
    });
    obj = res;
  } else if ('string' === typeof obj) {
    var parsed = parse(obj);
    obj = Object.create(null);
    obj.street = [
      parsed.number,
      parsed.prefix,
      parsed.street,
      parsed.type,
      parsed.suffix,
    ].join(' ');
    obj.street = obj.street.replace(/\s+/g, ' ');
    obj.city = obj.city || parsed.city;
    obj.state = obj.state || parsed.state;
    if (parsed.zip) obj.zipcode = parsed.zip;
  }
  return obj;
};

/**
 * Converts object variables to camel case.
 *
 * @param {Object} obj
 * @return {Object}
 */

exports.camelize = function camelize(obj) {
  if (!obj) return;
  if ('string' === typeof obj) {
    return _.camelCase(obj);
  }
  var res = Object.create(null);
  if (isArray(obj)) {
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
};

/**
 * Converts object variables to snake case.
 *
 * @param {Object} obj
 * @return {Object}
 */

exports.snakify = function snakify(obj) {
  if (!obj) return;
  if ('string' === typeof obj) {
    return _.snakeCase(obj);
  }
  var res = Object.create(null);
  if (isArray(obj)) {
    res = [];
    obj.forEach(function each(item) {
      res.push(snakify(item));
    });
  } else {
    Object.keys(obj).forEach(function each(key) {
      var val = obj[key];
      var ckey = _.snakeCase(key);
      res[ckey] = obj[key];
      if ('object' === typeof val) {
        res[ckey] = snakify(val);
      }
    });
  }
  return res;
};

/**
 * Get an error from a `res`.
 *
 * @param {Object} res
 * @return {String}
 */

exports.error = function error(res){
  if (!res || !res.error) return;
  var body = res.body;
  var msg = body.error && body.error.message
    || res.status + ' ' + res.text;
  return new Error(msg);
};

