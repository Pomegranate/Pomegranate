/**
 * @file fileList
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * @file fileList
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-plugin-utils
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {fileListFromPath} from "../../src/Framework/FileHelpers/fileList";
import {joinMockPath} from "../../test_helpers/joinMockPath";

const testDir = joinMockPath(`${__dirname}/../../test_mocks/FileHelpers`)

describe('File Lists', () => {
  test('Returns non hidden files', async () => {
    let fileList = fileListFromPath(testDir('fileList'))
    let files = await fileList()
    expect(files.length).toEqual(1)
    expect(files[0].filename).toEqual('notHidden')
  })

  test('Returns hidden files', async () => {
    let fileList = fileListFromPath(testDir('fileList'))
    let files = await fileList({hidden: true})
    expect(files.length).toEqual(2)
    expect(files[0].filename).toEqual('.hidden')
    expect(files[1].filename).toEqual('notHidden')
    expect(files[1].getBaseName(true)).toEqual('Nothidden')

  })

  test('Returns only files with specified extension', async () => {
    let fileList = fileListFromPath(testDir('fileListExt'))
    let allfiles = await fileList()
    expect(allfiles.length).toEqual(5)

    let justJsFiles = await fileList({ext: '.js'})
    expect(justJsFiles.length).toEqual(3)

    let hiddenJsFiles = await fileList({hidden: true, ext: '.js'})
    expect(hiddenJsFiles.length).toEqual(4)
  })

  test('Returns Directories', async () => {
    let fileList = fileListFromPath(testDir('dirList'))
    let allDirs = await fileList({directories: true})
    expect(allDirs.length).toEqual(4)
  })
  test('Returns Hidden Directories', async () => {
    let fileList = fileListFromPath(testDir('dirList'))
    let hiddenDirs = await fileList({directories: true, hidden: true})
    expect(hiddenDirs.length).toEqual(5)
  })

  test('Throws on bad path', async () => {
    let fileList = fileListFromPath(testDir('nope'))
    await expect(fileList()).rejects.toEqual(expect.objectContaining({code: "ENOENT"}))
  })
});