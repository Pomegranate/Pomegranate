/**
 * @file fileBaseName
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


import {fileBaseName} from "../../src/Framework/FileHelpers/fileBaseName";

/**
 *
 * @module fileBaseName
 */

describe('Returns the name of a file from path', () =>{
  test('returns filename sans extension', () => {
    expect(fileBaseName('/some/path/file.js')).toEqual('file')
  })
  test('Uppercases the filename', () => {
    expect(fileBaseName('/some/path/file.js', true)).toEqual('File')
  })
  test('Uppercases the filename, lowercases everything else', () => {
    expect(fileBaseName('/some/path/fIlENam$.js', true)).toEqual('Filenam$')
  })
});