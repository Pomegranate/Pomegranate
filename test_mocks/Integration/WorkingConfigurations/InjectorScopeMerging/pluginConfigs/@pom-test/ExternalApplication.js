module.exports = (Env) => {
  return {
    External1: {
      config: {
        disabled: false,
        // logLevel: 1,
        additionalDepends: []
      },
      variables: {
        name: 'From the config file'
      }
    }
  }
}