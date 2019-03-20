/**
 * @file walkReduce
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {WalkReducePath} from "../../src/Framework/FileHelpers/walkReduce";
import {joinMockPath} from "../../test_helpers/joinMockPath";

const testDir = joinMockPath(`${__dirname}/../../test_mocks/FileHelpers`)

describe('WalkReduce file paths', () => {
  test('Reducer', async () => {
    let walkReduce = WalkReducePath(testDir('RoutesMaybe'))
    let files = await walkReduce({hidden: true, ext: '.js'}, (file) => {
      return require(file.path)
    })
  })

  test('Reducer', async () => {
    let walkReduce = WalkReducePath(testDir('RoutesMaybe'))
    let files = await walkReduce({hidden: true, ext: '.js'})
  })
});
