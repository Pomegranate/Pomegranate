module.exports = (Env) => {
  return {
    config: {
      disabled: false,
      logLevel: 1,
      logFormat: ['cyan'],
      additionalDepends: []
    },
    variables: {
      overriderName: 'OverridesC-FromFile'
    }
  }
}