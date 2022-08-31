<script>
function clone(circles) {
  return circles.map((c) => ({ ...c }));
}

/**
 * Circle Drawer’s goal is, among other things, to test how good the common
 * challenge of implementing an undo/redo functionality for a GUI application
 * can be solved.
 * @name CircleDrawer
 * @usage Click on the canvas to draw a circle. Click on a circle to select it.
 * Right-click on the canvas to adjust the radius of the selected circle.
 * @see https://eugenkiss.github.io/7guis/tasks/#circle
 */
export default {
  props: {
    /**
     * @type Array<{ cx: number; cy: number; r: number; }>
     */
    value: {
      type: Array,
      default: () => [],
    },
    /**
     * The canvas's width
     */
    width: {
      type: [Number, String],
      default: '100%',
    },
    /**
     * The canvas's height
     */
    height: {
      type: [Number, String],
      default: '200',
    },
  },
  data() {
    return {
      /**
       * History object
       */
      history: [[]],
      /**
       * The active history index
       */
      index: 0,
      /**
       * The selected circle
       * @type null | { cx: number; cy: number; r: number; }
       */
      selected: null,
      /**
       * Whether the active circle is adjusted or not
       */
      adjusting: false,
    };
  },
  computed: {
    /**
     * Circles list
     * @type Array<{ cx: number; cy: number; r: number; }>
     */
    circles: {
      get() {
        return this.value;
      },
      set(value) {
        /**
         * @hidden
         */
        this.$emit('input', value);
      },
    },
  },
  methods: {
    /**
     * Handle user click events to draw circle
     */
    onClick({ clientX: x, clientY: y }) {
      if (this.adjusting) {
        this.adjusting = false;
        this.selected = null;
        this.push();

        return;
      }

      this.selected = this.circles.find(({ cx, cy, r }) => {
        const dx = cx - x;
        const dy = cy - y;

        return Math.sqrt(dx * dx + dy * dy) <= r;
      });

      if (!this.selected) {
        this.circles.push({
          cx: x,
          cy: y,
          r: 50,
        });
        this.push();
      }

      /**
       * Emitted when the circle selection change
       * @arg {null | { cx: number; cy: number; r: number; }} selected - Selected circle
       */
      this.$emit('selection-change', this.selected);
    },

    /**
     * Adjust radius of circle
     * @param {{ cx: number; cy: number; r: number; }} circle - The circle object to ajust
     */
    adjust(circle) {
      this.selected = circle;
      this.adjusting = true;
    },

    /**
     * Push the current object state to the history array
     */
    push() {
      this.history.length = ++this.index;
      this.history.push(clone(this.circles));
    },

    /**
     * Undo the last operation
     */
    undo() {
      this.circles = clone(this.history[--this.index]);
    },

    /**
     * Redo the last undo operation
     */
    redo() {
      this.circles = clone(this.history[++this.index]);
    },
  },
};

</script>

<template>
<svg @click="onClick">
  <foreignObject x="0" y="40%" :width="width" :height="height">
    <p class="tip">
      Click on the canvas to draw a circle. Click on a circle to select it.
      Right-click on the canvas to adjust the radius of the selected circle.
    </p>
  </foreignObject>
  <circle
    v-for="circle in circles"
    :cx="circle.cx"
    :cy="circle.cy"
    :r="circle.r"
    :fill="circle === selected ? '#ccc' : '#fff'"
    @click="selected = circle"
    @contextmenu.prevent="adjust(circle)"
  ></circle>
</svg>

<div class="controls">
  <button @click="undo" :disabled="index <= 0">Undo</button>
  <button @click="redo" :disabled="index >= history.length - 1">Redo</button>
</div>

<div class="dialog" v-if="adjusting" @click.stop>
  <p>Adjust radius of circle at ({{ selected.cx }}, {{ selected.cy }})</p>
  <input type="range" v-model="selected.r" min="1" max="300"/>
</div>

</template>

<style>
body {
  margin: 0;
  overflow: hidden;
}

svg {
  width: 100vw;
  height: 100vh;
  background-color: #eee;
}

circle {
  stroke: #000;
}

.controls {
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

.controls button + button {
  margin-left: 6px;
}

.dialog {
  position: fixed;
  top: calc(50% - 50px);
  left: calc(50% - 175px);
  background: #fff;
  width: 350px;
  height: 100px;
  padding: 5px 20px;
  box-sizing: border-box;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
}

.dialog input {
  display: block;
  width: 200px;
  margin: 0px auto;
}

.tip {
  text-align: center;
  padding: 0 50px;
  color: #bbb;
}
</style>