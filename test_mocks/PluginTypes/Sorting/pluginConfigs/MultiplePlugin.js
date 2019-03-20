module.exports = function(Env) {
  return {
    Multiple1: {
      config: {
        disabled: false,
        // logLevel: 4
      },
      variables: {
        name: 'Multiple1-fromfile'
      }
    },
    Multiple2: {
      config: {
        disabled: false,
        // logLevel: 4
      },
      variables: {
       name: 'Multiple2-fromfile'
      }
    },
    Multiple3: {
      Child1: {
        config: {
          disabled: false,
          // logLevel: 4
        },
        variables: {
          name: 'Child1-fromfile'
        }
      },
      // Child2: {
      //   config: {
      //     disabled: false,
      //     logLevel: 4
      //   },
      //   variables: {
      //     name: 'Child2'
      //   }
      // }
    }
  }
}