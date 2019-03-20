/**
 * @file stringFuns
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {map, every, negate} from 'lodash/fp'
import {validParameter, reservedWords} from "../../Framework/Common/stringFuns";


describe('String Functions', () => {
  test('validParameter', () => {
    let passing = [
      "$jwhat",
      'aBcDeFgh1'
    ]
    let failing = [
      '1isNotok',
      '-Ok',
      'ĦĔĽĻŎ'
    ].concat(reservedWords)
    let allPassing = every(Boolean, map((s) => {

      return validParameter(s)
    }, passing))

    let allFailing = every(Boolean, map((s) => {
      return !validParameter(s)
    }, failing))

    expect(allPassing).toBeTruthy()
    expect(allFailing).toBeTruthy()
  })
});