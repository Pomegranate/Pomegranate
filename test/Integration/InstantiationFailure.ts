/**
 * @file WorkingConfigurations
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Pomegranate} from "../../src";
import {readdirSync} from 'fs-extra'
import {join} from 'path'
import {normalize} from 'path'
import {each} from 'lodash/fp'

const mockDirectory = normalize(`${__dirname}/../../test_mocks/Integration/InstantiationFailure`)
const fileList = readdirSync(mockDirectory)


describe('Pomegranate Instantiation failures ', () => {
  each((filePath) => {
    test(filePath, async () => {

      let mockLogger = {
        log: jest.fn(() => {}),
        warn: jest.fn(() => {}),
        info: jest.fn(() => {}),
        error: jest.fn(() => {})
      }

      let AppDirectory = join(mockDirectory, filePath)
      let settings = require(join(AppDirectory, 'PomegranateSettings.js'))
      settings.logger = mockLogger
      try {
        let Pom = await Pomegranate(AppDirectory, settings)
      } catch (e) {
        expect(e).toEqual(expect.any(Error))
      }
      expect(mockLogger.log.mock.calls.length).toEqual(0)
      expect(mockLogger.warn.mock.calls.length).toEqual(0)
      expect(mockLogger.info.mock.calls.length).toEqual(0)
      expect(mockLogger.error.mock.calls.length).toEqual(1)
    })
  }, fileList)
});
