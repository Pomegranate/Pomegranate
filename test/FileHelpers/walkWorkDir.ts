/**
 * @file walkWorkDir
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


import {joinMockPath} from "../../test_helpers/joinMockPath";
import {WalkWorkDirPath} from "../../src/Framework/FileHelpers/walkWorkDir";

const testDir = joinMockPath(`${__dirname}/../../test_mocks/FileHelpers`)


describe('Walking file paths', () => {
  test('Returns non hidden files recursively', async () => {
    let walkDir = WalkWorkDirPath(testDir('fileListDeep'))
    let files = await walkDir()
    expect(files.length).toEqual(2)
    expect(files[0].filename).toEqual('notHidden')
    expect(files[0].walk).toBeNull()
    expect(files[1].filename).toEqual('some')
    expect(files[1].walk).toEqual(expect.any(Function))

    let files1 = await files[1].walk()
    expect(files1.length).toEqual(1)
    expect(files1[0].filename).toEqual('deep')
    expect(files1[0].walk).toEqual(expect.any(Function))

    let files2 = await files1[0].walk()
    expect(files2.length).toEqual(2)
    expect(files2[0].filename).toEqual('path')
    expect(files2[0].walk).toEqual(expect.any(Function))
    expect(files2[1].filename).toEqual('somedeep.txt')
    expect(files2[1].walk).toBeNull()

    let files3 = await files2[0].walk()
    expect(files3.length).toEqual(1)
    expect(files3[0].filename).toEqual('somedeeppath.txt')
    expect(files3[0].walk).toBeNull()

  })
  test('Returns hidden files recursively', async () => {
    let walkDir = WalkWorkDirPath(testDir('fileListDeep'))
    let files = await walkDir({hidden: true})
    expect(files.length).toEqual(4)
  })

  test('Returns non hidden files matching extension.', async () => {
    let walkDir = WalkWorkDirPath(testDir('fileListDeepExt'))
    let files = await walkDir({ext: '.js'})
    expect(files.length).toEqual(2)
    files.forEach((file) => {
     if(file.file){
       expect(file.getBaseName()).toEqual('notHidden')
       expect(file.getBaseName(true)).toEqual('Nothidden')
     }
    })
  })

  test('Returns hidden files matching extension recursively', async () => {
    let walkDir = WalkWorkDirPath(testDir('fileListDeepExt'))
    let files = await walkDir({hidden: true, ext: '.js'})
    expect(files.length).toEqual(4)
  })

  test('Returns only directories when no matching file extensions are found', async () => {
    let walkDir = WalkWorkDirPath(testDir('fileListDeep'))
    let files = await walkDir({hidden: true, ext: '.py'})
    expect(files.length).toEqual(2)
  })

  test('Throws with bad path', async () => {
    let walkDir = WalkWorkDirPath(testDir('Nope'))
    await expect(walkDir()).rejects.toEqual(expect.objectContaining({code: "ENOENT"}))
  });
});
