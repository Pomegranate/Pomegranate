module.exports = function(Env) {
  return {
    Multiple1: {
      config: {
        disabled: false,
        // logLevel: 4
      },
      variables: {
        name: 'Multiple1'
      }
    },
    Multiple2: {
      config: {
        disabled: false,
        // logLevel: 4
      },
      variables: {
       name: 'Multiple2'
      }
    },
    Multiple3: {
      Child1: {
        config: {
          disabled: false,
          // logLevel: 4
        },
        variables: {
          name: 'Child1'
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