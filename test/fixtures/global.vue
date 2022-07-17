<template>
  <div>
    <!-- Template event with @ -->
    <input @input="$emit('template-@-event', $event)"/>

    <!-- Template event with v-on -->
    <input v-on:input="$emit('template-v-on-event', $event)" />

    <label>
      <input :disabled="disabled" type="text" v-model="checkbox"/>
      <!-- Default slot -->
      <slot></slot>
      <!-- Use this slot to set the checkbox label -->
      <slot name="label">Unamed checkbox</slot>
      <!--
        This
        is multiline description
      -->
      <slot name="multiline">Unamed checkbox</slot>
      <slot name="undescribed"></slot>
      <!--
        Slot with defined keywords

        @protected
        @props { name, address, email }
      -->
      <slot name="multiline">Unamed checkbox</slot>
      <template></template>
    </label>
  </div>
</template>

<script>
  const componentName = 'checkboxPointer'
  const aliasName = componentName

  /**
   * The generic component
   * Sub description
   *
   *
   * @public
   * @alpnum azert0 123456789
   * @generic Keyword generic description
   * @multiline Keyword multiline
   *            description
   * @special-char {$[ç(àë£€%µù!,|`_\\<>/_ç^?;.:/!§)]}
   * @punctuations !,?;.:!
   * @operators -/+<>=*%
   *
   * @slot inputs - Use this slot to define form inputs ontrols
   * @slot actions - Use this slot to define form action buttons controls
   * @slot footer - Use this slot to define form footer content.
   */
  export default Vue.extend({
    name: 'checkbox',
    ['name']: componentName,
    model: {
      prop: 'model',
    },
    props: {
      /**
       * The checkbox model
       */
      model: {
        type: Array,
        required: true
      },

      /**
       * Initial checkbox state
       */
      disabled: Boolean,

      /**
       * Initial checkbox value
       */
      checked: {
        type: Boolean,
        default: true
      },

      // Prop with arrow function
      propWithArrow: {
        type: Object,
        default: () => ({ name: 'X'})
      },

      // Prop with object function
      propWithFunction: {
        type: Object,
        default() {
          return { name: 'X' }
        }
      },

      // Prop with anonymous function
      propWithAnonymousFunction: {
        type: Object,
        default: function() {
          return { name: 'X' }
        }
      },

      // Prop with named function
      propWithNamedFunction: {
        type: Object,
        default: function propWithNamedFunction() {
          return { name: 'X' }
        }
      },

      /**
       * Prop with protected visibility
       *
       * @private
       */
      propWithPrivateVisibility: Boolean
    },

    data () {
      const pointer = 'pointed value'

      return {
        int: 12,
        float: 12.2,
        booleanTrue: true,
        booleanFalse: false,
        string: 'Hello',
        string: 'Hello',
        null: null,
        undefined: undefined,
        function: new Function(),
        arrowFunction: () => undefined,
        date: Date.now(),
        pointer: pointer,
        componentName: componentName,
        value: null
      }
    },

    data: {
      int: 13
    },

    computed: {
      id () {
        const name = this.componentName

        return `${name}-${this.pointer}`
      },
      name () {
        return this.componentName
      },
      withoutDependency () {
        return 12
      }
    },

    methods: {
      /**
       * @private
       */
      privateMethod () {
        console.log('check')

        const name = 'check'
        const value = 'event value'

        if (name) {
          console.log('>', name)
        }

        /**
        * Event with identifier name
        */
        this.$emit(name, value)
      },

      /**
      * Check the checkbox
      */
      check () {
        console.log('check')

        let eventName = 'check'
        const value = 'event value'

        if (eventName) {
          console.log('>', eventName)
        }

        eventName = 'renamed'

        /**
        * Event with renamed identifier name
        */
        this.$emit(eventName, value)
      },

      /**
      * @protected
      */
      recursiveIdentifierValue () {
        console.log('check')

        let recursiveValue = 'recursive'
        const value = 'event value'

        if (eventName) {
          const x = 'consequent-var-event'

          console.log('>', eventName)
          this.$emit(x, value)
        }

        if (eventName) {
          console.log('>', eventName)
          this.$emit('if-event', value)
        } else if (value) {
          this.$emit('else-if-event', value)
        } else {
          this.$emit('else-event', 123)
        }

        for (let i = 0; i < 0; i++) {
          this.$emit('for-event', value)
        }

        for (let i of []) {
          this.$emit('for-of-event', value)
        }

        for (let i in {}) {
          this.$emit('for-in-event', value)
        }

        do {
          this.$emit('do-while-event', value)
        } while (false)

        while (false) {
          this.$emit('while-event', value)
        }

        switch (x) {
          case 1:
            this.$emit('switch-case-event', value)
            break

          default:
            this.$emit('switch-case-default-event', value)
            break
        }

        try {
          this.$emit('try-event', value)
        } catch (e) {
          this.$emit('try-catch-event', value)
        } finally {
          this.$emit('try-finally-event', value)
        }

        eventName = recursiveValue

        /**
        * Event with recursive identifier name
        */
        this.$emit(eventName, value, 12)
      },

      uncommentedMethod (a, b = 2, c = this.componentName) {},
      withDefault (f = () => 0) {},
      withAlias (a = aliasName) {},
      withSpread (...args) {},
      withDefaultObject (options = {}) {},
      withDestructuring ({ x, y }) {},
    },

    beforeRouteEnter (to, from, next) {
      next((vm) => {
        /**
         * beforeRouteEnter event description
         */
        vm.$emit('beforeRouteEnter-event', this.value)
      })
    },

    beforeRouteUpdate (to, from, next) {
      next((vm) => {
        /**
         * beforeRouteUpdate event description
         */
        vm.$emit('beforeRouteUpdate-event', this.value)
      })
    },

    beforeRouteLeave (to, from, next) {
      next((vm) => {
        /**
         * beforeRouteLeave event description
         */
        vm.$emit('beforeRouteLeave-event', this.value)
      })
    },

    beforeCreate () {
      /**
       * beforeCreate event description
       */
      this.$emit('beforeCreate-event', this.value)
    },

    created () {
      /**
       * Created event description
       */
      this.$emit('created-event', this.value)
    },

    beforeMount () {
      /**
       * beforeMount event description
       */
      this.$emit('beforeMount-event', this.value)
    },

    mounted () {
      /**
       * mounted event description
       */
      this.$emit('mounted-event', this.value)
    },

    beforeUpdate () {
      /**
       * beforeUpdate event description
       */
      this.$emit('beforeUpdate-event', this.value)
    },

    updated () {
      /**
       * updated event description
       */
      this.$emit('updated-event', this.value)
    },

    beforeDestroy () {
      /**
       * beforeDestroy event description
       */
      this.$emit('beforeDestroy-event', this.value)
    },

    destroyed () {
      /**
       * destroyed event description
       */
      this.$emit('destroyed-event', this.value)
    },

    render (createElement, { props }) {
      /**
       * render event description
       */
      this.$emit('render-event', this.value)
    }
  })
</script>
