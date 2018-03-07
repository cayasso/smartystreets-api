'use strict';

/**
 * Module dependencies.
 */

const parse = require('parse-address').parseLocation;
const _ = require('lodash');

/**
 * Module variables.
 */

const isArray = Array.isArray;

/**
 * Normalize address.
 *
 * @param {String|Object} address
 * @return {Object}
 */

exports.normalize = function normalize(obj) {
  if (!obj) return;
  if (isArray(obj)) {
    let res = [];
    obj.forEach(function each(item) {
      res.push(normalize(item));
    });
    obj = res;
  } else if ('string' === typeof obj) {
    const parsed = parse(obj);
    obj = Object.create(null);
    obj.street = [
      parsed.number,
      parsed.prefix,
      parsed.street,
      parsed.type,
      parsed.suffix,
      parsed.sec_unit_type,
      parsed.sec_unit_num
    ].join(' ');
    obj.street = obj.street.replace(/\s+/g, ' ').trim();
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
  let res = Object.create(null);
  if (isArray(obj)) {
    res = [];
    obj.forEach(function each(item) {
      res.push(camelize(item));
    });
  } else {
    Object.keys(obj).forEach(function each(key) {
      const val = obj[key];
      const ckey = _.camelCase(key);
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
  let res = Object.create(null);
  if (isArray(obj)) {
    res = [];
    obj.forEach(function each(item) {
      res.push(snakify(item));
    });
  } else {
    Object.keys(obj).forEach(function each(key) {
      const val = obj[key];
      const ckey = _.snakeCase(key);
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
  const body = res.body;
  const msg = body.error && body.error.message
    || res.status + ' ' + res.text;
  return new Error(msg);
};

