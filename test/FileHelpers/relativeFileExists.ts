/**
 * @file relativeFileExists
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {relativeOutputFile} from "../../src/Framework/FileHelpers/relativeOutputFile";
import {relativeFileExists} from "../../src/Framework/FileHelpers/relativeFileExists";
import {readFile, remove} from 'fs-extra'

describe('relativeOutputFile', function () {
  test('Outputs files to the correct directory', async () => {
    let basepath = '/tmp/abababsbnbsba/path'
    let writeFile = relativeOutputFile(basepath)
    let fileExists = relativeFileExists(basepath)
    let file = await writeFile('plain.txt', 'plain files')
    let exists = await fileExists('plain.txt')
    let notexists = await fileExists('ghost.text')
    expect(exists).toBeTruthy()
    expect(notexists).toBeFalsy()
    await remove('/tmp/abababsbnbsba')
  })
});