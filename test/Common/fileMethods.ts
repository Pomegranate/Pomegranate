import {valueOnPredicate,joinPaths,isJsFile, safeExtname, safeIsDirectory, safeReadSync, hasIndexFile} from '../../src/Framework/Common/fileMethods'
import {isFunction} from 'lodash/fp'
import {join} from 'path'

describe('#joinPath - Joins Paths Correctly', () => {

  test('Returns A partially applied function', () => {
    let joinP = joinPaths(['./path'])
    expect(isFunction(joinP)).toBeTruthy()
  })

  test('Returns base path when called with no args', () => {
    let joinP = joinPaths(['./path'])
    expect(joinP()).toEqual('path')
  })

  test('Correctly builds paths from args', () => {
    let joinP = joinPaths(['./path'])
    expect(joinP('home')).toEqual('path/home')
    expect(joinP('other')).toEqual('path/other')
  })

  test('Its Idempotent', () => {
    let joinP = joinPaths(['./path'])
    expect(joinP('home')).toEqual('path/home')
    expect(joinP('home')).toEqual('path/home')
  })
})

describe('#safeIsDirectory', () => {
  test('Returns false with no arguments', () => {
    expect(safeIsDirectory()).toBeFalsy()
  })

  test('Returns false when given a file path', () => {
    expect(safeIsDirectory(__dirname + '/' + __filename)).toBeFalsy()
  })

  test('Returns true when given a directory path', () => {
    expect(safeIsDirectory(__dirname)).toBeTruthy()
  })

})

describe('#safeReadSync', () => {
  test('Returns empty array with no args', () => {
    expect(safeReadSync().length).toEqual(0)
  })

  test('Returns empty array when given a file path', () => {
    expect(safeReadSync(__dirname + '/' + __filename).length).toEqual(0)
  })

  test('Returns non empty array when given a directory path', () => {
    expect(safeReadSync(__dirname).length).toBeGreaterThan(0)
  })

})

describe('#safeExtname', () => {
  test('Returns empty string with no args', () => {
    expect(safeExtname()).toEqual('')
  })

  test('Returns empty string when given a file path', () => {
    expect(safeExtname(__dirname)).toEqual('')
  })

  test('Returns non empty array when given a directory path', () => {
    expect(safeExtname('file.js')).toEqual('.js')
  })

})

describe('#isJsFile', () => {
  test('Returns false with no args', () => {
    expect(isJsFile()).toBeFalsy()
  })

  test('Returns false with a non js file', () => {
    expect(isJsFile('bob.txt')).toBeFalsy()
  })

  test('Returns false with no ext to compare', () => {
    expect(isJsFile('bob')).toBeFalsy()
  })

  test('Returns false with a ts file', () => {
    expect(isJsFile('bob.ts')).toBeFalsy()
  })

  test('Returns true with a js file', () => {
    expect(isJsFile('bob.js')).toBeTruthy()
  })

})

describe('#hasIndexFile', () => {
  test('Returns false when no index.js file present', () => {
    let inf = hasIndexFile(__dirname)
    expect(inf).toBeFalsy()
  })
  test('Returns true when index.js file present', () => {
    let inf = hasIndexFile(join(__dirname, '../../', "test_mocks/common/fileMethods/hasIndexFile"))
    expect(inf).toBeTruthy()
  })
})

describe('#valueOnPredicate', () => {
  let vop = valueOnPredicate((arg) => {
    return arg === 'Hello'
  })
  test('Throws when not given a function', () => {
    expect(()=> { valueOnPredicate() }).toThrow()
  })
  test('Returns a new function', () => {
    expect(isFunction(vop)).toBeTruthy()
  })
  test('Returns false when the predicate function returns false given a value.', () => {
    expect(vop('Goodbye')).toBeFalsy()
  })
  test('Returns value when the predicate function returns true given a value.', () => {
    expect(vop('Hello')).toEqual('Hello')
  })
});