/**
 * @file Runner
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project @framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {Pomegranate} from './Pomegranate'
import {PomegranateConfiguration} from "./Configuration";


function closeTimer(){
  setTimeout(() => {
    console.log('Stop guard detected Pomegranate failing to stop on time. Forcibly exiting.')
    process.exit(1)
  }, 2000)
}


function HandleSignal(signal) {
  return function(err) {
    closeTimer()
  }
}





export const Run = async (settings: PomegranateConfiguration, workingDirectory = process.cwd()) => {

  let handled = false
  let Pom
  try {
    Pom = await Pomegranate(workingDirectory, settings)
  }
  catch(e){
    console.log(e)
    console.log('Pomegranate failed to instantiate.')
    process.exit(1)
  }

  function HandleSignal(signal) {
    return function(err) {
      if(handled) {
        return
      }
      handled = true
      if(err) {
        Pom.externalLog('log', err)
      }
      Pom.externalLog('log',`Caught ${signal}, attempting to stop Pomegranate gracefully.`)

      // let t = setTimeout(function() {
      //   console.log('whoops')
      //   Pom.stop()
      //     .then((r) => {
      //       process.exit(1)
      //       return null
      //     })
      // }, 1000)

      if(Pom) {
        return Pom.stop()
          .then((r) => {
            // clearTimeout(t)
            process.exit(0)
            return null
          })
      }

    }
  }

  process.on('SIGHUP', HandleSignal('SIGHUP'))
  process.on('SIGINT', HandleSignal('SIGINT'))
  process.on('SIGQUIT', HandleSignal('SIGQUIT'))
  process.on('SIGABRT', HandleSignal('SIGABRT'))
  process.on('SIGTERM', HandleSignal('SIGTERM'))
  process.on('uncaughtException', HandleSignal('UncaughtException'))
  process.on('beforeExit', async () => {
    if(handled) {
      return
    }
    handled = true
    await Pom.stop()
  })

  Pom.events.on('lateError', async (msg) => {
    await Pom.stop()
    Pom.externalLog('error', `Received lateError event from ${msg.name}, attempted to stop gracefully.`)
    process.exit(1)
  })

  return {
    start: async () => {
      try{
        await Pom.load()
      }
      catch(err){
        console.log(err)
        return
      }
      try {
        let results = await Pom.start()
        if (results.isFailed){
          await Pom.stop()
          process.exit(0)
        }
      }
      catch(err){
        console.log(err)
        return
      }
    },
    stop: async () => {
      await Pom.stop()
    }
  }


}