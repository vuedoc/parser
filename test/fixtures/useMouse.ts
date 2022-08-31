/* eslint-disable no-bitwise */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import { reactive, onMounted, onUnmounted } from 'vue';

/**
 * Interface for mouse position
 * @public
 */
export interface IMouseState {
  /**
   * The x position of the mouse
   */
  x: number;
  /**
   * The y position of the mouse
   */
  y: number;
  /**
   * Whether or not the left button is held down
   */
  buttonHeld: boolean;
}

/**
 * Hook in reactive mouse position
 * @returns State of mouse as reactive and method for getting scalar distance
 * @public
 */
export default function useMouse() {
  /**
   * The state of the mouse
   */
  const mouseState: IMouseState = reactive({ x: 0, y: 0, buttonHeld: false });

  function update(event: MouseEvent) {
    mouseState.x = event.pageX;
    mouseState.y = event.pageY;
    mouseState.buttonHeld = (event.buttons & 0x1) !== 0;
  }

  /**
   * Get scalar distance of mouse position from (0,0)
   * @returns Distance of pointer from (0,0)
   */
  const mouseDistance = () => Math.sqrt(mouseState.x ** 2 + mouseState.y ** 2);

  onMounted(() => {
    window.addEventListener('mousemove', update);
    window.addEventListener('mousedown', update);
    window.addEventListener('mouseup', update);
  });
  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
    window.removeEventListener('mousedown', update);
    window.removeEventListener('mouseup', update);
  });

  return {
    mouseState,
    mouseDistance,
  };
}
