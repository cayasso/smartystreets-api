/**
 * Module dependencies.
 */

var _ = require('lodash');

/**
 * Module exports.
 */

module.exports = ErrorFactory;

/**
 * SmartyStreetsError factory.
 *
 * @param {String} type
 * @param {Object} defaults
 * @return {SmartyStreetsError}
 * @api public
 */

function ErrorFactory(type, defaults) {

  if ('string' !== typeof type) {
    throw new Error('Invalid error type provided.');
  }
  
  if (/string|number/.test(typeof defaults)) {
    defaults = { code: defaults };
  }

  /**
   * Error constructor.
   *
   * @param {Mixed} message The error or the error message.
   * @param {Object} options
   * @api public
   */

  function SmartyStreetsError(message, options) {

    if (/string|number/.test(typeof options)) {
      options = { code: options };
    }

    options = options || {};

    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    if ('object' === typeof message) {
      options.code = options.code || message.code;
      message = message.message;
    }

    this.name = type;
    this.constructor.name = type;
    this.message = message || '';

    var status = options.code || (defaults || {}).code;

    if (status) options.status = status;

    // we extend the this with defaults and options.
    _.chain(this).extend(defaults).extend(options).value();

    console.log('\n', this, '\n');
  }

  /**
   * Inheriths from `Error`.
   */

  SmartyStreetsError.prototype = Object.create(Error.prototype, {
    constructor: { value: SmartyStreetsError }
  });

  return SmartyStreetsError;
};