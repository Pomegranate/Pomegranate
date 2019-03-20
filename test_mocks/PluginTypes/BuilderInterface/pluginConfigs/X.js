module.exports = (Env) => {
  return {
    config: {
      disabled: false,
      // logLevel: 1,
      additionalDepends: [],
      logFormat: {
        log: ['greenBright'],
        warn: ['yellowBright'],
        info: ['cyanBright'],
        error: ['redBright']
      }
    },
    variables: {
      a: 10,
      b: 20,
      c: 30
    }
  }
}