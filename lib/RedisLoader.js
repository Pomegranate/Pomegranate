/**
 * @file RedisLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Silken
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var redis = require('redis');
var url = require('url');

/**
 * Provides a redis client.
 * @module RedisLoader
 */

module.exports = function(opts, logger) {
  var options = opts.redis
  var redisOpts = {
    //max_attempts: 5,
    //retry_max_delay: 250
  }
  if(_.isString(options.password)){
    redisOpts.auth_pass = options.password
  }
  return redis.createClient(options.port, options.host, redisOpts);
}