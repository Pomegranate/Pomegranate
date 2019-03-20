/**
 * @file DependsOnSomeOther
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
const {InjectablePlugin, ApplicationPlugin} = require('../../../../src/Framework/Plugin/Builders')
const {strictEqual, equal, ok} = require('assert')

exports.Plugin = InjectablePlugin()
  .variables({localVar: 'default'})
  .directories(['Handlers'])
  .configuration({
    name: 'C',
    injectableParam: 'C',
    type: 'anything',
    depends: ['X']
  })
  .hooks({
    load: (Logger, Variables, X) => {
      strictEqual(X.name, 'X')
      throw new Error('This Is being overridden, and should not run.')
      return {name: 'C'}
    }
  })