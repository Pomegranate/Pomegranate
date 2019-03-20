/**
 * @file FrameworkOutputs
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import chalk from 'chalk'
import {} from 'lodash/fp'
import {rightBar} from "../../../src/Framework/Common/frameworkOutputs";

let logger = {
  log: jest.fn(() => {

  })
}

describe('Framework output formatting functions', () => {
  test('Right Bar - output lengths', () => {
    //@ts-ignore
    let none = rightBar(logger).run({msg: ''})
    //@ts-ignore
    let short = rightBar(logger).run({msg: 'one', separator: '*'})
    let longMsg = '123456789012345678901234567890123456789012345678901234567890abcdefghijklmopqrstuvwxyz'
    //@ts-ignore
    let long = rightBar(logger).run({msg: longMsg})


    let mockCalls = logger.log.mock.calls
    expect(mockCalls.length).toEqual(3)
    expect(mockCalls[0][0].length).toEqual(80)
    expect(mockCalls[0][1]).toEqual(1)
    expect(mockCalls[1][0].length).toEqual(80)
    expect(mockCalls[1][1]).toEqual(1)
    expect(mockCalls[2][0].length).toEqual(longMsg.length + 1)
    expect(mockCalls[2][1]).toEqual(1)
  })
})

