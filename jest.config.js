export default {
  expand: true,
  notify: false,
  transform: {},
  testMatch: [
    '<rootDir>/test/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'index.js',
    'lib/**',
    'schema/**',
    'loader/**'
  ],
  moduleFileExtensions: [
    'js',
    'json'
  ]
}
