/**
 * @file root
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

module.exports = function(Router){
  Router.get('/', function(req, res, next){

    res.json({path: '/'})

  })


  return Router
};