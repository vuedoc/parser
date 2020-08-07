module.exports.JSDocTypeSpec = [
  {
    name: 'Any type',
    values: [
      '*'
    ],
    expected: [
      'any'
    ]
  },
  {
    name: 'Symbol name (name expression)',
    values: [
      '  string ',
      'boolean',
      'myNamespace.MyClass'
    ],
    expected: [
      'string',
      'boolean',
      'myNamespace.MyClass'
    ]
  },
  {
    name: 'Multiple types (type union)',
    values: [
      '(number|boolean)',
      'number|boolean',
      '(string|Array.)',
      'string|Array.',
      '      string |Array. '
    ],
    expected: [
      [ 'number', 'boolean' ],
      [ 'number', 'boolean' ],
      [ 'string', 'Array.' ],
      [ 'string', 'Array.' ],
      [ 'string', 'Array.' ],
    ]
  },
  {
    name: 'Arrays and objects (type applications and record types) ',
    values: [
      'Array.<MyClass>',
      'MyClass[]',
      'Object.<string, number>'
    ]
  },
  {
    name: 'Nullable type ',
    values: [
      '?number'
    ],
    expected: [
      [ 'number', 'null' ]
    ]
  },
  {
    name: 'Non-nullable type',
    values: [
      '!number'
    ],
    expected: [
      'number'
    ]
  },
]
