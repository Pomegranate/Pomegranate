/**
 * @file WorkingConfigurations
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {Run} from "../../src";
import {readdirSync} from 'fs-extra'
import {join} from 'path'
import {normalize} from 'path'
import {each} from 'lodash/fp'
const mockDirectory = normalize(`${__dirname}/../../test_mocks/Integration/WorkingConfigurations`)
const fileList = readdirSync(mockDirectory)

describe('Pomegranate Functionality', () => {
  each((filePath) => {
    test(filePath, async () => {
      let AppDirectory =  join(mockDirectory, filePath)
      let settings = require(join(AppDirectory, 'PomegranateSettings.js'))
      let Pom = await Run(settings, AppDirectory)
      await Pom.start()
      await Pom.stop()
    })
  }, fileList)
});
