/**
 * @file SingleConstExport
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export const plugin = {
  variables: {},
  directories:  [],
  configuration: {
    name: 'PluginConst',
    type: "instance",
    injectableParam: 'Single',
    depends: []
  },
  hooks: {
    load(pa) {
      pa.setName('bob')
    }

  },

  commands:{}
}