/**
 * @file test2
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

module.exports = function(Router){
  Router.get('/', function(req, res, next){

    res.json({path: '/test/external'})

  })

  Router.get('/:name/:test/param', function(req, res, next){
    var builtPath = '/test/external/' + req.params.name +'/'+ req.params.test + '/param';
    res.json({path: builtPath})

  })

  return Router
};