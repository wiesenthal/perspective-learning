import { useCallback, useRef, useState } from "react";

type FromPrevious<T> = (previous: T) => T;
type SetStateAction<T> = T | FromPrevious<T>;
type ReturnType<T> = [() => T, (data: SetStateAction<T>) => void];

/**
 * Custom React hook that combines useState and useRef to manage state synchronously and asynchronously.
 * This hook provides a state value that can be accessed and modified synchronously using a ref,
 * while also being updated through React's state management system to ensure component re-renders.
 *
 * @param {T} initialValue The initial value of the state.
 * @returns {ReturnType<T>} A tuple containing:
 *          - getState: A function to retrieve the current state value instantly.
 *          - setState: A function to update the state, which accepts either a new value or a function
 *                      that returns the new value based on the current state.
 *
 * @template T The type of the state.
 */
export function useRefState<T>(initialValue: T): ReturnType<T> {
  const [_state, _setState] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  const setState = useCallback((data: SetStateAction<T>) => {
    let newValue: T;

    if (typeof data === "function") {
      const fromPrevious = data as FromPrevious<T>;
      newValue = fromPrevious(ref.current);
    } else {
      newValue = data;
    }

    ref.current = newValue;
    _setState(newValue);
  }, []);

  const getState = useCallback(() => ref.current, []);

  return [getState, setState];
}
