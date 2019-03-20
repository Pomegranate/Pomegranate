/**
 * @file fileListNested
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


// const tap = require('tap');
// const path = require('path')

import {fileListNestedFromPath} from "../../src/Framework/FileHelpers/fileListNested";
import {joinMockPath} from "../../test_helpers/joinMockPath";

const testDir = joinMockPath(`${__dirname}/../../test_mocks/FileHelpers/fileListNested`)

describe('Nested File Lists', () => {
  test('Returns a nested structure of file paths.', async () => {
    let fileList = fileListNestedFromPath(testDir('noHidden'))
    let files = await  fileList()

    expect(files.adir).toEqual(expect.any(Object))
    expect(files.adir.aseconddir).toEqual(expect.any(Object))
    expect(files.adir.aseconddir.athirddir).toEqual(expect.any(Object))
    let deepFile = files.adir.aseconddir.athirddir.okthatsenough
    expect(deepFile).toEqual(expect.any(String))
    let enough = require(deepFile)
    expect(enough).toEqual('Thats enough!')

  })

  test('Returns non-hidden files.', async () => {
    let fileList = fileListNestedFromPath(testDir('someHidden'))
    let files = await  fileList()

    expect(files.nothidden).toEqual(expect.any(Object))
    expect(files.nothidden.nothiddenfile).toEqual(expect.any(String))

  })

  test('Returns hidden files.', async () => {
    let fileList = fileListNestedFromPath(testDir('someHidden'))
    let files = await  fileList({hidden: true})

    expect(files['.hiddendir']).toEqual(expect.any(Object))
    expect(files['.hiddendir'].nothiddenfile).toEqual(expect.any(String))
    expect(files.nothidden).toEqual(expect.any(Object))
    expect(files.nothidden['.hiddenfile']).toEqual(expect.any(String))

  })
  test('Filters based on extension files.', async () => {
    let fileList = fileListNestedFromPath(testDir('filterFileExt'))
    let files = await  fileList({ext: '.js'})

    expect(files.text).toBeFalsy()
    expect(files.afile).toBeTruthy()
    expect(files.hasfiles.somemarkdown).toBeFalsy()
    expect(files.hasfiles.somefile).toBeTruthy()
  })
});
