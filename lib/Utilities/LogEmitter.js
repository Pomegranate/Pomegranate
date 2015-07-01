/**
 * @file LogEmitter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Silken
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var events = require('events').EventEmitter

/**
 *
 * @class Logger
 * @extends EventEmitter
 * @emits Logger#log
 * @emits Logger#error
 * @emits Logger#log-request
 */
function Logger() {
  events.call(this);
}
/**
 *
 * @type {Events}
 */
Logger.prototype = _.create(events.prototype, {
  constructor: Logger,
  /**
   * @method log
   * @memberof Logger
   * @instance
   * @param {string} message
   * @param {object} data
   * @event Logger#log
   */
  log: function() {
    var args = [].slice.call(arguments)
    args.unshift('log')
    setImmediate(function() {
      this.emit.apply(this, args)
    }.bind(this))

  },
  /**
   * @method error
   * @memberof Logger
   * @instance
   * @param {object} error
   * @event Logger#error
   */
  error: function() {
    var args = [].slice.call(arguments)
    args.unshift('error')
    setImmediate(function() {
      this.emit.apply(this, args)
    }.bind(this))

  },
  /**
   * @method requestHandled
   * @memberof Logger
   * @instance
   * @param {string} message
   * @param {object} data
   * @event Logger#log-request
   */
  requestHandled: function() {
    var args = [].slice.call(arguments)
    args.unshift('log-request')
    setImmediate(function() {
      this.emit.apply(this, args)
    }.bind(this))
  }
});

module.exports = new Logger()