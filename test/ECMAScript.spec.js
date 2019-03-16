const { Parser } = require('../lib/parser/Parser')

/* global describe it */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable quote-props */

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
  `
}

describe('ECMAScript Features', () => {
  describe('should parse ECMAScript features without errors', () => {
    Object.keys(Features).forEach((feature) => it(feature, (done) => {
      const script = Features[feature]
      const source = { script }
      const options = { source }

      const parser = new Parser(options)

      parser.on('end', done)
      parser.walk()
    }))
  })
})
