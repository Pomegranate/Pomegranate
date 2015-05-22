/**
 * @file RedisLoader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var redis = require('redis');
var url = require('url');
var events = require('events').EventEmitter
var emitter = new events();

/**
 * Provides a redis client.
 * @module RedisLoader
 */

module.exports = function(injector, options, logger) {
  var opts = options.redis
  var redisOpts = {
    //max_attempts: 5,
    //retry_max_delay: 250
  }
  if(_.isString(options.password)){
    redisOpts.auth_pass = opts.password
  }
  var Redis = redis.createClient(opts.port, opts.host, redisOpts)
  injector.service('Redis', Redis)
  Redis.on('connect', function(){
    logger.log('DataHandlers: Redis connection successful.');
    emitter.emit('ready')
  });

  Redis.on('error', function(err){
    logger.error(err)
  });
  return emitter
}