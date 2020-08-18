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
    name: 'Unknown type',
    values: [
      '?'
    ],
    expected: [
      'unknow'
    ]
  },
  {
    name: 'Symbol name (name expression)',
    values: [
      '  string ',
      'boolean',
      'myNamespace.MyClass',
      'PromiseLike<string>',
      'HTMLElement'
    ],
    expected: [
      'string',
      'boolean',
      'myNamespace.MyClass',
      'PromiseLike<string>',
      'HTMLElement'
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
    name: 'Arrays and objects (type applications and record types)',
    values: [
      'Array<number>',
      'Array.<MyClass>',
      'MyClass[]',
      'Object.<string, number>',
      'Object.<string, number>'
    ],
    get expected() {
      return this.values;
    }
  },
  {
    name: 'Closure syntax',
    values: [
      'function(string, boolean): number'
    ],
    get expected() {
      return this.values;
    }
  },
  {
    name: 'TypeScript syntax',
    values: [
      '(s: string, b: boolean) => number'
    ],
    get expected() {
      return this.values;
    }
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
];
