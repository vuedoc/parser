const vuedoc = require('..')

const { Parser } = require('../lib/parser/Parser')

/* global describe it expect */
/* eslint-disable quote-props */
/* eslint-disable indent */

/**
 * Code samples from lukehoban/es6features
 * @see https://github.com/lukehoban/es6features
 */
const Features = {
  'Arrows': `
    // Expression bodies
    var odds = evens.map(v => v + 1);
    var nums = evens.map((v, i) => v + i);
    var pairs = evens.map(v => ({even: v, odd: v + 1}));

    // Statement bodies
    nums.forEach(v => {
      if (v % 5 === 0)
        fives.push(v);
    });

    // Lexical this
    var bob = {
      _name: "Bob",
      _friends: [],
      printFriends() {
        this._friends.forEach(f =>
          console.log(this._name + " knows " + f));
      }
    }
  `,
  'Enhanced Object Literals': `
    var obj = {
      // __proto__
      __proto__: theProtoObj,
      // Shorthand for ‘handler: handler’
      handler,
      // Methods
      toString() {
      // Super calls
      return "d " + super.toString();
      },
      // Computed (dynamic) property names
      [ 'prop_' + (() => 42)() ]: 42
    };
  `,
  'Template Strings': `
    // Basic literal string creation
    \`In JavaScript '\n' is a line-feed.\`

    // Multiline strings
    \`In JavaScript this is
    not legal.\`

    // String interpolation
    var name = "Bob", time = "today";
    \`Hello \${name}, how are you \${time}?\`

    // Construct an HTTP request prefix is used to interpret the replacements and construction
    POST\`http://foo.org/bar?a=\${a}&b=\${b}
        Content-Type: application/json
        X-Credentials: \${credentials}
        { "foo": \${foo},
          "bar": \${bar}}\`(myOnReadyStateChangeHandler);
  `,
  'Destructuring': `
    // list matching
    var [a, , b] = [1,2,3];

    // object matching
    var { op: a, lhs: { op: b }, rhs: c }
          = getASTNode()

    // object matching shorthand
    // binds op, lhs and rhs in scope
    var {op, lhs, rhs} = getASTNode()

    // Can be used in parameter position
    function g({name: x}) {
      console.log(x);
    }
    g({name: 5})

    // Fail-soft destructuring
    var [a] = [];
    a === undefined;

    // Fail-soft destructuring with defaults
    var [a = 1] = [];
    a === 1;
  `,
  'Default': `
    function f(x, y=12) {
      // y is 12 if not passed (or passed as undefined)
      return x + y;
    }
    f(3) == 15
  `,
  'Rest': `
    function f(x, ...y) {
      // y is an Array
      return x * y.length;
    }
    f(3, "hello", true) == 6
  `,
  'Spread': `
    function f(x, y, z) {
      return x + y + z;
    }
    // Pass each elem of array as argument
    f(...[1,2,3]) == 6
  `,
  'Let + Const': `
    function f() {
      {
        let x;
        {
          // okay, block scoped name
          const x = "sneaky";
          // error, const
          x = "foo";
        }
      }
    }
  `,
  'Iterators + For..Of': `
    let fibonacci = {
      [Symbol.iterator]() {
        let pre = 0, cur = 1;
        return {
          next() {
            [pre, cur] = [cur, pre + cur];
            return { done: false, value: cur }
          }
        }
      }
    }

    for (var n of fibonacci) {
      // truncate the sequence at 1000
      if (n > 1000)
        break;
      console.log(n);
    }
  `,
  'Generators': `
    var fibonacci = {
      [Symbol.iterator]: function*() {
        var pre = 0, cur = 1;
        for (;;) {
          var temp = pre;
          pre = cur;
          cur += temp;
          yield cur;
        }
      }
    }

    for (var n of fibonacci) {
      // truncate the sequence at 1000
      if (n > 1000)
        break;
      console.log(n);
    }
  `,
  'Unicode': `
    // same as ES5.1
    "𠮷".length == 2

    // new RegExp behaviour, opt-in ‘u’
    "𠮷".match(/./u)[0].length == 2

    // new form
    "\u{20BB7}"=="𠮷"=="\uD842\uDFB7"

    // new String ops
    "𠮷".codePointAt(0) == 0x20BB7

    // for-of iterates code points
    for(var c of "𠮷") {
      console.log(c);
    }
  `,
  'Modules': `
    // lib/math.js
    export function sum(x, y) {
      return x + y;
    }
    export var pi = 3.141593;

    // app.js
    import * as math from "lib/math";

    // otherApp.js
    import {sum as sum2, pi as pi2} from "lib/math";

    // lib/mathplusplus.js
    export * from "lib/math";
    export var e = 2.71828182846;
    export default function(x) {
        return Math.log(x);
    }

    import ln, {pi3, e2} from "lib/mathplusplus";

    alert("2π = " + sum(pi, pi));
    alert("2π = " + math.sum(math.pi, math.pi));
  `,
  'Module Loaders': `
    // Dynamic loading – ‘System’ is default loader
    System.import('lib/math').then(function(m) {
      alert("2π = " + m.sum(m.pi, m.pi));
    });

    // Create execution sandboxes – new Loaders
    var loader = new Loader({
      global: fixup(window) // replace ‘console.log’
    });
    loader.eval("console.log('hello world!');");

    // Directly manipulate module cache
    System.get('jquery');
    System.set('jquery', Module({$: $})); // WARNING: not yet finalized
  `,
  'Map + Set + WeakMap + WeakSet': `
    // Sets
    var s = new Set();
    s.add("hello").add("goodbye").add("hello");
    s.size === 2;
    s.has("hello") === true;

    // Maps
    var m = new Map();
    m.set("hello", 42);
    m.set(s, 34);
    m.get(s) == 34;

    // Weak Maps
    var wm = new WeakMap();
    wm.set(s, { extra: 42 });
    wm.size === undefined

    // Weak Sets
    var ws = new WeakSet();
    ws.add({ data: 42 });
  `,
  'Proxies': `
    // Proxying a normal object
    var target = {};
    var handler = {
      get: function (receiver, name) {
        return \`Hello, \${name}!\`;
      }
    };

    var p = new Proxy(target, handler);
    p.world === 'Hello, world!';

    // Proxying a function object
    var target = function () { return 'I am the target'; };
    var handler = {
      apply: function (receiver, ...args) {
        return 'I am the proxy';
      }
    };

    var p = new Proxy(target, handler);
    p() === 'I am the proxy';
  `,
  'Symbols': `
    var MyClass = (function() {
      // module scoped symbol
      var key = Symbol("key");

      function MyClass(privateData) {
        this[key] = privateData;
      }

      MyClass.prototype = {
        doStuff: function() {
          this[key]
        }
      };

      return MyClass;
    })();

    var c = new MyClass("hello")
    c["key"] === undefined
  `,
  'Subclassable Built-ins': `
    // Pseudo-code of Array
    class Array {
        constructor(...args) { /* ... */ }
        static [Symbol.create]() {
            // Install special [[DefineOwnProperty]]
            // to magically update 'length'
        }
    }

    // User code of Array subclass
    class MyArray extends Array {
        constructor(...args) { super(...args); }
    }

    // Two-phase 'new':
    // 1) Call @@create to allocate object
    // 2) Invoke constructor on new instance
    var arr = new MyArray();
    arr[1] = 12;
    arr.length == 2
  `,
  'Math + Number + String + Array + Object APIs': `
    Number.EPSILON
    Number.isInteger(Infinity) // false
    Number.isNaN("NaN") // false

    Math.acosh(3) // 1.762747174039086
    Math.hypot(3, 4) // 5
    Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2) // 2

    "abcde".includes("cd") // true
    "abc".repeat(3) // "abcabcabc"

    Array.from(document.querySelectorAll('*')) // Returns a real Array
    Array.of(1, 2, 3) // Similar to new Array(...), but without special one-arg behavior
    [0, 0, 0].fill(7, 1) // [0,7,7]
    [1, 2, 3].find(x => x == 3) // 3
    [1, 2, 3].findIndex(x => x == 2) // 1
    [1, 2, 3, 4, 5].copyWithin(3, 0) // [1, 2, 3, 1, 2]
    ["a", "b", "c"].entries() // iterator [0, "a"], [1,"b"], [2,"c"]
    ["a", "b", "c"].keys() // iterator 0, 1, 2
    ["a", "b", "c"].values() // iterator "a", "b", "c"

    Object.assign(Point, { origin: new Point(0,0) })
  `,
  'Binary and Octal Literals': `
    0b111110111 === 503 // true
    0o767 === 503 // true
  `,
  'BigInt': `
    const theBiggestInt = 9007199254740991n;

    const alsoHuge = BigInt(9007199254740991);
    // ↪ 9007199254740991n

    const hugeString = BigInt("9007199254740991");
    // ↪ 9007199254740991n

    const hugeHex = BigInt("0x1fffffffffffff");
    // ↪ 9007199254740991n

    const hugeBin = BigInt("0b11111111111111111111111111111111111111111111111111111");
    // ↪ 9007199254740991n
  `,
  'Promises': `
    function timeout(duration = 0) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
      })
    }

    var p = timeout(1000).then(() => {
      return timeout(2000);
    }).then(() => {
      throw new Error("hmm");
    }).catch(err => {
      return Promise.all([timeout(100), timeout(200)]);
    })
  `,
  'Tail Calls': `
    function factorial(n, acc = 1) {
      if (n <= 1) return acc;
      return factorial(n - 1, n * acc);
    }

    // Stack overflow in most implementations today,
    // but safe on arbitrary inputs in ES6
    factorial(100000)
  `,
  'Logical Operators and Assignment Expressions': `
    // "Or Or Equals" (or, the Mallet operator :wink:)
    a ||= b;
    a || (a = b);

    // "And And Equals"
    a &&= b;
    a && (a = b);
  `,
  'Numeric Separators': `
    let x = 1_000_000_000   // Ah, so a billion
    let y = 101_475_938.38  // And this is hundreds of millions

    let fee = 123_00;       // $123 (12300 cents, apparently)
        fee = 12_300;       // $12,300 (woah, that fee!)
    let amount = 12345_00;  // 12,345 (1234500 cents, apparently)
        amount = 123_4500;  // 123.45 (4-fixed financial)
        amount = 1_234_500; // 1,234,500
  `
}

function testPropertyFunction (property) {
  describe(`should parse ${property} without errors`, () => {
    describe('es2015', () => {
      Object.keys(Features).forEach((feature) => it(feature, (done) => {
        const script = `
          export default {
            ${property}: function () {
              ${Features[feature]}

              return {}
            }
          }
        `
        const source = { script }
        const options = { source }
        const parser = new Parser(options)

        parser.on('end', done)
        parser.walk()
      }))
    })

    describe('es6', () => {
      Object.keys(Features).forEach((feature) => it(feature, (done) => {
        const script = `
          export default {
            ${property} () {
              ${Features[feature]}

              return {}
            }
          }
        `
        const source = { script }
        const options = { source }
        const parser = new Parser(options)

        parser.on('end', done)
        parser.walk()
      }))
    })

    describe('arrow', () => {
      Object.keys(Features).forEach((feature) => it(feature, (done) => {
        const script = `
          export default {
            ${property}: () => {
              ${Features[feature]}

              return {}
            }
          }
        `
        const source = { script }
        const options = { source }
        const parser = new Parser(options)

        parser.on('end', done)
        parser.walk()
      }))
    })
  })
}

function testPropertyObject (property) {
  describe(`should parse ${property} without errors`, () => {
    describe('es2015', () => {
      Object.keys(Features).forEach((feature) => it(feature, (done) => {
        const script = `
          export default {
            ${property}: {
              x: function () {
                ${Features[feature]}

                return {}
              }
            }
          }
        `
        const source = { script }
        const options = { source }
        const parser = new Parser(options)

        parser.on('end', done)
        parser.walk()
      }))
    })

    describe('es6', () => {
      Object.keys(Features).forEach((feature) => it(feature, (done) => {
        const script = `
          export default {
            ${property}: {
              x () {
                ${Features[feature]}

                return {}
              }
            }
          }
        `
        const source = { script }
        const options = { source }
        const parser = new Parser(options)

        parser.on('end', done)
        parser.walk()
      }))
    })

    describe('arrow', () => {
      Object.keys(Features).forEach((feature) => it(feature, (done) => {
        const script = `
          export default {
            ${property}: {
              x: () => {
                ${Features[feature]}

                return {}
              }
            }
          }
        `
        const source = { script }
        const options = { source }
        const parser = new Parser(options)

        parser.on('end', done)
        parser.walk()
      }))
    })
  })
}

describe('ECMAScript Features Parsing', () => {
  describe('should parse without errors', () => {
    Object.keys(Features).forEach((feature) => it(feature, (done) => {
      const script = Features[feature]
      const source = { script }
      const options = { source }
      const parser = new Parser(options)

      parser.on('end', done)
      parser.walk()
    }))
  })

  testPropertyFunction('name')
  testPropertyFunction('beforeRouteEnter')
  testPropertyFunction('beforeRouteUpdate')
  testPropertyFunction('beforeRouteLeave')
  testPropertyFunction('beforeCreate')
  testPropertyFunction('created')
  testPropertyFunction('beforeMount')
  testPropertyFunction('mounted')
  testPropertyFunction('beforeUpdate')
  testPropertyFunction('updated')
  testPropertyFunction('beforeDestroy')
  testPropertyFunction('destroyed')
  testPropertyFunction('render')
  testPropertyObject('props')
  testPropertyObject('methods')
  testPropertyObject('computed')

  describe('Destructuring', () => {
    it('should successfully extract destructuring vars', () => {
      const filecontent = `
        <script>
          export default {
            data: () => {
              var [ a, , b ] = [1,2,3];
              var [ c ] = [];
              var [ d = 4 ] = [];
              var { e } = { e: 5 };
              var { f } = {};
              var { g = 6 } = {};
              var [ h ] = getValue();
              var { i } = getValue();

              return { a, b, c, d, e, f, g, h, i }
            }
          }
        </script>
      `
      const features = [ 'data' ]
      const options = { filecontent, features }
      const expected = [
        { kind: 'data',
          visibility: 'public',
          name: 'a',
          description: '',
          type: 'number',
          initial: 1,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'b',
          description: '',
          type: 'number',
          initial: 3,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'c',
          description: '',
          type: 'undefined',
          initial: undefined,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'd',
          description: '',
          type: 'number',
          initial: 4,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'e',
          description: '',
          type: 'number',
          initial: 5,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'f',
          description: '',
          type: 'undefined',
          initial: undefined,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'g',
          description: '',
          type: 'number',
          initial: 6,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'h',
          description: '',
          type: '__undefined__',
          initial: '__undefined__',
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'i',
          description: '',
          type: '__undefined__',
          initial: '__undefined__',
          keywords: [] }
      ]

      return vuedoc.parse(options).then(({ data }) => {
        expect(data).toEqual(expected)
      })
    })
  })

  describe('Symbols', () => {
    it('should successfully extract Symbols vars', () => {
      const filecontent = `
        <script>
          export default {
            data: () => {
              var a = Symbol("key");

              return { a }
            }
          }
        </script>
      `
      const features = [ 'data' ]
      const options = { filecontent, features }
      const expected = [
        { kind: 'data',
          visibility: 'public',
          name: 'a',
          description: '',
          type: 'CallExpression',
          initial: 'Symbol("key")',
          keywords: [] }
      ]

      return vuedoc.parse(options).then(({ data }) => {
        expect(data).toEqual(expected)
      })
    })
  })

  describe('Binary and Octal Literals', () => {
    it('should successfully extract Binary and Octal Literals vars', () => {
      const filecontent = `
        <script>
          export default {
            data: () => {
              var a = 0b111110111
              var b = 0o767

              return { a, b }
            }
          }
        </script>
      `
      const features = [ 'data' ]
      const options = { filecontent, features }
      const expected = [
        { kind: 'data',
          visibility: 'public',
          name: 'a',
          description: '',
          type: 'number',
          initial: 0b111110111,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'b',
          description: '',
          type: 'number',
          initial: 0o767,
          keywords: [] }
      ]

      return vuedoc.parse(options).then(({ data }) => {
        expect(data).toEqual(expected)
      })
    })
  })

  describe('BigInt', () => {
    it('should successfully extract BigInt vars', () => {
      const filecontent = `
        <script>
          export default {
            data: () => {
              const a = 9007199254740991n;
              const b = BigInt(9007199254740991);
              const c = BigInt("9007199254740991");

              return { a, [b]: b, ['c']: c, d: BigInt("9007199254740992") }
            }
          }
        </script>
      `
      const features = [ 'data' ]
      const options = { filecontent, features }
      const expected = [
        { kind: 'data',
          visibility: 'public',
          name: 'a',
          description: '',
          type: 'bigint',
          initial: '9007199254740991n',
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'b',
          description: '',
          type: 'CallExpression',
          initial: 'BigInt(9007199254740991)',
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'c',
          description: '',
          type: 'CallExpression',
          initial: 'BigInt("9007199254740991")',
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'd',
          description: '',
          type: 'CallExpression',
          initial: 'BigInt("9007199254740992")',
          keywords: [] }
      ]

      return vuedoc.parse(options).then(({ data }) => {
        expect(data).toEqual(expected)
      })
    })
  })

  describe('Logical Operators and Assignment Expressions', () => {
    it('should successfully parse Logical Operators and Assignment Expressions', () => {
      const filecontent = `
        <script>
          export default {
            data: () => {
              let a = true, b = false;

              // "Or Or Equals" (or, the Mallet operator :wink:)
              let c = a ||= b;
              let d = a || (a = b);

              // "And And Equals"
              let e = a &&= b;
              let f = a && (a = b);

              return { a, b, c, d, e, f }
            }
          }
        </script>
      `
      const features = [ 'data' ]
      const options = { filecontent, features }
      const expected = [
        { kind: 'data',
          visibility: 'public',
          name: 'a',
          description: '',
          type: 'boolean',
          initial: true,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'b',
          description: '',
          type: 'boolean',
          initial: false,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'c',
          description: '',
          type: 'AssignmentExpression',
          initial: 'a ||= b',
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'd',
          description: '',
          type: 'LogicalExpression',
          initial: 'a || (a = b)',
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'e',
          description: '',
          type: 'AssignmentExpression',
          initial: 'a &&= b',
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'f',
          description: '',
          type: 'LogicalExpression',
          initial: 'a && (a = b)',
          keywords: [] }
      ]

      return vuedoc.parse(options).then(({ data }) => {
        expect(data).toEqual(expected)
      })
    })
  })

  describe('Numeric Separators', () => {
    it('should successfully parse Numeric Separators', () => {
      const filecontent = `
        <script>
          export default {
            data: () => {
              let x = 1_000_000_000;
              let y = 101_475_938.38;

              let a = 123_00;
              let b = 12_300;
              let c = 12345_00;
              let d = 123_4500;
              let e = 1_234_500;

              return { x, y, a, b, c, d, e }
            }
          }
        </script>
      `
      const features = [ 'data' ]
      const options = { filecontent, features }
      const expected = [
        { kind: 'data',
          visibility: 'public',
          name: 'x',
          description: '',
          type: 'number',
          initial: 1000000000,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'y',
          description: '',
          type: 'number',
          initial: 101475938.38,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'a',
          description: '',
          type: 'number',
          initial: 12300,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'b',
          description: '',
          type: 'number',
          initial: 12300,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'c',
          description: '',
          type: 'number',
          initial: 1234500,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'd',
          description: '',
          type: 'number',
          initial: 1234500,
          keywords: [] },
        { kind: 'data',
          visibility: 'public',
          name: 'e',
          description: '',
          type: 'number',
          initial: 1234500,
          keywords: [] }
      ]

      return vuedoc.parse(options).then(({ data }) => {
        expect(data).toEqual(expected)
      })
    })
  })
})
