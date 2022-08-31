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
