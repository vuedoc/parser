/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable func-names */
export const myMixin = {
  props: {
    somePropRef: CallsSomeOtherMethod,
  },
  created: function() {
    this.hello();
  },
  methods: {
    hello: function() {
      console.log('hello from mixin!');
    },
  },
};

export default 'MyComponentName';
