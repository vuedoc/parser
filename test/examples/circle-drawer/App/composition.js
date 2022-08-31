import { computed, ref, shallowReactive, toRaw } from 'vue';

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
    modelValue: {
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
  emits: [
    /**
     * Emitted when the circle selection change
     * @arg {null | { cx: number; cy: number; r: number; }} selected - Selected circle
     */
    'selection-change',
  ],
  setup(props, { emit }) {
    /**
     * History object
     */
    const history = shallowReactive([[]]);
    /**
     * The active history index
     */
    const index = ref(0);
    /**
     * Circles list
     * @type Array<{ cx: number; cy: number; r: number; }>
     */
    const circles = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });
    /**
     * The selected circle
     * @type null | { cx: number; cy: number; r: number; }
     */
    const selected = ref(null);
    /**
     * Whether the active circle is adjusted or not
     */
    const adjusting = ref(false);

    /**
     * Handle user click events to draw circle
     */
    function onClick({ clientX: x, clientY: y }) {
      if (adjusting.value) {
        adjusting.value = false;
        selected.value = null;
        push();

        return;
      }

      selected.value = circles.value.find(({ cx, cy, r }) => {
        const dx = cx - x;
        const dy = cy - y;

        return Math.sqrt(dx * dx + dy * dy) <= r;
      });

      if (!selected.value) {
        circles.value.push({
          cx: x,
          cy: y,
          r: 50,
        });
        push();
      }

      this.$emit('selection-change', this.selected);
    }

    /**
     * Adjust radius of circle
     * @param {{ cx: number; cy: number; r: number; }} circle - The circle object to ajust
     */
    function adjust(circle) {
      selected.value = circle;
      adjusting.value = true;
    }

    /**
     * Push the current object state to the history array
     */
    function push() {
      history.length = ++index.value;
      history.push(clone(circles.value));
      console.log(toRaw(history));
    }

    /**
     * Undo the last operation
     */
    function undo() {
      circles.value = clone(history[--index.value]);
    }

    /**
     * Redo the last undo operation
     */
    function redo() {
      circles.value = clone(history[++index.value]);
    }

    function clone(circles) {
      return circles.map((c) => ({ ...c }));
    }

    return {
      history,
      index,
      circles,
      selected,
      adjusting,
      onClick,
      adjust,
      push,
      undo,
      redo,
    };
  },
};
