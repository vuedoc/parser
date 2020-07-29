/* eslint-disable quote-props */

module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'airbnb-base'
  ],
  'rules': {
    'comma-dangle': 'off',
    'semi': 'off',
    'prefer-template': 'off',
    'class-methods-use-this': 'error',
    'block-scoped-var': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-lonely-if': 'error',
    'no-plusplus': 'off',
    'max-len': [
      'error',
      {
        code: 150,
        comments: 150,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true
      }
    ],
    'complexity': [ 'error', { max: 40 } ],
    'no-use-before-define': [
      'error',
      {
        classes: false,
        variables: false
      }
    ],
    'arrow-parens': [ 'error', 'always' ],
    'arrow-body-style': 'off',
    'guard-for-in': 'off',
    'no-nested-ternary': 'off',
    'object-curly-newline': 'off',
    'array-bracket-spacing': [ 'error', 'always' ],
    'no-param-reassign': 'off',
    'default-case': 'off',
    'no-shadow': 'off',
    'no-restricted-syntax': 'off',
    'no-prototype-builtins': 'off',
    'space-before-function-paren': 'off',
    'no-var': 'error'
  }
}
