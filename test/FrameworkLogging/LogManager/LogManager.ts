/**
 * @file LogManager
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {PomLogManager} from "../../../src/Framework/FrameworkLogger/LogManager";

describe('Log Manager', () => {
  test('inputs', () => {
    let LogManager = PomLogManager()
    LogManager.addHandler((message, metadata) => {
      // console.log(message)
      // console.log(metadata)
    })

    let a = LogManager.createLogger({source: 'a'})
    let b = LogManager.createLogger({source: 'b'})
    a.log('log', {data: true}, [1,2,3,4])

    expect(() => {
      // @ts-ignore
      LogManager.createLogger({})
    }).toThrow()

  })
  test('log', () => {
    let LogManager = PomLogManager({logFormat: {log:['green'], warn: ['yellow', 'bold'], info: ['cyan', 'bold'], error: ['red', 'bold']}})
    LogManager.addHandler(({severity, verbocity, messages}, {source, logLevel, logFormat}) => {
      expect(severity).toEqual('log')
      expect(verbocity).toEqual(1)
      expect(messages.length).toEqual(3)
      expect(source).toEqual('test')
      expect(logLevel).toEqual(4)
      expect(logFormat).toEqual({log:['green', 'bold'], warn: ['yellow', 'bold'], info: ['cyan', 'bold'], error: ['red', 'bold']})
    })

    let log = LogManager.createLogger({source: 'test',logLevel: 4, logFormat: {log:['green', 'bold']}})
    log.log('log', {data: true}, [1,2,3,4])

  })
  test('warn', () => {
    let LogManager = PomLogManager()
    LogManager.addHandler(({severity, verbocity, messages}, {source}) => {
      expect(source).toEqual('test')
      expect(severity).toEqual('warn')
      expect(verbocity).toEqual(1)
      expect(messages.length).toEqual(3)
    })

    let log = LogManager.createLogger({source: 'test',logLevel: 4, logFormat: {log:['green', 'bold']}})
    log.warn('warn',{data: true}, [1,2,3,4])

  })
  test('info', () => {
    let LogManager = PomLogManager()
    LogManager.addHandler(({severity, verbocity, messages}, {source}) => {
      expect(source).toEqual('test')
      expect(severity).toEqual('info')
      expect(verbocity).toEqual(1)
      expect(messages.length).toEqual(3)
    })

    let log = LogManager.createLogger({source: 'test',logLevel: 4, logFormat: {log:['green', 'bold']}})
    log.info('info',{data: true}, [1,2,3,4])

  })
  test('error', () => {
    let LogManager = PomLogManager()
    LogManager.addHandler(({severity, verbocity, messages}, {source}) => {
      expect(source).toEqual('test')
      expect(severity).toEqual('error')
      expect(verbocity).toEqual(1)
      expect(messages.length).toEqual(3)

    })

    let log = LogManager.createLogger({source: 'test',logLevel: 4, logFormat: {log:['green', 'bold']}})
    log.error('error',{data: true}, [1,2,3,4])

  })
});