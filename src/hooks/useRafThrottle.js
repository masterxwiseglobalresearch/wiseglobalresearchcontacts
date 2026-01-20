import { useRef, useCallback } from 'react';

/**
 * useRafThrottle returns a function wrapper that ensures the wrapped callback
 * runs at most once per animation frame. If called multiple times in the same
 * frame the last arguments win.
 */
export function useRafThrottle(fn) {
  const frame = useRef(null);
  const lastArgs = useRef();
  const cb = useRef(fn);
  cb.current = fn;

  return useCallback((...args) => {
    lastArgs.current = args;
    if (frame.current == null) {
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        cb.current(...(lastArgs.current || []));
      });
    }
  }, []);
}

/**
 * throttleRaf: non-hook version for plain modules.
 */
export function throttleRaf(fn) {
  let frame = null;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (frame == null) {
      frame = requestAnimationFrame(() => {
        frame = null;
        fn(...lastArgs);
      });
    }
  };
}
