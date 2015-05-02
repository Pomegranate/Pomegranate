/**
 * @file goodRoute
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * A correct route definition file.
 * @module goodRoute
 */

module.exports = function(router, logger, SQL, Couch){
  router.get('/', function(req, res, next){
    res.json({derp: 'herp'});
  })

  return {path: '/', router: router}
};