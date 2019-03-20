/**
 * @file fileListDeep
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


'use strict';
import {joinMockPath} from "../../test_helpers/joinMockPath";
import {FileListDeepFromPath} from "../../src/Framework/FileHelpers/fileListDeep";

const testDir = joinMockPath(`${__dirname}/../../test_mocks/FileHelpers`)

/**
 *
 * @module fileListDeep
 */

describe('FileListDeep', () => {
  test('Recursivly returns non hidden files', async () => {
    let fileListDeep = FileListDeepFromPath(testDir('fileListDeep'))
    let files = await fileListDeep()
    expect(files.length).toEqual(3)
  });

  test('Recursivly returns hidden files', async () => {
    let fileListDeep = FileListDeepFromPath(testDir('fileListDeep'))
    let files = await fileListDeep({hidden: true})
    expect(files.length).toEqual(5)
  });

  test('Returns only files matching specified extension', async () => {
    let fileListDeep = FileListDeepFromPath(testDir('fileListDeepExt'))
    let files = await fileListDeep({ext: '.js'})
    expect(files.length).toEqual(3)
  });

  test('Returns files matching specified extension and in hidden directories', async () => {
    let fileListDeep = FileListDeepFromPath(testDir('fileListDeepExt'))
    let files = await fileListDeep({hidden: true, ext: '.js'})
    expect(files.length).toEqual(5)
  });

  test('Returns empty array when no files are found', async () => {
    let fileListDeep = FileListDeepFromPath(testDir('fileListDeepExt'))
    let files = await fileListDeep({ext: '.py'})
    expect(files.length).toEqual(0)
  });

  test('Throws with bad path', async () => {
    let fileListDeep = FileListDeepFromPath(testDir('Nope'))
    await expect(fileListDeep()).rejects.toEqual(expect.objectContaining({code: "ENOENT"}))
  });
});

