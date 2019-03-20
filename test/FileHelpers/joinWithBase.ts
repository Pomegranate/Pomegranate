/**
 * @file joinWithBase
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {joinWithBase} from "../../src/Framework/FileHelpers/joinWithBase";

describe('Join with base path', () => {
  test('Returns the correct path', () => {
    let base = '/tmp/path/to/some/plugin'
    let join = joinWithBase(base)
    expect(join('/some/path/to/a/file.js')).toEqual('/tmp/path/to/some/plugin/some/path/to/a/file.js')
    expect(join('/other/path/to/a/file.js')).toEqual('/tmp/path/to/some/plugin/other/path/to/a/file.js')
    expect(join('./some/path/to/a/file.js')).toEqual('/tmp/path/to/some/plugin/some/path/to/a/file.js')
  });
});