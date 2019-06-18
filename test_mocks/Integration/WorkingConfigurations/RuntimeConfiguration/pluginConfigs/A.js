module.exports = (Env) => {
  return {
    config: {
      disabled: false,
      // logLevel: 1,
      additionalDependencies: ['B']
    },
    variables: {
      a: 1,
      b: 9,
      c: 'derp'
    }
  }
}