const parser = require('..')

/* global describe beforeAll it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

const filecontent = `
  <script>
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    import Vue from 'vue';
    import Component from 'vue-class-component';
    /**
     * A class component element
     *
     * @author Jon Snow
     */
    let App = class App extends Vue {
      /**
       * A class component element
       *
       * @author Jon Snow
       */
      constructor() {
        super(...arguments);

        /**
         * data msg description
         */
        this.msg = 'Hello';

        /**
         * data helloMsg with expression
         */
        this.helloMsg = 'Hello, ' + this.name;

        /**
         * event constructor description
         */
        this.$emit('created')
      }

      // lifecycle hook
      mounted() {
        this.greet();

        /**
         * event mounted description
         */
        this.$emit('mounted')
      }

      /**
       * computed computedMsg description
       */
      get computedMsg() {
        return 'computed ' + this.msg;
      }

      /**
       * method description
       */
      greet() {
        alert('greeting: ' + this.msg);
      }

      static ignoredMethod() {}
    };
    App = __decorate([
      Component({
        props: {
          /**
           * prop name description
           */
          name: String
        }
      })
    ], App);
    export default App;
  </script>
`

const expected = {
  description: 'A class component element',
  inheritAttrs: false,
  keywords: [
    {
      name: 'author',
      description: 'Jon Snow' }
  ],
  events: [
    { kind: 'event',
      name: 'created',
      arguments: [],
      description: 'event constructor description',
      keywords: [],
      visibility: 'public' },
    { kind: 'event',
      name: 'mounted',
      arguments: [],
      description: 'event mounted description',
      keywords: [],
      visibility: 'public' }
  ],
  methods: [
    { kind: 'method',
      name: 'greet',
      params: [],
      description: 'method description',
      keywords: [],
      visibility: 'public',
      return: {
        description: null,
        type: 'void'
      } }
  ],
  computed: [
    { kind: 'computed',
      name: 'computedMsg',
      dependencies: [ 'msg' ],
      description: 'computed computedMsg description',
      keywords: [],
      visibility: 'public' }
  ],
  data: [
    {
      kind: 'data',
      name: 'msg',
      type: 'string',
      description: 'data msg description',
      initial: 'Hello',
      keywords: [],
      visibility: 'public' },
    {
      kind: 'data',
      name: 'helloMsg',
      type: 'BinaryExpression',
      description: 'data helloMsg with expression',
      initial: '\'Hello, \' + this.name',
      keywords: [],
      visibility: 'public' }
  ],
  props: [
    { kind: 'prop',
      name: 'name',
      type: 'String',
      nativeType: 'string',
      required: false,
      default: '__undefined__',
      describeModel: false,
      description: 'prop name description',
      keywords: [],
      visibility: 'public' }
  ],
  slots: []
}

describe('#37 - Class Component', () => {
  let component = null

  beforeAll(() => {
    const options = { filecontent }

    return parser.parse(options).then((definition) => {
      component = definition
    })
  })

  Object.keys(expected).forEach((key) => {
    it(`should successfully parse ${key}`, () => {
      expect(component[key]).toEqual(expected[key])
    })
  })
})
