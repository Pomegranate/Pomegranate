/**
 * @file relativeOutputFile
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {relativeOutputFile} from "../../src/Framework/FileHelpers/relativeOutputFile";
import {readFile, remove} from 'fs-extra'

describe('relativeOutputFile', function () {
  test('Outputs files to the correct directory', async () => {
    let basepath = '/tmp/abababsbnbsba/path'
    let writeFile = relativeOutputFile(basepath)
    let file = await writeFile('plain.txt', 'plain files')
    let file1 = await writeFile('buffer.txt', Buffer.from('buffer file'))
    let read = await readFile('/tmp/abababsbnbsba/path/plain.txt', 'utf-8')
    let read1 = await readFile('/tmp/abababsbnbsba/path/buffer.txt', 'utf-8')
    expect(read).toEqual('plain files')
    expect(read1).toEqual('buffer file')
    await remove('/tmp/abababsbnbsba')
  })
});