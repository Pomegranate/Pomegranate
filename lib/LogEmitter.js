/**
 * @file LogEmitter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Silken
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var events = require('events').EventEmitter

var Logger = (function() {
  function Logger(){
    events.call(this);
  }
  Logger.prototype = _.create(events.prototype, {
    constructor: Logger,

    log: function(){
      var args = [].slice.call(arguments)
      args.unshift('log')
      setImmediate(function() {
        this.emit.apply(this, args)
      }.bind(this))

    },
    error: function(){
      var args = [].slice.call(arguments)
      args.unshift('error')
      setImmediate(function() {
        this.emit.apply(this, args)
      }.bind(this))

    },
    requestHandled: function(){
      var args = [].slice.call(arguments)
      args.unshift('log-request')
      setImmediate(function() {
        this.emit.apply(this, args)
      }.bind(this))
    }
  });
  return new Logger();
})();

/**
 * Centralizes logging allowing parent application to handle as needed.
 * @module LogEmitter
 */

module.exports = Logger