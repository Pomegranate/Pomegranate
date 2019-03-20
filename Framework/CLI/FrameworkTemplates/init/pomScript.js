"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = `
/*
 * Pomegranate Application: {{AppName}}
 * Created On: {{CreateDate}}
 *
 * Pomegranate application start up.
 *
 */

'use strict';

// WARNING CHANGE BEFORE RELEASE

let {RunPomegranate} = require('@pomegranate/frameworkk')

let PomSettings = require(./PomegranateSettings')

async function startPomegranate(){
  const Pom = await RunPomegranate(PomSettings)
  Pom.start()
}

startPomegranate()

`;
//# sourceMappingURL=pomScript.js.map