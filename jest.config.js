module.exports = {
  preset: 'ts-jest',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: 'node',
  testMatch: null,
  testRegex: "(/test/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  collectCoverage: false,
  clearMocks: true,
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
};